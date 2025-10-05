# Встроенные модули Node.js


---

## 1. Модуль `fs` (File System)

### Теория

Модуль `fs` предоставляет API для работы с файловой системой. Позволяет читать, записывать, удалять файлы и работать с директориями.

**Подключение модуля:**

```javascript
const fs = require('fs');
const fsPromises = require('fs').promises; // промисы
```

### Основные методы

#### 1.1 Синхронные операции (блокирующие)

```javascript
// Чтение файла синхронно
const data = fs.readFileSync('file.txt', 'utf8');

// Запись файла синхронно
fs.writeFileSync('output.txt', 'Привет, мир!');
```

**⚠️ Важно:** Синхронные методы блокируют выполнение программы!

#### 1.2 Асинхронные операции с колбэками

```javascript
// Чтение файла асинхронно
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка чтения:', err);
    return;
  }
  console.log('Содержимое:', data);
});

// Запись файла асинхронно
fs.writeFile('output.txt', 'Данные для записи', (err) => {
  if (err) {
    console.error('Ошибка записи:', err);
    return;
  }
  console.log('Файл успешно записан');
});
```

#### 1.3 Асинхронные операции с промисами

```javascript
// Чтение файла с промисами
fsPromises.readFile('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// С async/await (рекомендуемый подход)
async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Ошибка:', err);
  }
}
```

#### 1.4 Работа с директориями

```javascript
// Создание директории
fs.mkdirSync('newFolder');

// Чтение содержимого директории
const files = fs.readdirSync('.');
console.log('Файлы:', files);

// Проверка существования файла
if (fs.existsSync('file.txt')) {
  console.log('Файл существует');
}

// Удаление файла
fs.unlinkSync('file.txt');

// Удаление директории
fs.rmdirSync('newFolder');
```

#### 1.5 Получение информации о файлах

```javascript
const stats = fs.statSync('file.txt');
console.log('Размер:', stats.size);
console.log('Это файл?', stats.isFile());
console.log('Это директория?', stats.isDirectory());
console.log('Время создания:', stats.birthtime);
```

### Практические примеры

**Пример 1: Логирование в файл**

```javascript
const fs = require('fs');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  fs.appendFile('app.log', logMessage, (err) => {
    if (err) console.error('Ошибка логирования:', err);
  });
}

log('Приложение запущено');
log('Пользователь вошел в систему');
```

**Пример 2: Копирование файла**

```javascript
const fs = require('fs').promises;

async function copyFile(source, destination) {
  try {
    const data = await fs.readFile(source);
    await fs.writeFile(destination, data);
    console.log('Файл скопирован успешно');
  } catch (err) {
    console.error('Ошибка копирования:', err);
  }
}

copyFile('source.txt', 'destination.txt');
```

### Практические задания 

**Задание 1 (Базовый уровень):** Создайте программу, которая:

- Создает файл `greeting.txt` с текстом "Привет, Node.js!"
- Читает содержимое файла и выводит в консоль
- Дописывает в конец файла текущую дату и время

**Задание 2 (Средний уровень):** Напишите функцию `fileManager`, которая:

- Создает директорию `data`
- Создает в ней 3 файла с именами `file1.txt`, `file2.txt`, `file3.txt`
- Записывает в каждый файл его порядковый номер
- Выводит список всех файлов в директории

**Задание 3 (Продвинутый уровень):** Создайте программу для подсчета статистики текстового файла:

- Количество строк
- Количество слов
- Количество символов
- Самое длинное слово

---

## 2. Модуль `events` (Event Emitter)

### Теория

Модуль `events` реализует паттерн "Наблюдатель" (Observer). Позволяет создавать объекты, которые генерируют события и подписываться на эти события.

**Подключение:**

```javascript
const EventEmitter = require('events');
```

### Основные методы

#### 2.1 Создание и использование EventEmitter

