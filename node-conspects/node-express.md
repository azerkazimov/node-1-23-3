
## 1. Введение в Express.js

Express.js — это минималистичный и гибкий веб-фреймворк для Node.js, который предоставляет мощные возможности для создания веб-приложений и API.

### Установка Express

```bash
npm init -y
npm install express
```

## 2. Создание веб-сервера

### Базовый сервер

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
```

### Объект приложения (app)

Объект `app` представляет приложение Express и имеет методы для:

- Маршрутизации HTTP-запросов
- Настройки middleware
- Рендеринга HTML-представлений
- Регистрации шаблонизатора

## 3. Роутинг (Routing)

Роутинг определяет, как приложение отвечает на клиентский запрос к определенной конечной точке.

### HTTP-методы

```javascript
// GET запрос
app.get('/users', (req, res) => {
  res.send('Получить всех пользователей');
});

// POST запрос
app.post('/users', (req, res) => {
  res.send('Создать нового пользователя');
});

// PUT запрос
app.put('/users/:id', (req, res) => {
  res.send('Обновить пользователя');
});

// DELETE запрос
app.delete('/users/:id', (req, res) => {
  res.send('Удалить пользователя');
});

// PATCH запрос
app.patch('/users/:id', (req, res) => {
  res.send('Частично обновить пользователя');
});
```

### Метод app.all()

Обрабатывает все HTTP-методы для указанного маршрута:

```javascript
app.all('/secret', (req, res) => {
  res.send('Доступ к секретному разделу');
});
```

## 4. Несколько маршрутов

### Множественные обработчики

```javascript
// Главная страница
app.get('/', (req, res) => {
  res.send('Главная страница');
});

// О нас
app.get('/about', (req, res) => {
  res.send('О нас');
});

// Контакты
app.get('/contact', (req, res) => {
  res.send('Контакты');
});

// API маршруты
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Товар 1' },
    { id: 2, name: 'Товар 2' }
  ]);
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Иван' },
    { id: 2, name: 'Мария' }
  ]);
});
```

### Использование Router

Express.Router позволяет создавать модульные маршруты:

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Список пользователей');
});

router.get('/:id', (req, res) => {
  res.send(`Пользователь ${req.params.id}`);
});

router.post('/', (req, res) => {
  res.send('Создать пользователя');
});

module.exports = router;

// app.js
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```

## 5. Параметры маршрута

### Параметры URL (Route Parameters)

```javascript
// Один параметр
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`ID пользователя: ${userId}`);
});

// Несколько параметров
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.send(`Пользователь: ${userId}, Пост: ${postId}`);
});

// С регулярным выражением
app.get('/users/:id(\\d+)', (req, res) => {
  res.send(`Пользователь с числовым ID: ${req.params.id}`);
});
```

### Query параметры (Query String)

```javascript
// URL: /search?query=express&page=2
app.get('/search', (req, res) => {
  const query = req.query.query;
  const page = req.query.page || 1;
  res.send(`Поиск: ${query}, Страница: ${page}`);
});
```

### Параметры в теле запроса (Body)

```javascript
// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.send(`Создан пользователь: ${name}, Email: ${email}`);
});
```

## 6. Метод route() и цепочка HTTP-методов

Метод `app.route()` позволяет создавать цепочки обработчиков маршрутов для одного пути:

```javascript
app.route('/book')
  .get((req, res) => {
    res.send('Получить список книг');
  })
  .post((req, res) => {
    res.send('Добавить новую книгу');
  })
  .put((req, res) => {
    res.send('Обновить книгу');
  })
  .delete((req, res) => {
    res.send('Удалить книгу');
  });

// С параметрами
app.route('/book/:id')
  .get((req, res) => {
    res.send(`Получить книгу ${req.params.id}`);
  })
  .put((req, res) => {
    res.send(`Обновить книгу ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`Удалить книгу ${req.params.id}`);
  });
```

### Преимущества метода route()

- Более чистый и читаемый код
- Избегание повторения пути маршрута
- Централизованная обработка всех методов для одного ресурса

## 7. Middleware (Промежуточное ПО)

Middleware — это функции, которые имеют доступ к объектам запроса (req), ответа (res) и следующей функции (next).

### Типы middleware

```javascript
// Middleware уровня приложения
app.use((req, res, next) => {
  console.log('Время:', Date.now());
  next();
});

