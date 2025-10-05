const http = require('http');

// // 1. Basic server create
// const server = http.createServer((req, res) => {
//   // req - объект запроса (request)
//   // res - объект ответа (response)
  
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain; charset=utf-8');

//   // URL запроса
//   console.log('URL:', req.url);
  
//   // HTTP метод
//   console.log('Метод:', req.method);
  
//   // Заголовки
//   console.log('Заголовки:', req.headers);
  
//   // Для GET параметров нужно парсить URL
//   const url = new URL(req.url, `http://${req.headers.host}`);
//   console.log('Параметры:', url.searchParams);
  
//   res.end('OK');
// });

// const PORT = 3001;
// server.listen(PORT, () => {
//   console.log(`Сервер запущен на http://localhost:${PORT}`);
// });


// // 2. Routing
// const serverRoute = http.createServer((req, res) => {
//   const url = req.url;
//   const method = req.method;

//   // Главная страница
//   if (url === '/' && method === 'GET') {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html; charset=utf-8');
//     res.end('<h1>Главная страница</h1>');
//   }
//   // API endpoint
//   else if (url === '/api/users' && method === 'GET') {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify([
//       { id: 1, name: 'Иван' },
//       { id: 2, name: 'Мария' }
//     ]));
//   }
//   // 404 - страница не найдена
//   else {
//     res.statusCode = 404;
//     res.setHeader('Content-Type', 'text/plain; charset=utf-8');
//     res.end('Страница не найдена');
//   }
// });

// serverRoute.listen(3001);

// Имитация базы данных
let tasks = [
  { id: 1, title: 'Изучить Node.js', completed: false },
  { id: 2, title: 'Создать API', completed: false }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // OPTIONS preflight request
  if (method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Root route - test if server is running
  if (method === 'GET' && url === '/') {
    res.statusCode = 200;
    res.end(JSON.stringify({ 
      message: 'Tasks API Server is running',
      endpoints: {
        'GET /tasks': 'Get all tasks',
        'POST /tasks': 'Create new task',
        'DELETE /tasks/:id': 'Delete task by id'
      }
    }));
  }
  // GET /tasks - получить все задачи
  else if (method === 'GET' && url === '/tasks') {
    res.statusCode = 200;
    res.end(JSON.stringify(tasks));
  }
  // POST /tasks - создать задачу
  else if (method === 'POST' && url === '/tasks') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        if (!body.trim()) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Request body is required' }));
          return;
        }

        const newTask = JSON.parse(body);
        
        if (!newTask.title || typeof newTask.title !== 'string') {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Title is required and must be a string' }));
          return;
        }

        // Generate unique ID
        const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
        newTask.id = maxId + 1;
        newTask.completed = newTask.completed || false;
        tasks.push(newTask);
        
        res.statusCode = 201;
        res.end(JSON.stringify(newTask));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });
  }
  // DELETE /tasks/:id - удалить задачу
  else if (method === 'DELETE' && url.startsWith('/tasks/')) {
    const id = parseInt(url.split('/')[2]);
    
    if (isNaN(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid task ID' }));
      return;
    }

    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    
    if (tasks.length === initialLength) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Task not found' }));
    } else {
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, message: `Task ${id} deleted` }));
    }
  }
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(3001, () => {
  console.log('API сервер запущен на порту 3001');
});