```javascript
const EventEmitter = require('events');

// Создание экземпляра
const emitter = new EventEmitter();

// Подписка на событие
emitter.on('greeting', (name) => {
  console.log(`Привет, ${name}!`);
});

// Генерация события
emitter.emit('greeting', 'Алексей');
```

#### 2.2 Основные методы

```javascript
// on() - подписка на событие (может вызываться многократно)
emitter.on('event', () => console.log('Событие произошло'));

// once() - подписка на событие (сработает только один раз)
emitter.once('onetime', () => console.log('Сработает один раз'));

// removeListener() - удаление конкретного слушателя
const handler = () => console.log('Обработчик');
emitter.on('test', handler);
emitter.removeListener('test', handler);

// removeAllListeners() - удаление всех слушателей
emitter.removeAllListeners('event');

// listenerCount() - количество слушателей
console.log(emitter.listenerCount('event'));
```

#### 2.3 Передача данных через события

```javascript
emitter.on('data', (data) => {
  console.log('Получены данные:', data);
});

emitter.emit('data', { id: 1, name: 'Test' });
```

#### 2.4 Обработка ошибок

```javascript
// Всегда обрабатывайте событие 'error'
emitter.on('error', (err) => {
  console.error('Произошла ошибка:', err);
});

emitter.emit('error', new Error('Что-то пошло не так'));
```

### Практические примеры

**Пример 1: Пользовательская система логирования**

```javascript
const EventEmitter = require('events');

class Logger extends EventEmitter {
  log(message) {
    console.log(message);
    this.emit('logged', { message, timestamp: Date.now() });
  }
}

const logger = new Logger();

logger.on('logged', (data) => {
  console.log(`Залогировано в ${new Date(data.timestamp)}: ${data.message}`);
});

logger.log('Приложение запущено');
```

**Пример 2: Система уведомлений**

```javascript
const EventEmitter = require('events');

class NotificationService extends EventEmitter {
  sendNotification(user, message) {
    console.log(`Отправка уведомления для ${user}`);
    this.emit('notificationSent', { user, message, time: Date.now() });
  }
}

const notifications = new NotificationService();

// Подписчики
notifications.on('notificationSent', (data) => {
  console.log(`[Email] Отправлено ${data.user}: ${data.message}`);
});

notifications.on('notificationSent', (data) => {
  console.log(`[SMS] Отправлено ${data.user}: ${data.message}`);
});

notifications.sendNotification('Иван', 'У вас новое сообщение');
```

**Пример 3: Таймер с событиями**

```javascript
const EventEmitter = require('events');

class Timer extends EventEmitter {
  constructor(duration) {
    super();
    this.duration = duration;
    this.elapsed = 0;
  }

  start() {
    this.emit('start');
    const interval = setInterval(() => {
      this.elapsed += 1;
      this.emit('tick', this.elapsed);

      if (this.elapsed >= this.duration) {
        clearInterval(interval);
        this.emit('end');
      }
    }, 1000);
  }
}

const timer = new Timer(5);

timer.on('start', () => console.log('Таймер запущен'));
timer.on('tick', (seconds) => console.log(`Прошло секунд: ${seconds}`));
timer.on('end', () => console.log('Таймер завершен'));

timer.start();
```

### Практические задания

**Задание 1 (Базовый уровень):** Создайте класс `EventBus`, который:

- Наследуется от EventEmitter
- Имеет метод `publish(channel, message)` для публикации сообщений
- Подпишитесь на канал 'news' и выводите все сообщения в консоль

**Задание 2 (Средний уровень):** Создайте систему управления заказами:

- Класс `OrderManager` с методами `createOrder()`, `completeOrder()`, `cancelOrder()`
- Каждый метод должен генерировать соответствующее событие
- Создайте подписчиков, которые логируют каждое действие с заказом

**Задание 3 (Продвинутый уровень):** Разработайте чат-систему:

- Класс `ChatRoom` с методами `join()`, `leave()`, `sendMessage()`
- События: 'userJoined', 'userLeft', 'message'
- Отслеживайте количество пользователей в комнате
- Храните историю последних 10 сообщений

---