// Middleware для конкретного маршрута
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});

// Middleware как функция-обработчик
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);

// Несколько middleware
app.get('/user/:id', 
  (req, res, next) => {
    console.log('ID:', req.params.id);
    next();
  },
  (req, res) => {
    res.send('Информация о пользователе');
  }
);
```

### Встроенные middleware

```javascript
// Парсинг JSON
app.use(express.json());

// Парсинг URL-encoded данных
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static('public'));
```

## 8. Обработка ошибок

```javascript
// Middleware обработки ошибок (должен быть последним)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то сломалось!');
});

// Обработка 404
app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});
```

## 9. Методы объекта Response

```javascript
app.get('/demo', (req, res) => {
  // Отправка текста
  res.send('Простой текст');
  
  // Отправка JSON
  res.json({ message: 'JSON ответ' });
  
  // Установка статуса
  res.status(404).send('Не найдено');
  
  // Перенаправление
  res.redirect('/new-url');
  
  // Отправка файла
  res.sendFile('/path/to/file.pdf');
  
  // Рендеринг шаблона
  res.render('index', { title: 'Express' });
  
  // Установка заголовков
  res.set('Content-Type', 'text/html');
  
  // Cookie
  res.cookie('name', 'value', { maxAge: 900000 });
});
```

## 10. Методы объекта Request

```javascript
app.get('/info', (req, res) => {
  // Параметры маршрута
  console.log(req.params);
  
  // Query параметры
  console.log(req.query);
  
  // Тело запроса
  console.log(req.body);
  
  // Заголовки
  console.log(req.headers);
  
  // Метод HTTP
  console.log(req.method);
  
  // URL
  console.log(req.url);
  console.log(req.originalUrl);
  
  // Путь
  console.log(req.path);
  
  // Cookies
  console.log(req.cookies);
  
  // IP адрес
  console.log(req.ip);
  
  res.send('Проверьте консоль');
});
```

## 11. Полный пример приложения

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Маршруты
app.get('/', (req, res) => {
  res.send('Главная страница');
});

// CRUD для пользователей
let users = [
  { id: 1, name: 'Иван', email: 'ivan@mail.ru' },
  { id: 2, name: 'Мария', email: 'maria@mail.ru' }
];

app.route('/api/users')
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    const newUser = {
      id: users.length + 1,
      name: req.body.name,
      email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
  });

app.route('/api/users/:id')
  .get((req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(user);
  })
  .put((req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    res.json(user);
  })
  .delete((req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Пользователь не найден' });
    
    users.splice(index, 1);
    res.status(204).send();
  });

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
```

## 12. Дополнительные возможности

### Шаблонизаторы

```javascript
// Установка: npm install ejs
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/profile', (req, res) => {
  res.render('profile', { 
    user: { name: 'Иван', age: 25 } 
  });
});
```

### Работа с cookie

```javascript
// Установка: npm install cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/setcookie', (req, res) => {
  res.cookie('username', 'Ivan', { maxAge: 900000, httpOnly: true });
  res.send('Cookie установлен');
});

app.get('/getcookie', (req, res) => {
  const username = req.cookies.username;
  res.send(`Username: ${username}`);
});
```

### Сессии

```javascript
// Установка: npm install express-session
const session = require('express-session');

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/login', (req, res) => {
  req.session.userId = 123;
  res.send('Вы вошли в систему');
});
```

### CORS

```javascript
// Установка: npm install cors
const cors = require('cors');
app.use(cors());

// Или настройка вручную
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## 13. Лучшие практики

1. **Структура проекта**: Организуйте код по модулям (routes, controllers, models, middleware)
2. **Валидация**: Всегда валидируйте входящие данные
3. **Обработка ошибок**: Используйте централизованную обработку ошибок
4. **Безопасность**: Используйте helmet.js для безопасности HTTP-заголовков
5. **Логирование**: Используйте morgan или winston для логирования
6. **Переменные окружения**: Используйте dotenv для конфигурации
7. **Асинхронность**: Используйте async/await для асинхронных операций

```javascript
// Пример с async/await
app.get('/api/data', async (req, res, next) => {
  try {
    const data = await fetchDataFromDatabase();
    res.json(data);
  } catch (error) {
    next(error);
  }
});
```
