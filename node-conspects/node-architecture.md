
## Содержание

1. [V8 Engine](#v8-engine)

2. [Встроенные модули Node.js](#встроенные-модули-nodejs)

3. [C++ Bindings (Посредники)](#c-bindings-посредники)

4. [Внешние модули (Express, Mocha)](#внешние-модули-express-mocha)

5. [Потоки и процессы](#потоки-и-процессы)

6. [Модели обработки запросов](#модели-обработки-запросов)

7. [Блокирующие и неблокирующие операции](#блокирующие-и-неблокирующие-операции)

8. [LibUV](#libuv)

9. [Event Loop и Thread Pool](#event-loop-и-thread-pool)

10. [Дополнительные аспекты архитектуры](#дополнительные-аспекты-архитектуры)

  

---

## V8 Engine
  

**V8** — это высокопроизводительный JavaScript движок с открытым исходным кодом, разработанный Google. Он является основой Node.js и отвечает за выполнение JavaScript кода.

  

### Ключевые особенности V8:

  

#### 1. Just-In-Time (JIT) компиляция

- V8 компилирует JavaScript непосредственно в машинный код

- Не использует промежуточный байт-код (как в других движках)

- Обеспечивает высокую производительность выполнения

  

#### 2. Архитектура компиляции

```

JavaScript код → Парсинг → AST → Ignition (интерпретатор) → TurboFan (оптимизирующий компилятор)

```

  

- **Ignition**: Интерпретатор, который быстро генерирует байт-код

- **TurboFan**: Оптимизирующий компилятор для "горячего" кода

- **Crankshaft**: Старый оптимизирующий компилятор (устарел)

  

#### 3. Управление памятью

- **Heap**: Область памяти для объектов

- **Stack**: Область памяти для примитивных типов и ссылок

- **Garbage Collector**: Автоматическая очистка неиспользуемой памяти

  

#### 4. Основные компоненты в Node.js

```javascript

// V8 предоставляет глобальные объекты

console.log(global); // Глобальный объект

console.log(process); // Объект процесса Node.js

console.log(Buffer); // Буферы для работы с бинарными данными

```

  

#### 5. V8 Embedder API

- Node.js использует V8 Embedder API для интеграции

- Позволяет создавать изолированные контексты выполнения

- Обеспечивает взаимодействие между JavaScript и C++

  

### Производительность V8:

- **Inline caching**: Кэширование результатов поиска свойств

- **Hidden classes**: Оптимизация работы с объектами

- **Escape analysis**: Определение времени жизни объектов

  

---

  

## Встроенные модули Node.js

  

Node.js поставляется с множеством встроенных модулей, которые предоставляют основную функциональность без необходимости установки дополнительных пакетов.

  

### Основные встроенные модули:

  

#### 1. Файловая система (`fs`)

```javascript

const fs = require('fs');

  

// Синхронное чтение файла

const data = fs.readFileSync('file.txt', 'utf8');

  

// Асинхронное чтение файла

fs.readFile('file.txt', 'utf8', (err, data) => {

if (err) throw err;

console.log(data);

});

  

// Promise-based API

const fsPromises = require('fs').promises;

fsPromises.readFile('file.txt', 'utf8')

.then(data => console.log(data))

.catch(err => console.error(err));

```

  

#### 2. HTTP модуль (`http`)

```javascript

const http = require('http');

  

// Создание HTTP сервера

const server = http.createServer((req, res) => {

res.writeHead(200, {'Content-Type': 'text/plain'});

res.end('Hello World!');

});

  

server.listen(3000, () => {

console.log('Server running on port 3000');

});

```

  

#### 3. Path модуль (`path`)

```javascript

const path = require('path');

  

console.log(path.join('/users', 'john', 'documents')); // /users/john/documents

console.log(path.extname('file.txt')); // .txt

console.log(path.basename('/path/to/file.txt')); // file.txt

```

Вкратце:

- `resolve`, `join`, `normalize` → для построения путей
    
- `relative`, `dirname`, `basename`, `extname` → для анализа путей
    
- `parse`, `format` → для конвертации в объект и обратно
    
- `sep`, `delimiter`, `win32`, `posix` → учёт ОС
  

#### 4. OS модуль (`os`)

```javascript

const os = require('os');

  

console.log(os.platform()); // darwin, linux, win32

console.log(os.arch()); // x64, arm64

console.log(os.cpus().length); // количество CPU ядер

console.log(os.freemem()); // свободная память

```

  

#### 5. Crypto модуль (`crypto`)

```javascript

const crypto = require('crypto');

  

// Хэширование

const hash = crypto.createHash('sha256');

hash.update('Hello World');

console.log(hash.digest('hex'));

  

// Генерация случайных байтов

crypto.randomBytes(16, (err, buffer) => {

if (err) throw err;

console.log(buffer.toString('hex'));

});

```

  

#### 6. События (`events`)

```javascript

const EventEmitter = require('events');

  

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

  

myEmitter.on('event', (data) => {

console.log('Событие произошло:', data);

});

  

myEmitter.emit('event', 'Hello World');

```

  

### Полный список основных модулей:

- `assert` - утверждения для тестирования

- `buffer` - работа с бинарными данными

- `child_process` - создание дочерних процессов

- `cluster` - создание кластеров процессов

- `dgram` - UDP сокеты

- `dns` - DNS разрешение

- `net` - TCP сервера и клиенты

- `querystring` - парсинг URL query строк

- `stream` - потоковая обработка данных

- `url` - парсинг URL

- `util` - утилиты

- `zlib` - сжатие данных

  

---

  

## C++ Bindings (Посредники)

  

C++ Bindings в Node.js обеспечивают мост между JavaScript кодом и нативными C++ библиотеками. Это позволяет Node.js получить доступ к системным API и высокопроизводительным библиотекам.

  

### Архитектура C++ Bindings:

  

```

JavaScript код

↓

V8 Engine

↓

C++ Bindings

↓

Нативные библиотеки (LibUV, OpenSSL, zlib, etc.)

↓

Системные API

```

  

### Как работают C++ Bindings:

  

#### 1. Node.js C++ Addons

```cpp

// hello.cc

#include <node.h>

  

namespace demo {

  

using v8::FunctionCallbackInfo;

using v8::Isolate;

using v8::Local;

using v8::Object;

using v8::String;

using v8::Value;

  

void Method(const FunctionCallbackInfo<Value>& args) {

Isolate* isolate = args.GetIsolate();

args.GetReturnValue().Set(String::NewFromUtf8(

isolate, "world").ToLocalChecked());

}

  

void Initialize(Local<Object> exports) {

NODE_SET_METHOD(exports, "hello", Method);

}

  

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

  

}

```

  

#### 2. N-API (Node-API)

N-API - это стабильный ABI для создания нативных дополнений:

  

```cpp

#include <node_api.h>

  

napi_value Method(napi_env env, napi_callback_info args) {

napi_value greeting;

napi_status status;

  

status = napi_create_string_utf8(env, "Hello", NAPI_AUTO_LENGTH, &greeting);

if (status != napi_ok) return nullptr;

  

return greeting;

}

  

napi_value init(napi_env env, napi_value exports) {

napi_status status;

napi_value fn;

  

status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);

if (status != napi_ok) return nullptr;

  

status = napi_set_named_property(env, exports, "hello", fn);

if (status != napi_ok) return nullptr;

  

return exports;

}

  

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

```

  

### Встроенные C++ модули в Node.js:

  

#### 1. FS (файловая система)

- Связывается с системными вызовами `open()`, `read()`, `write()`

- Использует LibUV для асинхронных операций

  

#### 2. HTTP парсер

- Использует библиотеку `http-parser` (C)

- Обеспечивает высокую производительность парсинга HTTP

  

#### 3. Crypto модуль

- Связывается с OpenSSL

- Предоставляет криптографические функции

  

#### 4. Zlib

- Связывается с библиотекой zlib

- Обеспечивает сжатие и распаковку данных

  

### Преимущества C++ Bindings:

- **Производительность**: прямой доступ к оптимизированному коду

- **Функциональность**: доступ к системным API

- **Переиспользование**: использование существующих C/C++ библиотек

  

### Недостатки:

- **Сложность**: требует знания C++

- **Портируемость**: может зависеть от платформы

- **Отладка**: сложнее отлаживать нативный код

  

---

  

## Внешние модули (Express, Mocha)

  

Внешние модули расширяют функциональность Node.js и устанавливаются через npm (Node Package Manager).

  

### Express.js

  

Express - это минималистичный и гибкий веб-фреймворк для Node.js.

  

#### Установка и базовое использование:

```bash

npm install express

```

  

```javascript

const express = require('express');

const app = express();

const port = 3000;

  

// Middleware для парсинга JSON

app.use(express.json());

  

// Базовый маршрут

app.get('/', (req, res) => {

res.send('Hello World!');

});

  

// POST маршрут

app.post('/users', (req, res) => {

const user = req.body;

res.json({ message: 'User created', user });

});

  

// Запуск сервера

app.listen(port, () => {

console.log(`Server running at http://localhost:${port}`);

});

```

  

#### Архитектура Express:
Архитектура **Express.js** в Node.js строится вокруг принципов модульности, маршрутизации и промежуточных обработчиков (**middleware**)

```

Request → Middleware Stack → Route Handler → Response

```

  

#### Middleware в Express:
Основная идея Express — "конвейер запросов". Каждый запрос проходит через цепочку функций middleware, которые могут:

- Изменить `req` или `res`;
    
- Выполнить проверку (например, авторизацию);
    
- Передать управление следующему обработчику через `next()`;
    
- Завершить обработку и отправить ответ.

```javascript

// Логирующий middleware

app.use((req, res, next) => {

console.log(`${req.method} ${req.url} - ${new Date()}`);

next();

});

  

// Middleware для обработки ошибок

app.use((err, req, res, next) => {

console.error(err.stack);

res.status(500).send('Something broke!');

});

```

  

### Mocha

  
**Mocha** — это **тестовый фреймворк для Node.js и браузера**, который используется для написания и запуска **юнит-тестов** и **интеграционных тестов**.  
Он не навязывает структуру проекта и работает с любыми assertion-библиотеками (чаще всего `Chai`).

---

## 🔹 Основные особенности

- Поддерживает **BDD** (Behavior Driven Development) и **TDD** (Test Driven Development).
    
- Позволяет создавать **синхронные** и **асинхронные** тесты.
    
- Удобные хуки (`before`, `after`, `beforeEach`, `afterEach`) для подготовки/очистки окружения.
    
- Легко интегрируется с другими инструментами: `Chai` (assertions), `Sinon` (mock/stub), `nyc` (coverage).

#### Установка:

```bash

npm install --save-dev mocha

```

  

#### Пример тестов:

```javascript

// test/math.test.js

const assert = require('assert');

  

describe('Math operations', () => {

describe('Addition', () => {

it('should add two numbers correctly', () => {

assert.equal(2 + 2, 4);

});

  

it('should handle negative numbers', () => {

assert.equal(-1 + 1, 0);

});

});

  

describe('Async operations', () => {

it('should handle async operations', (done) => {

setTimeout(() => {

assert.equal(1, 1);

done();

}, 100);

});

  

it('should handle promises', () => {

return Promise.resolve(42).then(result => {

assert.equal(result, 42);

});

});

});

});

```

  

#### Запуск тестов:

```bash

npx mocha test/

```

  

### Другие популярные внешние модули:

  

#### 1. Lodash - утилитарная библиотека
**Lodash** — это популярная JavaScript-библиотека, которая предоставляет **набор утилит** для работы с:

- массивами,
    
- объектами,
    
- строками,
    
- числами,
    
- функциями,
    
- коллекциями в целом.
    

Её главная цель — сделать код **короче, читаемее и безопаснее**.  
Часто Lodash используют вместо написания "велосипедов" для типичных операций (глубокое копирование, объединение массивов, поиск уникальных значений и т.д.).

``` bash
npm install lodash
```

```javascript

const _ = require('lodash');

  

const users = [

{ name: 'John', age: 30 },

{ name: 'Jane', age: 25 }

];

  

const names = _.map(users, 'name');

console.log(names); // ['John', 'Jane']

```

  

#### 2. Moment.js - работа с датами

**Moment.js** — это одна из самых популярных библиотек JavaScript для работы с датами и временем.  
Она позволяет легко:

- парсить (разбирать) даты из строк,
    
- форматировать даты в удобный вид,
    
- выполнять операции с датами (прибавлять/отнимать дни, месяцы и т.д.),
    
- работать с часовыми поясами и локализацией.
    

📌 Важно: c 2020 года Moment.js считается **"legacy project"** (устаревающий), и его авторы рекомендуют использовать альтернативы (например, `Day.js`, `date-fns`, `Luxon`). Но Moment до сих пор встречается в проектах.

---

## 🔹 Установка

``` bash
npm install moment
```

Использование:

```javascript

const moment = require('moment');

  

const now = moment();

console.log(now.format('YYYY-MM-DD HH:mm:ss'));

```

  

#### 3. Mongoose - ODM для MongoDB
**Mongoose** — это **ODM (Object Data Modeling) библиотека** для Node.js, которая позволяет работать с **MongoDB** через объекты JavaScript.  
Она упрощает:

- создание схем и моделей,
    
- валидацию данных,
    
- выполнение запросов к базе,
    
- работу с асинхронными операциями через промисы или `async/await`.
    

Проще говоря, Mongoose позволяет **структурировать данные в MongoDB**, которая сама по себе документно-ориентированная и схемо-свободная.

---

## 🔹 Установка

``` bash
npm install mongoose
```

Подключение к базе:

```javascript

const mongoose = require('mongoose');

  

const userSchema = new mongoose.Schema({

name: String,

email: String,

age: Number

});

  

const User = mongoose.model('User', userSchema);

```

  

### Управление зависимостями:

#### package.json

```json

{

"name": "my-app",

"version": "1.0.0",

"dependencies": {

"express": "^4.18.0",

"lodash": "^4.17.21"

},

"devDependencies": {

"mocha": "^9.2.0",

"chai": "^4.3.6"

}

}

```

  

---

  

## Потоки и процессы

### Основные концепции:

  ## **1. Процесс (Process)**

### 🔹 Определение

Процесс — это **изолированная единица выполнения**, содержащая:

- собственное адресное пространство (память),
    
- системные ресурсы (файлы, сокеты),
    
- поток(и) выполнения.
    

Каждый процесс имеет **уникальный PID (Process ID)** и работает независимо от других процессов.

---

### 🔹 Память и ресурсы

- Процессы **не разделяют память** напрямую.
    
- Каждому процессу выделяется отдельное адресное пространство (код, данные, стек).
    
- Для обмена данными между процессами используется **IPC (Inter-Process Communication)**:
    
    - Каналы (pipes)
        
    - Сокеты
        
    - Сегменты общей памяти
        
    - Сообщения (message queues)
        

---

### 🔹 Создание и управление

- Создание процесса — **дорогостоящая операция**, т.к. ОС выделяет новое адресное пространство.
    
- Пример в Linux:
    
    `fork()    # создаёт новый процесс-потомок exec()    # заменяет образ процесса новым`
    
- Процессы могут быть **родительскими и дочерними**, но изолированы друг от друга.
    

---

### 🔹 Примеры

- В Node.js каждый экземпляр Node.js — отдельный процесс.
    
- Браузеры создают отдельные процессы для вкладок.
    
- Сервер Apache создаёт процессы для обработки каждого запроса.
    

---

## **2. Поток (Thread)**

### 🔹 Определение

Поток — это **единица выполнения внутри процесса**.

- Потоки **делят память и ресурсы процесса**, но имеют **собственный стек и регистры**.
    
- Благодаря этому потоки могут работать параллельно в рамках одного процесса.
    

---

### 🔹 Память и ресурсы

- Потоки **разделяют глобальные данные и сегменты кода** процесса.
    
- Локальные переменные хранятся **в стеке потока**, глобальные — **разделяемые**.
    
- Общие данные делают возможным **быструю коммуникацию между потоками**, но требуют синхронизации (mutex, semaphore) для предотвращения гонок данных.
    

---

### 🔹 Создание и управление

- Создание потока — **быстрая операция**, менее ресурсоёмкая, чем процесс.
    
- Переключение между потоками (context switch) — быстрее, чем между процессами.
    

Пример в Node.js:

``const { Worker } = require("worker_threads");  const worker = new Worker(`   const { parentPort } = require('worker_threads');   parentPort.postMessage('Hello from worker!'); `, { eval: true });  worker.on('message', msg => console.log(msg));``

- Node.js использует **single-threaded event loop**, но через `worker_threads` можно создавать потоки для параллельной работы.
    

---

### 🔹 Примеры

- Веб-сервер может использовать несколько потоков для обработки запросов.
    
- Браузеры используют потоки для рендеринга UI, выполнения JavaScript, загрузки ресурсов.
    
- Потоки активно применяются в языках вроде Java, C#, C++ для параллельной обработки.
    

---

## **3. Сравнение: Процесс vs Поток**

| Характеристика | Процесс                             | Поток                                      |
| -------------- | ----------------------------------- | ------------------------------------------ |
| Определение    | Изолированная единица выполнения    | Единица выполнения внутри процесса         |
| Память         | Изолированное адресное пространство | Разделяют память процесса                  |
| Создание       | Медленное, дорогостоящее            | Быстрое, лёгкое                            |
| Коммуникация   | IPC (pipes, сокеты, shared memory)  | Через разделяемую память                   |
| Ошибки         | Ошибка процесса не влияет на другие | Ошибка потока может разрушить весь процесс |
| Переключение   | Медленное (context switch)          | Быстрое                                    |
| Примеры        | Node.js процесс, Chrome tab         | Worker thread, Java thread                 |


### Связь между потоками и процессами:

  

```

Процесс

├── Главный поток (Main Thread)

├── Поток 1

├── Поток 2

└── Поток N

```

  

### В контексте Node.js:

#### Основной поток JavaScript

```javascript

// Этот код выполняется в главном потоке

console.log('Main thread execution');

  

// Асинхронная операция делегируется в Thread Pool

const fs = require('fs');

fs.readFile('large-file.txt', (err, data) => {

// Callback выполняется в главном потоке

console.log('File read complete');

});

```

  

#### Worker Threads (Node.js 10.5+)

```javascript

// main.js

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

  

if (isMainThread) {

// Главный поток

const worker = new Worker(__filename, {

workerData: { num: 5 }

});

worker.postMessage('Hello');

worker.on('message', (data) => {

console.log('Received:', data);

});

worker.on('exit', (code) => {

console.log(`Worker exited with code ${code}`);

});

} else {

// Worker поток

console.log('Worker data:', workerData);

parentPort.on('message', (data) => {

parentPort.postMessage(`Echo: ${data}`);

});

}

```

  

#### Child Processes

```javascript

const { spawn, fork, exec } = require('child_process');

  

// spawn - запуск команды

const ls = spawn('ls', ['-la']);

ls.stdout.on('data', (data) => {

console.log(`stdout: ${data}`);

});

  

// fork - создание дочернего Node.js процесса

const child = fork('child-script.js');

child.send({ hello: 'world' });

child.on('message', (message) => {

console.log('Message from child:', message);

});

  

// exec - выполнение команды shell

exec('echo "Hello World"', (error, stdout, stderr) => {

if (error) {

console.error(`Error: ${error}`);

return;

}

console.log(`stdout: ${stdout}`);

});

```

  

### Кластеризация:

```javascript

const cluster = require('cluster');

const http = require('http');

const numCPUs = require('os').cpus().length;

  

if (cluster.isMaster) {

// Главный процесс

console.log(`Master ${process.pid} is running`);

  

// Fork workers

for (let i = 0; i < numCPUs; i++) {

cluster.fork();

}

  

cluster.on('exit', (worker, code, signal) => {

console.log(`Worker ${worker.process.pid} died`);

cluster.fork(); // Перезапуск упавшего воркера

});

} else {

// Worker процессы

http.createServer((req, res) => {

res.writeHead(200);

res.end('Hello world\n');

}).listen(8000);

  

console.log(`Worker ${process.pid} started`);

}

```

  

---

  

## Модели обработки запросов

  

### Давай разберём **модели обработки запросов**, начиная с традиционной.

---

## **1. Традиционная модель: один поток на один запрос**

### 🔹 Основная идея

- Каждому входящему запросу выделяется **отдельный поток** для обработки.
    
- Поток выполняет всю логику запроса (получение данных, обработку, отправку ответа).
    
- После завершения запроса поток освобождается и готов к следующему запросу.
    

---

### 🔹 Плюсы

1. **Простота реализации**: легко понять и отлаживать.
    
2. **Изоляция**: ошибка в одном запросе не влияет на другие, так как потоки работают независимо.
    

---

### 🔹 Минусы

1. **Высокое потребление ресурсов**: каждый поток занимает память и системные ресурсы.
    
2. **Ограниченная масштабируемость**: при большом количестве одновременных запросов создаётся слишком много потоков → снижение производительности.
    
3. **Контекстное переключение**: большое количество потоков → частые переключения, что замедляет обработку.
    

---

### 🔹 Схематично

```
Запрос 1  -> Поток 1 -> Обработка -> Ответ
Запрос 2  -> Поток 2 -> Обработка -> Ответ
Запрос 3  -> Поток 3 -> Обработка -> Ответ
...
```

---

### 🔹 Примеры

- Классические **Apache HTTP Server (pre-fork)**.
    
- **Java сервлеты** с моделью `Thread-per-Request`.
    

---

## **2. Альтернативные модели (для сравнения)**

### 🔹 Пул потоков (Thread Pool)

- Создаётся фиксированное количество потоков.
    
- Запросы ставятся в очередь и обрабатываются потоками из пула.
    
- **Плюс**: меньше расходов на создание потоков.
    
- **Минус**: при перегрузке очередь растёт → задержки.
    

### 🔹 Асинхронная (Event-driven) модель

- Используется **один поток (или несколько) с event loop**.
    
- Запросы не блокируют поток, асинхронные операции (I/O) обрабатываются колбэками, промисами или `async/await`.
    
- **Плюсы**: высокая масштабируемость, низкое потребление памяти.
    
- **Минусы**: сложнее отлаживать, нужно писать асинхронный код.
    

Пример: **Node.js**, **Nginx** в асинхронном режиме.

  

#### Характеристики:

- **Простота**: легко понять и отлаживать

- **Изоляция**: каждый запрос изолирован

- **Потребление памяти**: высокое (каждый поток ~2MB)

- **Переключение контекста**: дорогое

- **Масштабирование**: ограничено количеством потоков

  

#### Пример (псевдокод):

```java

// Java/C# подход

public void handleRequest(Request request) {

// Этот метод выполняется в отдельном потоке для каждого запроса

String data = database.query("SELECT * FROM users");

// Поток блокируется до завершения запроса к БД

response.send(processData(data));

}

```

  

#### Проблемы:

1. **C10K Problem**: сложность обработки 10000+ одновременных соединений

2. **Memory overhead**: каждый поток потребляет значительную память

3. **Context switching**: дорогие переключения между потоками

4. **Thread creation overhead**: создание потоков требует времени

  

### Модель Node.js: Event-driven, неблокирующий I/O

  

#### Архитектура:

```

Все запросы → Один главный поток (Event Loop) ← Thread Pool (I/O операции)

```

  

#### Характеристики:

- **Один поток**: все JavaScript код выполняется в одном потоке

- **Event Loop**: обрабатывает события и callbacks

- **Неблокирующий I/O**: I/O операции выполняются асинхронно

- **Низкое потребление памяти**: нет накладных расходов на потоки

- **Высокая производительность**: для I/O-intensive приложений

  

#### Пример Node.js:

```javascript

const http = require('http');

const fs = require('fs');

  

const server = http.createServer((req, res) => {

// Неблокирующее чтение файла

fs.readFile('large-file.txt', (err, data) => {

if (err) {

res.statusCode = 500;

res.end('Error reading file');

return;

}

// Callback выполняется когда файл прочитан

res.end(data);

});

// Этот код выполняется сразу, не ожидая чтения файла

console.log('Request received');

});

  

server.listen(3000);

```

  

### Сравнение моделей:

  

| Аспект | Один поток на запрос | Node.js модель |

|--------|----------------------|----------------|

| Память | ~2MB на поток | ~10MB общая |

| CPU | Высокое использование | Эффективное использование |

| Масштабируемость | Ограниченная | Высокая для I/O |

| Сложность | Простая | Требует понимания async |

| I/O операции | Блокирующие | Неблокирующие |

| Подходит для | CPU-intensive | I/O-intensive |

  

### Когда использовать Node.js модель:

✅ **Хорошо подходит для:**

- Web API серверы

- Чат приложения

- Streaming приложения

- Микросервисы

- I/O-intensive задачи

  

❌ **Не подходит для:**

- CPU-intensive вычисления

- Блокирующие операции

- Математические вычисления

  

---

  

## Блокирующие и неблокирующие операции

  

### Блокирующие операции

  

**Определение**: Операции, которые останавливают выполнение программы до своего завершения.

  

#### Характеристики:

- Синхронное выполнение

- Блокировка главного потока

- Простота в понимании

- Неэффективное использование ресурсов

  

#### Примеры блокирующих операций:

  

```javascript

const fs = require('fs');

  

console.log('Начало выполнения');

  

// БЛОКИРУЮЩАЯ операция - чтение файла

try {

const data = fs.readFileSync('large-file.txt', 'utf8');

console.log('Файл прочитан:', data.length, 'символов');

} catch (error) {

console.error('Ошибка чтения файла:', error.message);

}

  

console.log('Конец выполнения');

  

// Вывод:

// Начало выполнения

// Файл прочитан: 1000000 символов (только после завершения чтения)

// Конец выполнения

```

  

#### Другие примеры блокирующих операций:

```javascript

// Синхронная запись файла

fs.writeFileSync('output.txt', 'Hello World');

  

// Синхронное выполнение команды

const { execSync } = require('child_process');

const result = execSync('ls -la');

  

// Синхронное сжатие

const zlib = require('zlib');

const compressed = zlib.gzipSync(Buffer.from('Hello World'));

  

// CPU-intensive операция

function fibonacci(n) {

if (n < 2) return n;

return fibonacci(n - 1) + fibonacci(n - 2); // Блокирует поток

}

  

console.log(fibonacci(40)); // Блокирует выполнение на секунды

```

  

### Неблокирующие операции

  

**Определение**: Операции, которые не останавливают выполнение программы и используют callbacks, promises или async/await.

  

#### Характеристики:

- Асинхронное выполнение

- Не блокируют главный поток

- Эффективное использование ресурсов

- Требуют понимания асинхронности

  

#### Примеры неблокирующих операций:

  

```javascript

const fs = require('fs');

  

console.log('Начало выполнения');

  

// НЕБЛОКИРУЮЩАЯ операция - чтение файла

fs.readFile('large-file.txt', 'utf8', (error, data) => {

if (error) {

console.error('Ошибка чтения файла:', error.message);

return;

}

console.log('Файл прочитан:', data.length, 'символов');

});

  

console.log('Конец выполнения');

  

// Вывод:

// Начало выполнения

// Конец выполнения

// Файл прочитан: 1000000 символов (выполняется асинхронно)

```

  

#### Promises:

```javascript

const fs = require('fs').promises;

  

console.log('Начало выполнения');

  

fs.readFile('large-file.txt', 'utf8')

.then(data => {

console.log('Файл прочитан:', data.length, 'символов');

})

.catch(error => {

console.error('Ошибка:', error.message);

});

  

console.log('Конец выполнения');

```

  

#### Async/Await:

```javascript

const fs = require('fs').promises;

  

async function readFileExample() {

console.log('Начало выполнения');

try {

const data = await fs.readFile('large-file.txt', 'utf8');

console.log('Файл прочитан:', data.length, 'символов');

} catch (error) {

console.error('Ошибка:', error.message);

}

console.log('Конец выполнения');

}

  

readFileExample();

```

  

### Примеры операций ввода-вывода:

  

#### Работа с файлами:

```javascript

const fs = require('fs');

  

// Чтение файла

fs.readFile('input.txt', 'utf8', callback);

  

// Запись файла

fs.writeFile('output.txt', 'data', callback);

  

// Получение статистики файла

fs.stat('file.txt', callback);

  

// Чтение директории

fs.readdir('./folder', callback);

```

  

#### Сетевые операции:

```javascript

const http = require('http');

  

// HTTP запрос

const req = http.request('http://api.example.com', (res) => {

let data = '';

res.on('data', chunk => data += chunk);

res.on('end', () => console.log(data));

});

req.end();

  

// TCP сервер

const net = require('net');

const server = net.createServer((socket) => {

socket.on('data', (data) => {

console.log('Received:', data.toString());

});

});

```

  

#### Работа с базой данных:

```javascript

// MongoDB пример

const MongoClient = require('mongodb').MongoClient;

  

MongoClient.connect('mongodb://localhost:27017', (err, client) => {

if (err) throw err;

const db = client.db('mydb');

db.collection('users').find({}).toArray((err, docs) => {

if (err) throw err;

console.log('Users:', docs);

client.close();

});

});

```

  

### Паттерны обработки асинхронности:

  
#### 1. Callbacks:

```javascript

function processData(callback) {

fs.readFile('data.txt', (err, data) => {

if (err) return callback(err);

const processed = data.toString().toUpperCase();

callback(null, processed);

});

}

  

processData((err, result) => {

if (err) {

console.error('Error:', err);

} else {

console.log('Result:', result);

}

});

```

  

#### 2. Promises:

```javascript

function processData() {

return new Promise((resolve, reject) => {

fs.readFile('data.txt', (err, data) => {

if (err) return reject(err);

const processed = data.toString().toUpperCase();

resolve(processed);

});

});

}

  

processData()

.then(result => console.log('Result:', result))

.catch(err => console.error('Error:', err));

```

  

#### 3. Async/Await:

```javascript

async function processData() {

try {

const data = await fs.promises.readFile('data.txt');

const processed = data.toString().toUpperCase();

return processed;

} catch (err) {

throw err;

}

}

  

async function main() {

try {

const result = await processData();

console.log('Result:', result);

} catch (err) {

console.error('Error:', err);

}

}

  

main();

```

  

### Проблемы с блокирующими операциями в Node.js:

  

```javascript

// ПЛОХОЙ пример - блокирует Event Loop

const server = http.createServer((req, res) => {

// Блокирующая операция

const result = heavyComputation(); // 5 секунд выполнения

res.end(`Result: ${result}`);

});

  

// Все запросы будут ждать завершения предыдущего запроса

  

// ХОРОШИЙ пример - не блокирует Event Loop

const server = http.createServer((req, res) => {

// Делегирование в Worker Thread или разбиение на части

setImmediate(() => {

const result = heavyComputation();

res.end(`Result: ${result}`);

});

});

```

  

---

  

## LibUV

  

**LibUV** — это многоплатформенная C библиотека, которая обеспечивает поддержку асинхронных неблокирующих операций ввода-вывода в Node.js. Она является основой Event Loop и обеспечивает кроссплатформенную абстракцию для работы с файловой системой, сетью и другими системными ресурсами.
  

#### Основные характеристики:

- **Язык**: Написана на C

- **Платформы**: Windows, Linux, macOS, Unix

- **Назначение**: Асинхронный I/O и Event Loop

- **Создана**: Изначально для Node.js, но используется и в других проектах

  

#### История создания:

- Создана Ryan Dahl для Node.js

- Необходимость в кроссплатформенном решении для асинхронного I/O

- Объединяет различные системные API под единым интерфейсом

  

### Архитектура LibUV:

  

```

Node.js JavaScript

↓

V8 JavaScript Engine

↓

Node.js C++ Bindings

↓

LibUV

↓

Системные API (epoll, kqueue, IOCP, etc.)

```

  

### LibUV обеспечивает поддержку асинхронных неблокирующих операций

  

#### 1. Event Loop

LibUV реализует Event Loop — главный механизм обработки событий:

  

```c

// Псевдокод Event Loop в LibUV

while (loop->stop_flag == 0) {

uv_update_time(loop); // Обновление времени

uv__run_timers(loop); // Выполнение таймеров

uv__run_pending(loop); // Выполнение отложенных callbacks

uv__run_idle(loop); // Idle handles

uv__run_prepare(loop); // Prepare handles

timeout = uv_backend_timeout(loop);

uv__io_poll(loop, timeout); // Основной poll для I/O

uv__run_check(loop); // Check handles

uv__run_closing_handles(loop); // Закрытие handles

}

```

  

#### 2. Типы операций, поддерживаемых LibUV:

  

##### Файловая система:

```javascript

const fs = require('fs');

  

// LibUV обрабатывает эту операцию асинхронно

fs.readFile('file.txt', (err, data) => {

// Callback выполняется через Event Loop

console.log('File read complete');

});

```

  

##### Сетевые операции:

```javascript

const net = require('net');

  

// LibUV управляет TCP соединением

const server = net.createServer((socket) => {

socket.on('data', (data) => {

console.log('Data received:', data.toString());

});

});

```

  

##### Таймеры:

```javascript

// LibUV управляет таймерами

setTimeout(() => {

console.log('Timer executed');

}, 1000);

  

setInterval(() => {

console.log('Interval executed');

}, 500);

```

  

### Как это реализовано в LibUV

  

#### 1. Платформенные различия:

  

**Linux**: использует `epoll`

```c

// Linux implementation

int epoll_fd = epoll_create1(EPOLL_CLOEXEC);

struct epoll_event events[64];

int nfds = epoll_wait(epoll_fd, events, 64, timeout);

```

  

**macOS**: использует `kqueue`

```c

// macOS implementation

int kq = kqueue();

struct kevent events[64];

int nev = kevent(kq, NULL, 0, events, 64, &timeout);

```

  

**Windows**: использует `IOCP (I/O Completion Ports)`

```c

// Windows implementation

HANDLE iocp = CreateIoCompletionPort(INVALID_HANDLE_VALUE, NULL, 0, 0);

DWORD bytes;

ULONG_PTR key;

OVERLAPPED* overlapped;

GetQueuedCompletionStatus(iocp, &bytes, &key, &overlapped, timeout);

```

  

#### 2. Абстракция Handle:

LibUV использует концепцию "handles" для управления ресурсами:

  

```c

// Базовый handle

typedef struct uv_handle_s uv_handle_t;

  

// TCP handle

typedef struct uv_tcp_s uv_tcp_t;

  

// Timer handle

typedef struct uv_timer_s uv_timer_t;

  

// FS handle

typedef struct uv_fs_s uv_fs_t;

```

  

#### 3. Request система:

Для асинхронных операций LibUV использует requests:

  

```c

// FS request

typedef struct uv_fs_s {

uv_req_t req;

uv_fs_type fs_type;

uv_loop_t* loop;

uv_fs_cb cb;

ssize_t result;

void* ptr;

const char* path;

// ... other fields

} uv_fs_t;

```

  

### Thread Pool в LibUV

#### Концепция Thread Pool:

LibUV использует пул потоков для операций, которые не могут быть выполнены асинхронно на уровне ОС:

  

```

Main Thread (Event Loop)

↓

Thread Pool Workers

┌─────────────┐

│ Worker 1 │ ← Файловые операции

│ Worker 2 │ ← DNS резолвинг

│ Worker 3 │ ← Некоторые crypto операции

│ Worker 4 │ ← CPU-intensive задачи

└─────────────┘

↓

Результат → Event Loop → Callback

```

  

#### Операции, выполняемые в Thread Pool:

  

```javascript

// 1. Файловые операции

fs.readFile('file.txt', callback); // → Thread Pool

  

// 2. DNS операции

dns.lookup('google.com', callback); // → Thread Pool

  

// 3. Некоторые crypto операции

crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', callback); // → Thread Pool

  

// 4. Zlib операции

zlib.gzip(buffer, callback); // → Thread Pool

```

  

#### Настройка размера Thread Pool:

```bash

# Установка размера thread pool (по умолчанию 4)

UV_THREADPOOL_SIZE=8 node app.js

```

  

```javascript

// Проверка размера thread pool

console.log('Thread pool size:', process.env.UV_THREADPOOL_SIZE || 4);

```

  

### Системные вызовы и LibUV:

  

#### Прямые системные вызовы (не Thread Pool):

```javascript

// TCP/UDP операции

const net = require('net');

const server = net.createServer(); // epoll/kqueue/IOCP

  

// HTTP операции

const http = require('http');

const server = http.createServer(); // Использует TCP

  

// Pipe операции

const { spawn } = require('child_process');

const child = spawn('ls'); // pipe communication

```

  

#### Операции через Thread Pool:

```javascript

// Файловые операции

fs.readFile(); // → Thread Pool → File system API

  

// CPU операции

crypto.pbkdf2(); // → Thread Pool → Crypto calculations

  

// DNS

dns.lookup(); // → Thread Pool → DNS resolution

```

  

### Производительность LibUV:

#### Оптимизации:

1. **Event Loop**: минимальное количество системных вызовов

2. **Batching**: группировка I/O операций

3. **Caching**: кэширование результатов DNS

4. **Connection pooling**: переиспользование соединений

  

#### Мониторинг производительности:

```javascript

// Измерение задержки Event Loop

let start = process.hrtime();

  

setImmediate(() => {

const delta = process.hrtime(start);

const nanosec = delta[0] * 1e9 + delta[1];

const millisec = nanosec / 1e6;

console.log(`Event Loop delay: ${millisec}ms`);

});

```

  

### Интеграция с Node.js:

  

```cpp

// Пример интеграции LibUV с Node.js (упрощено)

namespace node {

  

void StartEventLoop() {

uv_loop_t* loop = uv_default_loop();

// Инициализация V8

v8::Isolate* isolate = v8::Isolate::GetCurrent();

// Запуск Event Loop

while (uv_run(loop, UV_RUN_DEFAULT)) {

// Обработка V8 задач

isolate->RunMicrotasks();

}

}

  

}

```

  

---

  

## Event Loop и Thread Pool

  

Event Loop и Thread Pool — это ключевые компоненты архитектуры Node.js, обеспечивающие асинхронное выполнение операций.

  

### Event Loop (Цикл событий)

  

#### Что такое Event Loop?

Event Loop — это механизм, который позволяет Node.js выполнять неблокирующие I/O операции, несмотря на то, что JavaScript является однопоточным.

  

#### Архитектура Event Loop:

  

```

┌───────────────────────────┐

┌─>│ timers │ ← setTimeout, setInterval

│ └─────────────┬─────────────┘

│ ┌─────────────┴─────────────┐

│ │ pending callbacks │ ← I/O callbacks (TCP, UDP)

│ └─────────────┬─────────────┘

│ ┌─────────────┴─────────────┐

│ │ idle, prepare │ ← Внутренние операции

│ └─────────────┬─────────────┘

│ ┌─────────────┴─────────────┐

│ │ poll │ ← Новые I/O события

│ └─────────────┬─────────────┘

│ ┌─────────────┴─────────────┐

│ │ check │ ← setImmediate callbacks

│ └─────────────┬─────────────┘

│ ┌─────────────┴─────────────┐

└──┤ close callbacks │ ← Закрытие ресурсов

└───────────────────────────┘

```

  

#### Фазы Event Loop:

  

##### 1. Timers Phase

Выполняет callbacks от `setTimeout()` и `setInterval()`

  

```javascript

console.log('Start');

  

setTimeout(() => {

console.log('Timer 1');

}, 0);

  

setTimeout(() => {

console.log('Timer 2');

}, 0);

  

console.log('End');

  

// Вывод:

// Start

// End

// Timer 1

// Timer 2

```

  

##### 2. Pending Callbacks Phase

Выполняет I/O callbacks, которые были отложены

  

```javascript

const fs = require('fs');

  

fs.readFile('file.txt', (err, data) => {

console.log('File read callback'); // Выполняется в pending callbacks

});

```

  

##### 3. Idle, Prepare Phase

Внутренние операции Node.js

  

##### 4. Poll Phase

Самая важная фаза — получение новых I/O событий и выполнение их callbacks

  

```javascript

const net = require('net');

  

const server = net.createServer((socket) => {

socket.on('data', (data) => {

console.log('Data received'); // Poll phase

});

});

```

  

##### 5. Check Phase

Выполняет callbacks от `setImmediate()`

  

```javascript

setImmediate(() => {

console.log('Immediate 1');

});

  

setImmediate(() => {

console.log('Immediate 2');

});

  

// Выполняется в check phase

```

  

##### 6. Close Callbacks Phase

Выполняет callbacks при закрытии ресурсов

  

```javascript

const server = require('http').createServer();

  

server.on('close', () => {

console.log('Server closed'); // Close callbacks phase

});

  

server.close();

```

  

#### Приоритеты выполнения:

  

```javascript

console.log('=== Start ===');

  

// Microtasks (высший приоритет)

Promise.resolve().then(() => console.log('Promise 1'));

process.nextTick(() => console.log('NextTick 1'));

  

// Timers

setTimeout(() => console.log('Timer'), 0);

  

// Check phase

setImmediate(() => console.log('Immediate'));

  

// Microtasks

Promise.resolve().then(() => console.log('Promise 2'));

process.nextTick(() => console.log('NextTick 2'));

  

console.log('=== End ===');

  

// Вывод:

// === Start ===

// === End ===

// NextTick 1

// NextTick 2

// Promise 1

// Promise 2

// Timer

// Immediate

```

  

#### Microtasks vs Macrotasks:

  

**Microtasks** (высший приоритет):

- `process.nextTick()`

- `Promise.resolve().then()`

- `queueMicrotask()`

  

**Macrotasks**:

- `setTimeout()`, `setInterval()`

- `setImmediate()`

- I/O callbacks

  

### Thread Pool

  

#### Что такое Thread Pool?

Thread Pool — это набор рабочих потоков, которые выполняют операции, не поддерживающие асинхронность на уровне ОС.

  

#### Размер Thread Pool:

```javascript

// По умолчанию: 4 потока

// Можно изменить через переменную окружения

process.env.UV_THREADPOOL_SIZE = '8';

  

// Или при запуске приложения:

// UV_THREADPOOL_SIZE=8 node app.js

```

  

#### Операции, выполняемые в Thread Pool:

  

##### 1. Файловые операции:

```javascript

const fs = require('fs');

  

// Эти операции выполняются в Thread Pool

fs.readFile('file1.txt', callback1); // Worker Thread 1

fs.readFile('file2.txt', callback2); // Worker Thread 2

fs.readFile('file3.txt', callback3); // Worker Thread 3

fs.readFile('file4.txt', callback4); // Worker Thread 4

fs.readFile('file5.txt', callback5); // Ожидает освобождения потока

```

  

##### 2. DNS резолвинг:

```javascript

const dns = require('dns');

  

dns.lookup('google.com', (err, address) => {

console.log('Google IP:', address); // Выполнено в Thread Pool

});

```

  

##### 3. Криптографические операции:

```javascript

const crypto = require('crypto');

  

// CPU-intensive операция в Thread Pool

crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {

console.log('Key derived:', derivedKey.toString('hex'));

});

```

  

##### 4. Компрессия:

```javascript

const zlib = require('zlib');

  

zlib.gzip(Buffer.from('Hello World'), (err, compressed) => {

console.log('Compressed:', compressed); // Thread Pool

});

```

  

#### Демонстрация Thread Pool:

  

```javascript

const fs = require('fs');

const crypto = require('crypto');

  

console.log('Starting operations...');

const start = Date.now();

  

// Запускаем 6 операций (Thread Pool size = 4)

for (let i = 0; i < 6; i++) {

crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, key) => {

console.log(`Operation ${i + 1} completed in ${Date.now() - start}ms`);

});

}

  

// Возможный вывод:

// Starting operations...

// Operation 1 completed in 150ms

// Operation 2 completed in 155ms

// Operation 3 completed in 160ms

// Operation 4 completed in 165ms // Первые 4 — параллельно

// Operation 5 completed in 310ms // Следующие 2 — после завершения первых

// Operation 6 completed in 315ms

```

  

### Мониторинг Event Loop:

  

#### 1. Event Loop Lag:

```javascript

function measureEventLoopLag() {

const start = process.hrtime.bigint();

setImmediate(() => {

const lag = process.hrtime.bigint() - start;

console.log(`Event Loop lag: ${Number(lag) / 1000000}ms`);

});

}

  

// Запускать каждую секунду

setInterval(measureEventLoopLag, 1000);

```

  

#### 2. Active Handles и Requests:

```javascript

console.log('Active handles:', process._getActiveHandles().length);

console.log('Active requests:', process._getActiveRequests().length);

  

// Детальная информация

const activeHandles = process._getActiveHandles();

activeHandles.forEach((handle, index) => {

console.log(`Handle ${index}:`, handle.constructor.name);

});

```

  

#### 3. Memory Usage:

```javascript

function logMemoryUsage() {

const usage = process.memoryUsage();

console.log({

rss: `${(usage.rss / 1024 / 1024).toFixed(2)} MB`, // Resident Set Size

heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,

heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,

external: `${(usage.external / 1024 / 1024).toFixed(2)} MB`

});

}

  

setInterval(logMemoryUsage, 5000);

```

  

### Проблемы с блокировкой Event Loop:

  

#### Пример блокирующей операции:

```javascript

const http = require('http');

  

const server = http.createServer((req, res) => {

// ПЛОХО: блокирует Event Loop

const start = Date.now();

while (Date.now() - start < 5000) {

// Имитация CPU-intensive операции

}

res.end('Done after 5 seconds');

});

  

server.listen(3000);

```

  

#### Решение через разбиение задач:

```javascript

const server = http.createServer((req, res) => {

// ХОРОШО: не блокирует Event Loop

heavyOperationAsync((result) => {

res.end(`Result: ${result}`);

});

});

  

function heavyOperationAsync(callback) {

let i = 0;

const limit = 1000000;

function processChunk() {

const chunkSize = 10000;

const end = Math.min(i + chunkSize, limit);

// Обработка части данных

while (i < end) {

// Какие-то вычисления

i++;

}

if (i < limit) {

// Передать управление Event Loop

setImmediate(processChunk);

} else {

callback('Operation completed');

}

}

processChunk();

}

```

  

#### Worker Threads для CPU-intensive задач:

```javascript

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

  

if (isMainThread) {

// Основной поток

const http = require('http');

const server = http.createServer((req, res) => {

const worker = new Worker(__filename, {

workerData: { operation: 'heavy_calculation' }

});

worker.on('message', (result) => {

res.end(`Result: ${result}`);

});

worker.on('error', (error) => {

res.statusCode = 500;

res.end(`Error: ${error.message}`);

});

});

server.listen(3000);

} else {

// Worker поток

const { operation } = workerData;

if (operation === 'heavy_calculation') {

let result = 0;

for (let i = 0; i < 10000000; i++) {

result += Math.sqrt(i);

}

parentPort.postMessage(result);

}

}

```

  

---

  

## Дополнительные аспекты архитектуры

  

### Memory Management (Управление памятью)

  

#### Heap и Stack в Node.js:

  

```javascript

// Stack memory - примитивы и ссылки

let num = 42; // Stack

let str = "Hello"; // Stack (ссылка), Heap (значение)

let bool = true; // Stack

  

// Heap memory - объекты

let obj = { a: 1 }; // Stack (ссылка), Heap (объект)

let arr = [1, 2, 3]; // Stack (ссылка), Heap (массив)

```

  

#### Garbage Collection:

```javascript

// Демонстрация работы GC

function createMemoryLeak() {

const largeArray = new Array(1000000).fill('data');

// Без правильной очистки - утечка памяти

return function() {

console.log(largeArray.length);

};

}

  

// Мониторинг памяти

setInterval(() => {

if (global.gc) {

global.gc(); // Принудительный сбор мусора

}

const usage = process.memoryUsage();

console.log(`Memory: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`);

}, 1000);

```

  

#### Memory Leaks Prevention:

```javascript

// Правильное управление ресурсами

const fs = require('fs');

const EventEmitter = require('events');

  

class DataProcessor extends EventEmitter {

constructor() {

super();

this.data = new Map();

// Автоматическая очистка

this.cleanupInterval = setInterval(() => {

this.cleanup();

}, 60000);

}

cleanup() {

// Очистка старых данных

const now = Date.now();

for (const [key, value] of this.data) {

if (now - value.timestamp > 300000) { // 5 minutes

this.data.delete(key);

}

}

}

destroy() {

clearInterval(this.cleanupInterval);

this.data.clear();

this.removeAllListeners();

}

}

```

  

### Streams (Потоки данных)

  

#### Типы потоков:

```javascript

const fs = require('fs');

const { Transform } = require('stream');

  

// Readable Stream

const readStream = fs.createReadStream('large-file.txt');

readStream.on('data', (chunk) => {

console.log(`Received ${chunk.length} bytes`);

});

  

// Writable Stream

const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Hello ');

writeStream.write('World!');

writeStream.end();

  

// Transform Stream

const upperCaseTransform = new Transform({

transform(chunk, encoding, callback) {

this.push(chunk.toString().toUpperCase());

callback();

}

});

  

// Pipeline

const pipeline = require('util').promisify(require('stream').pipeline);

  

async function processFile() {

try {

await pipeline(

fs.createReadStream('input.txt'),

upperCaseTransform,

fs.createWriteStream('output.txt')

);

console.log('Pipeline completed');

} catch (error) {

console.error('Pipeline error:', error);

}

}

```

  

#### Backpressure handling:

```javascript

const { Readable, Writable } = require('stream');

  

class SlowWritable extends Writable {

_write(chunk, encoding, callback) {

// Имитация медленной записи

setTimeout(() => {

console.log(`Wrote: ${chunk.toString()}`);

callback();

}, 100);

}

}

  

class FastReadable extends Readable {

constructor(options) {

super(options);

this.i = 0;

}

_read() {

if (this.i < 100) {

this.push(`data-${this.i++}\n`);

} else {

this.push(null); // End stream

}

}

}

  

const readable = new FastReadable();

const writable = new SlowWritable();

  

// Автоматическое управление backpressure

readable.pipe(writable);

```

  

### Cluster Module (Кластеризация)

  

#### Master-Worker архитектура:

```javascript

const cluster = require('cluster');

const http = require('http');

const numCPUs = require('os').cpus().length;

  

if (cluster.isMaster) {

console.log(`Master ${process.pid} is running`);

// Создание worker процессов

for (let i = 0; i < numCPUs; i++) {

const worker = cluster.fork();

// Коммуникация с worker

worker.send({ cmd: 'config', data: { port: 3000 + i } });

}

// Обработка событий от workers

cluster.on('message', (worker, message) => {

console.log(`Message from worker ${worker.process.pid}:`, message);

});

// Автоматический перезапуск упавших workers

cluster.on('exit', (worker, code, signal) => {

console.log(`Worker ${worker.process.pid} died`);

console.log('Starting a new worker');

cluster.fork();

});

// Graceful shutdown

process.on('SIGTERM', () => {

console.log('Master received SIGTERM');

for (const id in cluster.workers) {

cluster.workers[id].kill();

}

});

} else {

// Worker процесс

const server = http.createServer((req, res) => {

res.writeHead(200);

res.end(`Hello from worker ${process.pid}\n`);

});

server.listen(3000, () => {

console.log(`Worker ${process.pid} started`);

});

// Обработка сообщений от master

process.on('message', (message) => {

if (message.cmd === 'config') {

console.log('Worker received config:', message.data);

}

});

// Отправка сообщений master

process.send({ worker: process.pid, status: 'ready' });

}

```

  

### Error Handling (Обработка ошибок)

  

#### Типы ошибок в Node.js:

```javascript

// 1. Synchronous errors

try {

JSON.parse('invalid json');

} catch (error) {

console.error('Sync error:', error.message);

}

  

// 2. Callback errors

fs.readFile('nonexistent.txt', (error, data) => {

if (error) {

console.error('Callback error:', error.message);

return;

}

console.log(data);

});

  

// 3. Promise rejections

Promise.reject(new Error('Promise error'))

.catch(error => {

console.error('Promise error:', error.message);

});

  

// 4. Event emitter errors

const EventEmitter = require('events');

const emitter = new EventEmitter();

  

emitter.on('error', (error) => {

console.error('EventEmitter error:', error.message);

});

  

emitter.emit('error', new Error('Something went wrong'));

```

  

#### Global error handling:

```javascript

// Unhandled promise rejections

process.on('unhandledRejection', (reason, promise) => {

console.error('Unhandled Rejection at:', promise, 'reason:', reason);

// Логирование и graceful shutdown

process.exit(1);

});

  

// Uncaught exceptions

process.on('uncaughtException', (error) => {

console.error('Uncaught Exception:', error);

// Аварийное завершение

process.exit(1);

});

  

// Warning events

process.on('warning', (warning) => {

console.warn(warning.name); // Print the warning name

console.warn(warning.message); // Print the warning message

console.warn(warning.stack); // Print the stack trace

});

```

  

### Security (Безопасность)

  

#### Основные принципы безопасности:

```javascript

const crypto = require('crypto');

const bcrypt = require('bcrypt');

  

// 1. Хэширование паролей

async function hashPassword(password) {

const saltRounds = 12;

return await bcrypt.hash(password, saltRounds);

}

  

// 2. Генерация безопасных токенов

function generateSecureToken() {

return crypto.randomBytes(32).toString('hex');

}

  

// 3. Валидация ввода

function validateInput(input) {

if (typeof input !== 'string') {

throw new Error('Invalid input type');

}

if (input.length > 1000) {

throw new Error('Input too long');

}

// Санитизация

return input.replace(/[<>]/g, '');

}

  

// 4. Rate limiting

const rateLimit = new Map();

  

function checkRateLimit(clientId, limit = 100, window = 60000) {

const now = Date.now();

const clientData = rateLimit.get(clientId) || { count: 0, resetTime: now + window };

if (now > clientData.resetTime) {

clientData.count = 0;

clientData.resetTime = now + window;

}

if (clientData.count >= limit) {

throw new Error('Rate limit exceeded');

}

clientData.count++;

rateLimit.set(clientId, clientData);

}

```

  

### Performance Optimization (Оптимизация производительности)

  

#### Профилирование и мониторинг:

```javascript

// 1. CPU профилирование

console.time('operation');

// Какая-то операция

console.timeEnd('operation');

  

// 2. Memory profiling

function trackMemory(label) {

const usage = process.memoryUsage();

console.log(`${label}:`, {

rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,

heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,

heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,

external: `${Math.round(usage.external / 1024 / 1024)}MB`

});

}

  

// 3. Event Loop monitoring

let start = process.hrtime();

setImmediate(() => {

const delta = process.hrtime(start);

const nanosec = delta[0] * 1e9 + delta[1];

const millisec = nanosec / 1e6;

console.log(`Event Loop delay: ${millisec.toFixed(2)}ms`);

start = process.hrtime();

});

```

  

#### Оптимизация производительности:

```javascript

// 1. Connection pooling

const http = require('http');

const agent = new http.Agent({

keepAlive: true,

maxSockets: 10,

maxFreeSockets: 5,

timeout: 60000

});

  

// 2. Caching

const cache = new Map();

  

function cachedFunction(key) {

if (cache.has(key)) {

return Promise.resolve(cache.get(key));

}

return expensiveOperation(key).then(result => {

cache.set(key, result);

return result;

});

}

  

// 3. Lazy loading

class LazyLoader {

constructor() {

this._modules = new Map();

}

getModule(name) {

if (!this._modules.has(name)) {

this._modules.set(name, require(name));

}

return this._modules.get(name);

}

}

  

// 4. Object pooling

class ObjectPool {

constructor(createFn, resetFn) {

this.createFn = createFn;

this.resetFn = resetFn;

this.pool = [];

}

acquire() {

return this.pool.pop() || this.createFn();

}

release(obj) {

this.resetFn(obj);

this.pool.push(obj);

}

}

```

  

---

  