## 3. Модуль `path`

### Теория

Модуль `path` предоставляет утилиты для работы с путями к файлам и директориям. Работает кроссплатформенно (Windows, Linux, macOS).

**Подключение:**

```javascript
const path = require('path');
```

### Основные методы

#### 3.1 Объединение путей

```javascript
// path.join() - объединяет сегменты пути
const fullPath = path.join('folder', 'subfolder', 'file.txt');
console.log(fullPath); // folder/subfolder/file.txt (или folder\subfolder\file.txt в Windows)

// path.resolve() - создает абсолютный путь
const absolutePath = path.resolve('folder', 'file.txt');
console.log(absolutePath); // /home/user/folder/file.txt (полный путь)
```

#### 3.2 Извлечение частей пути

```javascript
const filePath = '/home/user/documents/report.pdf';

// Базовое имя (имя файла с расширением)
console.log(path.basename(filePath)); // report.pdf

// Имя файла без расширения
console.log(path.basename(filePath, '.pdf')); // report

// Директория
console.log(path.dirname(filePath)); // /home/user/documents

// Расширение файла
console.log(path.extname(filePath)); // .pdf
```

#### 3.3 Парсинг пути

```javascript
const parsed = path.parse('/home/user/file.txt');
console.log(parsed);
/* {
  root: '/',
  dir: '/home/user',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
} */

// Обратная операция
const formatted = path.format({
  dir: '/home/user',
  base: 'file.txt'
});
console.log(formatted); // /home/user/file.txt
```

#### 3.4 Нормализация пути

```javascript
// Упрощение пути
const normalized = path.normalize('/home/user/../documents/./file.txt');
console.log(normalized); // /home/documents/file.txt
```

#### 3.5 Относительные пути

```javascript
// Получение относительного пути между двумя путями
const relative = path.relative('/home/user/documents', '/home/user/pictures');
console.log(relative); // ../pictures
```

#### 3.6 Проверка типа пути

```javascript
// Абсолютный путь?
console.log(path.isAbsolute('/home/user')); // true
console.log(path.isAbsolute('user/file.txt')); // false
```

#### 3.7 Разделитель путей

```javascript
// Разделитель для текущей ОС
console.log(path.sep); // '/' в Unix, '\' в Windows

// Разделитель для PATH переменной окружения
console.log(path.delimiter); // ':' в Unix, ';' в Windows
```

### Практические примеры

**Пример 1: Работа с файлами проекта**

```javascript
const path = require('path');

// __dirname - текущая директория скрипта
const configPath = path.join(__dirname, 'config', 'settings.json');
const logsPath = path.join(__dirname, '..', 'logs', 'app.log');

console.log('Config:', configPath);
console.log('Logs:', logsPath);
```

**Пример 2: Обработка загруженных файлов**

```javascript
const path = require('path');

function processUploadedFile(filename) {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  const timestamp = Date.now();
  
  const newFilename = `${name}_${timestamp}${ext}`;
  const savePath = path.join(__dirname, 'uploads', newFilename);
  
  return {
    original: filename,
    saved: newFilename,
    path: savePath,
    extension: ext
  };
}

console.log(processUploadedFile('photo.jpg'));
```

**Пример 3: Поиск файлов определенного типа**

```javascript
const path = require('path');
const fs = require('fs');

function findFilesByExtension(directory, extension) {
  const files = fs.readdirSync(directory);
  
  return files.filter(file => {
    return path.extname(file) === extension;
  }).map(file => {
    return path.join(directory, file);
  });
}

const jsFiles = findFilesByExtension('.', '.js');
console.log('JavaScript файлы:', jsFiles);
```

### Практические задания 

**Задание 1 (Базовый уровень):** Напишите функцию `getFileInfo(filepath)`, которая возвращает объект с информацией:

- Имя файла
- Расширение
- Директория
- Является ли путь абсолютным

**Задание 2 (Средний уровень):** Создайте функцию `organizeFiles(sourceDir)`, которая:

- Читает все файлы из директории
- Группирует их по расширениям
- Создает папки для каждого типа файлов (images, documents, videos)
- Возвращает статистику по количеству файлов каждого типа

**Задание 3 (Продвинутый уровень):** Разработайте модуль для работы с проектными путями:

- Создайте класс `ProjectPaths` с методами для получения путей к различным директориям проекта (src, dist, config, logs)
- Метод для создания необходимой структуры директорий
- Метод для валидации существования путей

---

## 4. Модуль `http`

### Теория

Модуль `http` позволяет создавать HTTP-серверы и клиенты. Это основа для веб-приложений на Node.js.

**Подключение:**

```javascript
const http = require('http');
```

### Основные концепции

#### 4.1 Создание простого сервера

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // req - объект запроса (request)
  // res - объект ответа (response)
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Привет, мир!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
```

#### 4.2 Работа с запросом (Request)

```javascript
const server = http.createServer((req, res) => {
  // URL запроса
  console.log('URL:', req.url);
  
  // HTTP метод
  console.log('Метод:', req.method);
  
  // Заголовки
  console.log('Заголовки:', req.headers);
  
  // Для GET параметров нужно парсить URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log('Параметры:', url.searchParams);
  
  res.end('OK');
});
```

#### 4.3 Работа с ответом (Response)

```javascript
const server = http.createServer((req, res) => {
  // Установка статус-кода
  res.statusCode = 200;
  
  // Установка заголовков
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Custom-Header', 'MyValue');
  
  // Отправка данных
  const data = { message: 'Успех', timestamp: Date.now() };
  res.end(JSON.stringify(data));
});
```

#### 4.4 Роутинг

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // Главная страница
  if (url === '/' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<h1>Главная страница</h1>');
  }
  // API endpoint
  else if (url === '/api/users' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([
      { id: 1, name: 'Иван' },
      { id: 2, name: 'Мария' }
    ]));
  }
  // 404 - страница не найдена
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Страница не найдена');
  }
});

server.listen(3000);
```

#### 4.5 Обработка POST запросов

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/data') {
    let body = '';
    
    // Получение данных порциями
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    // Обработка после получения всех данных
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Получены данные:', data);
        
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, received: data }));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Неверный JSON' }));
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000);
```

### Практические примеры

**Пример 1: Простое REST API**

```javascript
const http = require('http');

// Имитация базы данных
let tasks = [
  { id: 1, title: 'Изучить Node.js', completed: false },
  { id: 2, title: 'Создать API', completed: false }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // GET /tasks - получить все задачи
  if (method === 'GET' && url === '/tasks') {
    res.statusCode = 200;
    res.end(JSON.stringify(tasks));
  }
  // POST /tasks - создать задачу
  else if (method === 'POST' && url === '/tasks') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const newTask = JSON.parse(body);
      newTask.id = tasks.length + 1;
      newTask.completed = false;
      tasks.push(newTask);
      
      res.statusCode = 201;
      res.end(JSON.stringify(newTask));
    });
  }
  // DELETE /tasks/:id - удалить задачу
  else if (method === 'DELETE' && url.startsWith('/tasks/')) {
    const id = parseInt(url.split('/')[2]);
    tasks = tasks.filter(task => task.id !== id);
    
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true }));
  }
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(3000, () => {
  console.log('API сервер запущен на порту 3000');
});
```

**Пример 2: Отдача статических файлов**

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Путь к файлу
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  
  // Определение MIME типа
  const extname = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
  };
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // Чтение и отправка файла
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File not found');
      } else {
        res.statusCode = 500;
        res.end('Server error');
      }
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(content);
    }
  });
});

server.listen(3000);
```

**Пример 3: HTTP клиент**

```javascript
const http = require('http');

// GET запрос
function makeGetRequest(url) {
  http.get(url, (res) => {
    let data = '';
    
    res.on('data', chunk => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Статус:', res.statusCode);
      console.log('Данные:', data);
    });
  }).on('error', (err) => {
    console.error('Ошибка:', err);
  });
}

// POST запрос
function makePostRequest(url, postData) {
  const data = JSON.stringify(postData);
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  
  const req = http.request(url, options, (res) => {
    let responseData = '';
    
    res.on('data', chunk => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Ответ:', responseData);
    });
  });
  
  req.on('error', (err) => {
    console.error('Ошибка:', err);
  });
  
  req.write(data);
  req.end();
}
```

### Практические задания 

**Задание 1 (Базовый уровень):** Создайте HTTP сервер, который:

- На главной странице (/) отображает текущее время
- На странице /about отображает информацию "О сервере"
- На странице /contact отображает контактную информацию
- Для всех остальных URL возвращает 404

**Задание 2 (Средний уровень):** Разработайте простой сервер для работы со списком книг:

- GET /books - вернуть все книги (массив объектов)
- POST /books - добавить новую книгу
- GET /books/:id - получить книгу по ID
- Данные хранить в памяти (массив)

**Задание 3 (Продвинутый уровень):** Создайте полноценное API для управления товарами:

- CRUD операции (Create, Read, Update, Delete)
- Валидация входных данных
- Подсчет количества запросов (middleware)
- Сохранение данных в JSON файл
- Обработка ошибок

---

## 5. Модуль `stream`

### Теория

Стримы (потоки) позволяют обрабатывать данные по частям, не загружая все в память сразу. Это эффективно для работы с большими файлами или данными.

**Подключение:**

```javascript
const stream = require('stream');
const fs = require('fs');
```

### Типы стримов

1. **Readable** - для чтения данных
2. **Writable** - для записи данных
3. **Duplex** - для чтения и записи
4. **Transform** - для преобразования данных

### Основные методы

#### 5.1 Readable Stream (Чтение)

```javascript
const fs = require('fs');

// Создание потока чтения
const readStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 16 * 1024 // размер буфера (16KB)
});

// Обработка данных
readStream.on('data', (chunk) => {
  console.log('Получен фрагмент:', chunk.length, 'байт');
});

// Завершение чтения
readStream.on('end', () => {
  console.log('Чтение завершено');
});

// Обработка ошибок
readStream.on('error', (err) => {
  console.error('Ошибка чтения:', err);
});
```

#### 5.2 Writable Stream (Запись)

```javascript
const fs = require('fs');

// Создание потока записи
const writeStream = fs.createWriteStream('output.txt');

// Запись данных
writeStream.write('Первая строка\n');
writeStream.write('Вторая строка\n');
writeStream.write('Третья строка\n');

// Завершение записи
writeStream.end('Последняя строка\n');

// События
writeStream.on('finish', () => {
  console.log('Запись завершена');
});

writeStream.on('error', (err) => {
  console.error('Ошибка записи:', err);
});
```

#### 5.3 Pipe (Конвейер)

```javascript
const fs = require('fs');

// Копирование файла через pipe
const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination.txt');

readStream.pipe(writeStream);

// Цепочка pipe
readStream
  .pipe(transformStream1)
  .pipe(transformStream2)
  .pipe(writeStream);
```

#### 5.4 Transform Stream (Преобразование)

```javascript
const { Transform } = require('stream');

// Создание трансформирующего потока
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // Преобразование данных
    const transformed = chunk.toString().toUpperCase();
    this.push(transformed);
    callback();
  }
});

// Использование
readStream
  .pipe(upperCaseTransform)
  .pipe(writeStream);
```

#### 5.5 Пользовательский Readable Stream

```javascript
const { Readable } = require('stream');

class NumberStream extends Readable {
  constructor(max) {
    super();
    this.current = 1;
    this.max = max;
  }

  _read() {
    if (this.current <= this.max) {
      this.push(`${this.current}\n`);
      this.current++;
    } else {
      this.push(null); // Конец потока
    }
  }
}

// Использование
const numbers = new NumberStream(10);
numbers.pipe(process.stdout);
```

#### 5.6 Пользовательский Writable Stream

```javascript
const { Writable } = require('stream');

class LogStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(`[LOG] ${chunk.toString()}`);
    callback();
  }
}

// Использование
const logger = new LogStream();
logger.write('Первое сообщение\n');
logger.write('Второе сообщение\n');
logger.end();
```

### Практические примеры

**Пример 1: Обработка большого CSV файла**

```javascript
const fs = require('fs');
const { Transform } = require('stream');

// Трансформер для обработки CSV строк
class CSVProcessor extends Transform {
  constructor() {
    super({ objectMode: true });
    this.lineNumber = 0;
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    
    lines.forEach(line => {
      if (line.trim()) {
        this.lineNumber++;
        const columns = line.split(',');
        
        // Обработка строки
        const processed = {
          line: this.lineNumber,
          data: columns,
          length: columns.length
        };
        
        this.push(JSON.stringify(processed) + '\n');
      }
    });
    
    callback();
  }
}

// Использование
const readStream = fs.createReadStream('data.csv');
const processor = new CSVProcessor();
const writeStream = fs.createWriteStream('processed.json');

readStream
  .pipe(processor)
  .pipe(writeStream)
  .on('finish', () => {
    console.log('Обработка завершена');
  });
```

**Пример 2: Сжатие файлов**

```javascript
const fs = require('fs');
const zlib = require('zlib');

// Сжатие файла
function compressFile(inputFile, outputFile) {
  const gzip = zlib.createGzip();
  const source = fs.createReadStream(inputFile);
  const destination = fs.createWriteStream(outputFile);

  source
    .pipe(gzip)
    .pipe(destination)
    .on('finish', () => {
      console.log('Файл успешно сжат');
    })
    .on('error', (err) => {
      console.error('Ошибка сжатия:', err);
    });
}

// Распаковка файла
function decompressFile(inputFile, outputFile) {
  const gunzip = zlib.createGunzip();
  const source = fs.createReadStream(inputFile);
  const destination = fs.createWriteStream(outputFile);

  source
    .pipe(gunzip)
    .pipe(destination)
    .on('finish', () => {
      console.log('Файл успешно распакован');
    });
}

compressFile('large-file.txt', 'large-file.txt.gz');
```

**Пример 3: Стриминг HTTP ответов**

```javascript
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/video') {
    const videoPath = 'video.mp4';
    const stat = fs.statSync(videoPath);
    
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size
    });
    
    // Стриминг видео
    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);
    
  } else if (req.url === '/download') {
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="file.txt"'
    });
    
    const fileStream = fs.createReadStream('file.txt');
    fileStream.pipe(res);
    
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000);
```

**Пример 4: Мониторинг производительности стрима**

```javascript
const fs = require('fs');
const { Transform } = require('stream');

class ProgressMonitor extends Transform {
  constructor() {
    super();
    this.bytesProcessed = 0;
    this.startTime = Date.now();
  }

  _transform(chunk, encoding, callback) {
    this.bytesProcessed += chunk.length;
    
    // Выводим прогресс каждые 1MB
    if (this.bytesProcessed % (1024 * 1024) === 0) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      const speed = this.bytesProcessed / elapsed / 1024 / 1024;
      
      console.log(`Обработано: ${(this.bytesProcessed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Скорость: ${speed.toFixed(2)} MB/s`);
    }
    
    this.push(chunk);
    callback();
  }

  _flush(callback) {
    const elapsed = (Date.now() - this.startTime) / 1000;
    console.log(`\nВсего обработано: ${(this.bytesProcessed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Время: ${elapsed.toFixed(2)} секунд`);
    callback();
  }
}

// Использование
const monitor = new ProgressMonitor();

fs.createReadStream('large-file.dat')
  .pipe(monitor)
  .pipe(fs.createWriteStream('output.dat'));
```

**Пример 5: Обработка данных в реальном времени**

```javascript
const { Readable, Writable } = require('stream');

// Генератор данных (симуляция сенсора)
class SensorStream extends Readable {
  constructor(options) {
    super(options);
    this.interval = setInterval(() => {
      const temperature = 20 + Math.random() * 10;
      const humidity = 40 + Math.random() * 20;
      
      const data = {
        timestamp: Date.now(),
        temperature: temperature.toFixed(2),
        humidity: humidity.toFixed(2)
      };
      
      this.push(JSON.stringify(data) + '\n');
    }, 1000);
  }

  _read() {}

  _destroy() {
    clearInterval(this.interval);
  }
}

// Анализатор данных
class DataAnalyzer extends Writable {
  constructor(options) {
    super(options);
    this.readings = [];
  }

  _write(chunk, encoding, callback) {
    const data = JSON.parse(chunk.toString());
    this.readings.push(data);
    
    console.log(`📊 Температура: ${data.temperature}°C, Влажность: ${data.humidity}%`);
    
    // Проверка тревожных значений
    if (data.temperature > 28) {
      console.log('⚠️ ВНИМАНИЕ: Высокая температура!');
    }
    
    callback();
  }
}

// Использование
const sensor = new SensorStream();
const analyzer = new DataAnalyzer();

sensor.pipe(analyzer);

// Остановка через 10 секунд
setTimeout(() => {
  sensor.destroy();
  console.log('\nМониторинг завершен');
}, 10000);
```

**Пример 6: Объединение нескольких файлов**

```javascript
const fs = require('fs');
const { pipeline } = require('stream');

function mergeFiles(fileList, outputFile, callback) {
  const output = fs.createWriteStream(outputFile);
  
  function processNextFile(index) {
    if (index >= fileList.length) {
      output.end();
      callback(null, 'Файлы объединены');
      return;
    }
    
    const input = fs.createReadStream(fileList[index]);
    
    input.pipe(output, { end: false });
    
    input.on('end', () => {
      console.log(`Файл ${fileList[index]} добавлен`);
      processNextFile(index + 1);
    });
    
    input.on('error', callback);
  }
  
  processNextFile(0);
}

// Использование
mergeFiles(
  ['part1.txt', 'part2.txt', 'part3.txt'],
  'merged.txt',
  (err, result) => {
    if (err) {
      console.error('Ошибка:', err);
    } else {
      console.log(result);
    }
  }
);
```

### Практические задания 

**Задание 1 (Базовый уровень):** Создайте программу для копирования файла с использованием стримов:

- Используйте `createReadStream` и `createWriteStream`
- Добавьте обработку событий 'data', 'end', 'error'
- Выводите прогресс копирования в консоль

**Задание 2 (Средний уровень):** Разработайте Transform stream для фильтрации текстовых данных:

- Читает текстовый файл построчно
- Удаляет пустые строки и строки-комментарии (начинающиеся с #)
- Нумерует оставшиеся строки
- Записывает результат в новый файл

**Задание 3 (Продвинутый уровень):** Создайте систему обработки логов:

- Readable stream, который генерирует случайные лог-записи
- Transform stream для парсинга и фильтрации по уровню (INFO, WARNING, ERROR)
- Writable stream, который сохраняет логи разных уровней в разные файлы
- Добавьте статистику: количество записей каждого типа

**Задание 4 (Экспертный уровень):** Разработайте утилиту для разбиения большого файла на части:

- Читает большой файл (например, 100MB)
- Разбивает на части заданного размера (например, по 10MB)
- Каждая часть сохраняется в отдельный файл (part1.dat, part2.dat, ...)
- Создайте также функцию для обратной сборки файла из частей
- Добавьте проверку целостности (контрольные суммы)

---

## Комплексные задания для закрепления материала

### Задание A: Файловый менеджер

Создайте консольное приложение для управления файлами:

- Используйте модули: `fs`, `path`, `events`
- Команды: list, create, delete, copy, move, info
- События для логирования всех операций
- Обработка ошибок

### Задание B: REST API сервер с логированием

Разработайте HTTP сервер с полным функционалом:

- CRUD операции для ресурса "пользователи"
- Логирование всех запросов в файл (используйте stream)
- Роутинг с использованием `path` для обработки URL
- События для отслеживания активности пользователей
- Валидация данных

### Задание C: Система обработки данных

Создайте pipeline для обработки данных:

- Чтение CSV файла со списком продуктов
- Фильтрация и трансформация данных
- Группировка по категориям
- Сохранение результатов в JSON
- Генерация отчета в текстовый файл
- Использование streams для эффективной обработки

### Задание D: Мониторинг сервера

Разработайте систему мониторинга:

- HTTP сервер для приема метрик
- EventEmitter для обработки событий мониторинга
- Сохранение метрик в файлы по датам (используйте path и fs)
- Stream для записи больших объемов данных
- API для получения статистики

---

## Критерии оценки работ учащихся

### Базовый уровень:

- Код работает без ошибок
- Использованы основные методы модулей
- Есть базовая обработка ошибок

### Средний уровень:

- Код хорошо структурирован
- Правильное использование async/await или промисов
- Качественная обработка ошибок
- Код читаемый и прокомментирован

### Продвинутый уровень:

- Эффективное использование всех изученных модулей
- Оптимизация производительности
- Полная обработка edge cases
- Чистый, модульный код
- Документация и примеры использования

---

## Дополнительные материалы для изучения

### Полезные ссылки:

1. Официальная документация Node.js: https://nodejs.org/docs/
2. Node.js Design Patterns (книга)
3. Stream Handbook: https://github.com/substack/stream-handbook

### Общие рекомендации:

**При работе с fs:**

- Предпочитайте асинхронные методы
- Используйте промисы (fs.promises) вместо колбэков
- Всегда обрабатывайте ошибки

**При работе с events:**

- Всегда обрабатывайте событие 'error'
- Не забывайте удалять слушателей при необходимости
- Используйте once() для одноразовых событий

**При работе с path:**

- Используйте path.join() для кроссплатформенности
- Не склеивайте пути строками
- Проверяйте абсолютность путей

**При работе с http:**

- Всегда устанавливайте правильные заголовки
- Обрабатывайте различные HTTP методы
- Используйте правильные статус-коды

**При работе с stream:**

- Используйте pipe() для простых случаев
- Обрабатывайте события 'error'
- Используйте для больших объемов данных

---

## Типичные ошибки и как их избежать

### 1. Забыли обработать ошибки

❌ **Неправильно:**

```javascript
fs.readFile('file.txt', 'utf8', (err, data) => {
  console.log(data);
});
```

✅ **Правильно:**

```javascript
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка:', err);
    return;
  }
  console.log(data);
});
```

### 2. Блокирование Event Loop

❌ **Неправильно:**

```javascript
const data = fs.readFileSync('huge-file.txt'); // Блокирует!
```

✅ **Правильно:**

```javascript
fs.readFile('huge-file.txt', (err, data) => {
  // Не блокирует
});
```

### 3. Склеивание путей строками

❌ **Неправильно:**

```javascript
const filePath = __dirname + '/' + 'file.txt';
```

✅ **Правильно:**

```javascript
const filePath = path.join(__dirname, 'file.txt');
```

### 4. Забыли закрыть стрим

❌ **Неправильно:**

```javascript
const stream = fs.createWriteStream('file.txt');
stream.write('data');
// Забыли вызвать end()
```

✅ **Правильно:**

```javascript
const stream = fs.createWriteStream('file.txt');
stream.write('data');
stream.end(); // Закрываем стрим
```

### 5. Не установили Content-Type

❌ **Неправильно:**

```javascript
res.end(JSON.stringify({ data: 'value' }));
```

✅ **Правильно:**

```javascript
res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify({ data: 'value' }));
```

---

## Домашнее задание

Выберите одно из комплексных заданий (A, B, C или D) и реализуйте его полностью. Срок выполнения: 1 неделя.

**Требования к сдаче:**

- Работающий код
- README с инструкциями по запуску
- Комментарии в коде
- Примеры использования

---
