
## 1. Однопоточность Node.js и проблема блокирования

### Основная концепция

Node.js работает в **одном потоке** (single-threaded), что означает:

- Весь JavaScript код выполняется последовательно в одном основном потоке
- Если одна операция занимает поток надолго, все остальные операции ждут своей очереди
- **Блокирование потока** = замораживание всего приложения

### Пример блокирующего кода:

```javascript
// ПЛОХО - блокирует поток
function heavyCalculation() {
    let result = 0;
    for (let i = 0; i < 10000000000; i++) {
        result += i;
    }
    return result;
}

console.log('Начало');
const result = heavyCalculation(); // Весь Node.js замирает здесь
console.log('Конец'); // Выполнится только после завершения цикла
```

### Почему это проблема?

- Веб-сервер не сможет обрабатывать другие запросы
- UI перестанет отвечать
- База данных не получит ответа
- **Вывод**: Основной поток нужно освобождать как можно быстрее!

---

## 2. Асинхронное выполнение без блокирования

### Принцип асинхронности

Вместо ожидания результата операции, мы:

1. Запускаем операцию
2. Регистрируем callback (функцию обратного вызова)
3. Продолжаем выполнение другого кода
4. Когда операция завершится, вызывается callback

### Пример асинхронного кода:

```javascript
// ХОРОШО - не блокирует поток
const fs = require('fs');

console.log('1. Начало');

fs.readFile('file.txt', 'utf8', (err, data) => {
	if (err) return
    console.log('3. Файл прочитан:', data);
});

console.log('2. Продолжаем работу');

// Вывод:
// 1. Начало
// 2. Продолжаем работу
// 3. Файл прочитан: (содержимое файла)
```

### Механизмы асинхронности:

- **Callbacks** (колбэки)
- **Promises** (промисы)
- **Async/Await** (синтаксический сахар над промисами)

---

## 3. Event Loop (Цикл событий)

### Что такое Event Loop?

**Event Loop** - это механизм, который позволяет Node.js выполнять неблокирующие операции, несмотря на однопоточность JavaScript.

### Основная задача Event Loop:

1. Выполнять JavaScript код
2. Собирать и обрабатывать события
3. Выполнять задачи из очереди

### Простая аналогия:

Представьте официанта в ресторане:

- Он один (один поток)
- Принимает заказы (регистрирует callbacks)
- Передает заказы на кухню (делегирует в LibUV)
- Приносит готовые блюда (выполняет callbacks)
- Не ждет у плиты, пока готовится еда (не блокирует поток)

---

## 4. Колбэки, зарегистрированные для разных событий

### Что такое колбэк?

Колбэк - это функция, которая будет вызвана когда:

- Завершится асинхронная операция
- Произойдет определенное событие
- Истечет таймер

### Примеры регистрации колбэков:

```javascript
// 1. Колбэк для таймера
setTimeout(() => {
    console.log('Таймер истек');
}, 1000);

// 2. Колбэк для чтения файла
fs.readFile('data.txt', (err, data) => {
    console.log('Файл прочитан');
});

// 3. Колбэк для HTTP запроса
http.get('http://api.example.com', (response) => {
    console.log('Ответ получен');
});

// 4. Колбэк для события
emitter.on('custom-event', () => {
    console.log('Событие произошло');
});

// 5. setImmediate
setImmediate(() => {
    console.log('Выполнится в следующей итерации');
});
```

### Очереди колбэков:

- Каждый тип события имеет свою очередь
- Event Loop проходит по этим очередям в определенном порядке
- Колбэки выполняются когда Event Loop доходит до их очереди

---

## 5. LibUV и пул потоков (Thread Pool)

### Что такое LibUV?

**LibUV** - это кросс-платформенная библиотека на C++, которая:

- Реализует Event Loop
- Управляет асинхронными операциями
- Предоставляет пул потоков для блокирующих операций
- Абстрагирует различия между операционными системами

### Thread Pool (пул потоков):

Несмотря на то, что JavaScript однопоточный, LibUV использует **пул потоков** для:

- Операций с файловой системой (fs)
- DNS запросов (dns.lookup)
- Криптографических операций (crypto)
- Сжатия данных (zlib)
- Некоторых операций с папками

```javascript
// Эта операция использует thread pool
fs.readFile('huge-file.txt', (err, data) => {
    // Чтение происходит в отдельном потоке из пула
    // Колбэк выполнится в основном потоке
});
```

### Архитектура:

```
┌─────────────────┐
│  JavaScript     │  ← Один поток
│  (V8 Engine)    │
└────────┬────────┘
         │
    ┌────▼────┐
    │ LibUV   │
    │Event Loop│
    └────┬────┘
         │
    ┌────▼──────────────┐
    │   Thread Pool     │
    │ ┌──┐ ┌──┐ ┌──┐ ┌──┐│
    │ │T1│ │T2│ │T3│ │T4││  ← По умолчанию 4 потока
    │ └──┘ └──┘ └──┘ └──┘│
    └───────────────────┘
```

---

## 6. Настройка Thread Pool

### Количество потоков по умолчанию: 4

### Как изменить количество потоков:

```javascript
// Установить ПЕРЕД запуском приложения
process.env.UV_THREADPOOL_SIZE = 8;

// Или в командной строке:
// UV_THREADPOOL_SIZE=8 node app.js
```

### Ограничения:

- **Минимум**: 4 потока
- **Максимум**: 1024 потока
- **Рекомендация**: Количество ядер CPU × 2

### Когда увеличивать:

```javascript
// Если у вас много операций с файлами:
const fs = require('fs');

process.env.UV_THREADPOOL_SIZE = 16;

// 10 одновременных операций чтения
for (let i = 0; i < 10; i++) {
    fs.readFile(`file${i}.txt`, (err, data) => {
        console.log(`Файл ${i} прочитан`);
    });
}
// С 4 потоками: выполнится 4 + 4 + 2
// С 16 потоками: выполнится все одновременно
```

---

## 7. Операции I/O и CPU-интенсивные задачи

### I/O операции (Input/Output):

Операции ввода-вывода, которые **ждут внешних ресурсов**:

```javascript
// 1. Файловая система
fs.readFile('data.txt')      // Чтение файла
fs.writeFile('data.txt')     // Запись файла

// 2. Сетевые запросы
http.get('http://api.com')   // HTTP запрос
database.query('SELECT...')  // Запрос к БД

// 3. Таймеры
setTimeout(() => {}, 1000)   // Ожидание времени
```

**Особенность I/O**: Процессор большую часть времени простаивает, ожидая ответа от диска/сети/БД.

### CPU-интенсивные задачи:

Операции, которые **нагружают процессор**:

```javascript
// 1. Вычисления
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
fibonacci(40); // Процессор работает на 100%

// 2. Обработка больших данных
const bigArray = Array(1000000).fill(0);
bigArray.map(x => x * 2).filter(x => x > 5);

// 3. Криптография
crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512');

// 4. Парсинг JSON
JSON.parse(hugJsonString);
```

**Особенность CPU**: Процессор постоянно занят вычислениями.

### Важное различие:

```javascript
// I/O - не блокирует Event Loop (если асинхронная)
fs.readFile('file.txt', callback); // ✅ Хорошо

// CPU - БЛОКИРУЕТ Event Loop
for (let i = 0; i < 1000000000; i++) {} // ❌ Плохо
```

---

## 8. Делегирование задач в LibUV

### Принцип делегирования:

### Два пути выполнения:

#### Путь 1: ОС может выполнить асинхронно

```javascript
// Сетевые операции
const server = http.createServer();
server.listen(3000); // ОС управляет сетевыми сокетами

// TCP/UDP операции
net.createConnection(); // ОС обрабатывает асинхронно
```

**Механизм**: ОС использует системные вызовы:

- Linux: `epoll`
- macOS: `kqueue`
- Windows: `IOCP` (I/O Completion Ports)

#### Путь 2: ОС НЕ может выполнить асинхронно

```javascript
// Файловые операции
fs.readFile('file.txt'); // → Thread Pool

// DNS lookup
dns.lookup('google.com'); // → Thread Pool

// Криптография
crypto.pbkdf2('password', 'salt', 100000, 64); // → Thread Pool
```

**Механизм**: LibUV использует Thread Pool.

### Схема принятия решения:

```
Асинхронная операция
         │
         ▼
    ┌─────────────────┐
    │  LibUV решает:  │
    │  Может ли ОС?   │
    └────────┬────────┘
             │
      ┌──────┴──────┐
      │             │
    ДА             НЕТ
      │             │
      ▼             ▼
┌──────────┐  ┌──────────┐
│ОС обраба-│  │ Thread   │
│тывает    │  │ Pool     │
│асинхронно│  │          │
└────┬─────┘  └────┬─────┘
     │             │
     └──────┬──────┘
            ▼
      Event Queue
            │
            ▼
       Callback
```

---

## 9. Thread Pool и Event Queue: принцип работы Event Loop

### Компоненты системы:

#### 1. Call Stack (Стек вызовов):

```javascript
function first() {
    second();
}
function second() {
    console.log('Hello');
}
first();

// Call Stack:
// | console.log |
// | second()    |
// | first()     |
```

#### 2. Event Queue (Очередь событий):

Очередь колбэков, ожидающих выполнения.

#### 3. Thread Pool:

Пул потоков для блокирующих операций.

### Полная схема работы:

```
┌──────────────────────────────────────────────────┐
│              ОСНОВНОЙ ПОТОК                      │
│                                                  │
│  ┌─────────────┐         ┌──────────────┐        │
│  │ Call Stack  │         │  Heap        │        │
│  │             │         │  (память)    │        │
│  └──────┬──────┘         └──────────────┘        │
│         │                                        │
│         │  JavaScript код                        │
│         ▼                                        │
│  ┌─────────────────────────────────────┐         │
│  │         V8 Engine                   │         │
│  └─────────────┬───────────────────────┘         │
└────────────────┼─────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│              LibUV / Event Loop                │
│                                                │
│  ┌──────────────────────────────────┐          │
│  │       Event Queue                │          │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐     │          │
│  │  │CB1 │→│CB2 │→│CB3 │→│CB4 │     │          │
│  │  └────┘ └────┘ └────┘ └────┘     │          │
│  └──────────────────────────────────┘          │
│                                                │
│  ┌──────────────────────────────────┐          │
│  │       Thread Pool                │          │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐     │          │
│  │  │ T1 │ │ T2 │ │ T3 │ │ T4 │     │          │
│  │  └────┘ └────┘ └────┘ └────┘     │          │
│  └──────────────────────────────────┘          │
│                                                │
│  ┌──────────────────────────────────┐          │
│  │    Системные вызовы ОС           │          │
│  │   (epoll, kqueue, IOCP)          │          │
│  └──────────────────────────────────┘          │
└────────────────────────────────────────────────┘
```

### Пошаговый процесс:

**Шаг 1**: Регистрация асинхронной операции

```javascript
fs.readFile('file.txt', callback);
// → LibUV получает задачу
```

**Шаг 2**: Делегирование

```
LibUV решает → Thread Pool (для fs.readFile)
```

**Шаг 3**: Выполнение в фоновом потоке

```
Thread #2 читает файл с диска
Основной поток продолжает работу
```

**Шаг 4**: Завершение операции

```
Thread #2 завершил чтение → callback помещается в Event Queue
```

**Шаг 5**: Event Loop забирает callback

```
Event Loop проверяет: Call Stack пуст?
Если да → берет callback из очереди и выполняет
```

---

## 10. Псевдокод Event Loop

```javascript
// Упрощенный псевдокод работы Event Loop

while (есть_работа_для_выполнения) {
    
    // Фаза 1: Timers
    выполнить_все_истекшие_setTimeout_callbacks();
    выполнить_все_истекшие_setInterval_callbacks();
    
    // Фаза 2: Pending callbacks
    выполнить_отложенные_IO_callbacks();
    
    // Фаза 3: Idle, prepare
    выполнить_внутренние_операции_nodejs();
    
    // Фаза 4: Poll (самая важная фаза)
    вычислить_сколько_времени_блокировать();
    
    if (есть_готовые_IO_events) {
        выполнить_IO_callbacks();
    } else {
        if (есть_setImmediate_callbacks) {
            перейти_к_фазе_check();
        } else if (есть_активные_таймеры) {
            ждать_до_истечения_таймера();
        } else {
            ждать_новых_IO_events();
        }
    }
    
    // Фаза 5: Check
    выполнить_все_setImmediate_callbacks();
    
    // Фаза 6: Close callbacks
    выполнить_все_close_callbacks(); // socket.on('close')
    
    // После каждой фазы (microtasks):
    выполнить_все_process_nextTick_callbacks();
    выполнить_все_promise_callbacks();
}

// Выход из цикла
завершить_процесс_nodejs();
```

### Детальный псевдокод с проверками:

```javascript
function eventLoop() {
    while (true) {
        
        // ===== ФАЗА 1: TIMERS =====
        const expiredTimers = timersQueue.getExpired();
        for (const timer of expiredTimers) {
            timer.callback();
            
            // Microtasks после каждого callback
            processMicrotasks();
        }
        
        // ===== ФАЗА 2: PENDING CALLBACKS =====
        const pendingCallbacks = pendingQueue.getAll();
        for (const callback of pendingCallbacks) {
            callback();
            processMicrotasks();
        }
        
        // ===== ФАЗА 3: IDLE / PREPARE =====
        runInternalOperations();
        
        // ===== ФАЗА 4: POLL =====
        const timeout = calculatePollTimeout();
        const ioEvents = pollForIOEvents(timeout);
        
        for (const event of ioEvents) {
            event.callback();
            processMicrotasks();
        }
        
        // ===== ФАЗА 5: CHECK =====
        const immediateCallbacks = immediateQueue.getAll();
        for (const callback of immediateCallbacks) {
            callback();
            processMicrotasks();
        }
        
        // ===== ФАЗА 6: CLOSE =====
        const closeCallbacks = closeQueue.getAll();
        for (const callback of closeCallbacks) {
            callback();
            processMicrotasks();
        }
        
        // Проверка: есть ли еще работа?
        if (shouldContinue() === false) {
            break; // Выход из цикла
        }
    }
}

function processMicrotasks() {
    // Сначала process.nextTick
    while (nextTickQueue.length > 0) {
        const callback = nextTickQueue.shift();
        callback();
    }
    
    // Потом Promise callbacks
    while (promiseQueue.length > 0) {
        const callback = promiseQueue.shift();
        callback();
    }
}

function shouldContinue() {
    return (
        timersQueue.length > 0 ||
        pendingQueue.length > 0 ||
        immediateQueue.length > 0 ||
        activeRequests.length > 0 ||
        activeHandles.length > 0
    );
}
```

---

## 11. Группы событий в цикле событий (Event Loop Phases)

### Схема фаз Event Loop:

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘

        После каждой фазы:
        ┌─────────────────┐
        │  nextTick()     │
        │  Promise micro  │
        └─────────────────┘
```

---

### ФАЗА 1: TIMERS

**Назначение**: Выполнение колбэков для истекших таймеров.

**Функции**:

- `setTimeout(callback, delay)`
- `setInterval(callback, delay)`

**Как работает**:

```javascript
console.log('1. Start');

setTimeout(() => {
    console.log('3. Timeout 100ms');
}, 100);

setTimeout(() => {
    console.log('4. Timeout 0ms');
}, 0);

console.log('2. End');

// Вывод:
// 1. Start
// 2. End
// 4. Timeout 0ms (выполнится в следующей итерации Event Loop)
// 3. Timeout 100ms
```

**Важно**:

- Таймер НЕ гарантирует точное время выполнения
- Это минимальная задержка, а не точная
- Если Call Stack занят, callback подождет

**Пример с задержкой**:

```javascript
const start = Date.now();

setTimeout(() => {
    console.log('Задержка:', Date.now() - start, 'мс');
}, 100);

// Блокируем поток на 200ms
const end = Date.now() + 200;
while (Date.now() < end) {}

// Вывод: Задержка: 200+ мс (не 100!)
```

---

### ФАЗА 2: PENDING CALLBACKS

**Назначение**: Выполнение I/O колбэков, отложенных из предыдущей итерации.

**Примеры**:

- Ошибки TCP соединений
- Некоторые системные операции

```javascript
// Обычно эта фаза используется внутри Node.js
// Разработчики редко взаимодействуют с ней напрямую

const net = require('net');
const socket = net.connect(9999, 'невалидный_хост');

socket.on('error', (err) => {
    // Этот callback может попасть в pending callbacks
    console.log('Ошибка соединения');
});
```

**Особенность**: Большинство I/O callbacks выполняются в фазе **poll**, а не здесь.

---

### ФАЗА 3: IDLE / PREPARE

**Назначение**: Внутренние операции Node.js.

**Характеристика**:

- Используется только внутри Node.js
- Разработчики не имеют к ней прямого доступа
- Подготовка к фазе poll

```javascript
// Нет публичного API для этой фазы
// Используется для внутренних нужд LibUV
```

---

### ФАЗА 4: POLL (Самая важная!)

**Назначение**:

1. Получение новых I/O событий
2. Выполнение I/O колбэков

**Что происходит**:

```javascript
const fs = require('fs');

// 1. Регистрация операции
fs.readFile('file.txt', (err, data) => {
    // 3. Этот callback выполнится в фазе POLL
    console.log('Файл прочитан');
});

// 2. Event Loop ждет в фазе POLL, пока файл не прочитается
```

**Логика фазы Poll**:

```javascript
// Псевдокод фазы Poll

if (poll_queue_has_callbacks) {
    // Выполнить все callbacks из очереди
    execute_all_callbacks_synchronously();
    
} else {
    // Очередь пуста
    
    if (setImmediate_queue_has_callbacks) {
        // Если есть setImmediate, перейти к фазе check
        goto_check_phase();
        
    } else if (active_timers_exist) {
        // Если есть активные таймеры, подождать до ближайшего
        wait_until_nearest_timer();
        goto_timers_phase();
        
    } else {
        // Ждать новых I/O событий
        block_and_wait_for_io_events();
    }
}
```

**Пример блокировки в Poll**:

```javascript
const fs = require('fs');

console.log('1. Start');

// Нет таймеров, нет setImmediate
// Event Loop будет ЖДАТЬ в фазе Poll

fs.readFile('file.txt', (err, data) => {
    console.log('2. File read');
});

// Без других событий, приложение не завершится
// Будет ждать завершения чтения файла
```

---

### ФАЗА 5: CHECK

**Назначение**: Выполнение `setImmediate()` колбэков.

**Функция**: `setImmediate(callback)`

```javascript
const fs = require('fs');

fs.readFile('file.txt', (err, data) => {
	if(err) return
    console.log('1. File callback');
    
    setTimeout(() => {
        console.log('3. setTimeout');
    }, 0);
    
    setImmediate(() => {
        console.log('2. setImmediate');
    });
});

// Вывод:
// 1. File callback
// 2. setImmediate (выполнится в текущей итерации, фаза check)
// 3. setTimeout (выполнится в следующей итерации, фаза timers)
```

**Отличие от setTimeout**:

```javascript
// В корне приложения порядок НЕ гарантирован:
setTimeout(() => {
    console.log('timeout');
}, 0);

setImmediate(() => {
    console.log('immediate');
});
// Порядок может быть разным!

// Но внутри I/O callback порядок гарантирован:
fs.readFile('file.txt', () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0);
    
    setImmediate(() => {
        console.log('immediate');
    });
});
// Вывод всегда:
// immediate
// timeout
```

---

### ФАЗА 6: CLOSE CALLBACKS

**Назначение**: Выполнение колбэков закрытия соединений.

**События**:

- `socket.on('close')`
- `server.on('close')`
- `process.on('exit')`

```javascript
const net = require('net');

const socket = net.connect(3000, 'localhost');

socket.on('close', () => {
    // Этот callback выполнится в фазе Close
    console.log('Socket closed');
});

socket.end(); // Закрываем сокет
```

**Пример с сервером**:

```javascript
const http = require('http');

const server = http.createServer();

server.listen(3000);

server.close(() => {
    // Фаза Close callbacks
    console.log('Server shut down');
});
```

---

### CONTINUE: Продолжать или завершить цикл?

**Условия продолжения**:

```javascript
function shouldEventLoopContinue() {
    return (
        // Есть активные таймеры?
        timers.length > 0 ||
        
        // Есть pending операции?
        pendingOperations.length > 0 ||
        
        // Есть открытые сокеты/серверы?
        openHandles.length > 0 ||
        
        // Есть активные запросы?
        activeRequests.length > 0
    );
}

// Если все false → Event Loop завершается
```

**Пример завершения**:

```javascript
console.log('Start');

setTimeout(() => {
    console.log('End');
}, 1000);

// Event Loop продолжит работать 1 секунду
// Затем завершится, так как нет больше работы
```

**Пример бесконечного цикла**:

```javascript
const server = http.createServer();
server.listen(3000);

// Event Loop НИКОГДА не завершится
// Сервер - это открытый handle
```

**Принудительное завершение**:

```javascript
process.exit(0); // Завершить немедленно
```

---

## 12. СОБЫТИЯ nextTick и колбэки промисов (Microtasks)

### Microtasks Queue (Очередь микрозадач)

**Особенность**: Выполняется **МЕЖДУ** фазами Event Loop, а не внутри них.

```
┌─────────────┐
│   Фаза 1    │
└──────┬──────┘
       │
   ┌───▼───┐
   │MICRO  │
   │TASKS  │ ← process.nextTick() и Promise callbacks
   └───┬───┘
       │
┌──────▼──────┐
│   Фаза 2    │
└──────┬──────┘
       │
   ┌───▼───┐
   │MICRO  │
   │TASKS  │
   └───┬───┘
       │
      ...
```

---

### process.nextTick()

**Что это?**: Специальная функция Node.js для выполнения колбэка **немедленно после текущей операции**, но **до** Event Loop.

**Синтаксис**:

```javascript
process.nextTick(callback, [arg1, arg2, ...]);
```

**Пример базовый**:

```javascript
console.log('1. Start');

setTimeout(() => {
    console.log('4. setTimeout');
}, 0);

process.nextTick(() => {
    console.log('2. nextTick');
});

console.log('3. End');

// Вывод:
// 1. Start
// 3. End
// 2. nextTick (до Event Loop!)
// 4. setTimeout (в Event Loop)
```

**Приоритет выполнения**:

```javascript
console.log('1');

setTimeout(() => console.log('5'), 0);
setImmediate(() => console.log('6'));

Promise.resolve().then(() => console.log('3'));

process.nextTick(() => console.log('2'));

process.nextTick(() => {
    console.log('4');
    process.nextTick(() => console.log('nested nextTick'));
});

console.log('7');

// Вывод:
// 1
// 7
// 2
// 4
// nested nextTick
// 3
// 5 или 6 (порядок может варьироваться)
// 6 или 5
```

**Очередность**:

1. Синхронный код
2. **process.nextTick()** (все из очереди)
3. **Promise microtasks**
4. Event Loop фазы

---

### Когда использовать process.nextTick():

#### 1. Обработка ошибок асинхронно

```javascript
function asyncOperation(callback) {
    if (typeof callback !== 'function') {
        // Плохо - синхронный throw
        // throw new TypeError('Callback must be a function');
        
        // Хорошо - асинхронная ошибка
        process.nextTick(() => {
            throw new TypeError('Callback must be a function');
        });
        return;
    }
    
    // Асинхронная операция
    process.nextTick(callback);
}
```

#### 2. Гарантия асинхронного выполнения

```javascript
class MyEmitter extends EventEmitter {
    constructor() {
        super();
        
        // Плохо - событие до подписки
        // this.emit('ready');
        
        // Хорошо - событие после подписки
        process.nextTick(() => {
            this.emit('ready');
        });
    }
}

const emitter = new MyEmitter();
emitter.on('ready', () => {
    console.log('Событие получено');
});
```

#### 3. Очистка ресурсов

```javascript
function cleanup(resource) {
    process.nextTick(() => {
        resource.close();
        resource = null;
    });
}
```

---

### ОПАСНОСТЬ process.nextTick() - "Голодание" Event Loop

**Проблема**: nextTick может заблокировать Event Loop!

```javascript
// ❌ ПЛОХО - Бесконечная рекурсия
function dangerous() {
    process.nextTick(dangerous);
}
dangerous();

// Event Loop НИКОГДА не перейдет к следующей фазе!
// setTimeout, setImmediate, I/O - ничего не выполнится!

setTimeout(() => {
    console.log('Я никогда не выполнюсь!');
}, 0);
```

**Почему опасно**:

```javascript
let count = 0;

function recursiveNextTick() {
    console.log('nextTick:', count++);
    
    if (count < 1000000) {
        process.nextTick(recursiveNextTick);
    }
}

recursiveNextTick();

// Event Loop заблокирован!
// Все 1,000,000 nextTick выполнятся до перехода к таймерам!
```

**Лимит**: В Node.js есть ограничение `process.maxTickDepth` (устарело), но всё равно можно заблокировать цикл.

---

### Promise callbacks (Microtasks)

**Что это?**: Колбэки промисов тоже являются microtasks.

**Примеры**:

```javascript
Promise.resolve().then(() => {
    console.log('Promise 1');
});

Promise.resolve().then(() => {
    console.log('Promise 2');
});

console.log('Sync');

// Вывод:
// Sync
// Promise 1
// Promise 2
```

---

### Приоритет: nextTick vs Promise

```javascript
Promise.resolve().then(() => console.log('Promise'));

process.nextTick(() => console.log('nextTick'));

// Вывод:
// nextTick (ВСЕГДА раньше!)
// Promise
```

**Правило**:

1. Сначала ВСЯ очередь `nextTick`
2. Потом ВСЯ очередь `Promise`
3. Затем следующая фаза Event Loop

---

### Полный пример с microtasks:

```javascript
console.log('1: Sync start');

setTimeout(() => {
    console.log('6: setTimeout');
    
    process.nextTick(() => {
        console.log('7: nextTick in setTimeout');
    });
    
    Promise.resolve().then(() => {
        console.log('8: Promise in setTimeout');
    });
}, 0);

setImmediate(() => {
    console.log('9: setImmediate');
});

Promise.resolve()
    .then(() => {
        console.log('3: Promise 1');
        return Promise.resolve();
    })
    .then(() => {
        console.log('4: Promise 2');
    });

process.nextTick(() => {
    console.log('2: nextTick 1');
    
    process.nextTick(() => {
        console.log('5: nextTick nested');
    });
});

console.log('10: Sync end');

// Вывод:
// 1: Sync start
// 10: Sync end
// 2: nextTick 1
// 5: nextTick nested
// 3: Promise 1
// 4: Promise 2
// 6: setTimeout
// 7: nextTick in setTimeout
// 8: Promise in setTimeout
// 9: setImmediate
```

---

### Рекомендации по использованию:

#### ✅ Используйте nextTick:

- Для обработки ошибок асинхронно
- Для гарантии порядка событий
- Для отложенной очистки ресурсов

#### ⚠️ Избегайте nextTick:

- Для рекурсивных вызовов
- Для длительных операций
- Когда можно использовать setImmediate

#### ✅ Используйте Promises:

- Для асинхронного кода (предпочтительнее callbacks)
- Для цепочек операций
- С async/await для читаемости

---

## 13. СОБЫТИЯ setImmediate

### Что такое setImmediate()?

**Определение**: `setImmediate()` выполняет колбэк в **фазе Check** Event Loop, после фазы Poll.

**Синтаксис**:

```javascript
setImmediate(callback, [arg1, arg2, ...]);
```

**Базовый пример**:

```javascript
console.log('1: Start');

setImmediate(() => {
    console.log('2: setImmediate');
});

console.log('3: End');

// Вывод:
// 1: Start
// 3: End
// 2: setImmediate (в следующей итерации Event Loop)
```

---

### Принцип работы setImmediate

**Когда выполняется**:

```
Event Loop Iteration:

Timers → Pending → Idle → Poll → CHECK ← setImmediate здесь!
                                    ↓
                                 Close
```

**Пример в I/O callback**:

```javascript
const fs = require('fs');

fs.readFile('file.txt', (err, data) => {
    console.log('1: File read (Poll phase)');
    
    setTimeout(() => {
        console.log('3: setTimeout (next Timers phase)');
    }, 0);
    
    setImmediate(() => {
        console.log('2: setImmediate (current Check phase)');
    });
});

// Вывод ВСЕГДА:
// 1: File read
// 2: setImmediate (текущая итерация)
// 3: setTimeout (следующая итерация)
```

---

### setImmediate vs setTimeout(0)

#### В корне приложения (непредсказуемо):

```javascript
setTimeout(() => {
    console.log('setTimeout');
}, 0);

setImmediate(() => {
    console.log('setImmediate');
});

// Порядок НЕ гарантирован!
// Может быть:
// setTimeout → setImmediate
// ИЛИ
// setImmediate → setTimeout
```

**Почему?**:

- Зависит от производительности системы
- setTimeout(0) на самом деле setTimeout(1)
- Если Event Loop входит в Timers фазу за <1ms, setTimeout выполнится первым
- Если Event Loop входит за >1ms, setImmediate выполнится первым

#### Внутри I/O callback (предсказуемо):

```javascript
const fs = require('fs');

fs.readFile('file.txt', () => {
    setTimeout(() => {
        console.log('2: setTimeout');
    }, 0);
    
    setImmediate(() => {
        console.log('1: setImmediate');
    });
});

// Вывод ВСЕГДА:
// 1: setImmediate (текущая итерация, фаза Check)
// 2: setTimeout (следующая итерация, фаза Timers)
```

**Почему?**:

- I/O callback выполняется в фазе Poll
- После Poll идет Check (setImmediate)
- Timers будет только в следующей итерации

---

### Приоритет выполнения

```javascript
console.log('1: Sync');

Promise.resolve().then(() => {
    console.log('2: Promise');
});

process.nextTick(() => {
    console.log('3: nextTick');
});

setImmediate(() => {
    console.log('4: setImmediate');
});

setTimeout(() => {
    console.log('5: setTimeout');
}, 0);

// Вывод:
// 1: Sync
// 3: nextTick (microtask, высший приоритет)
// 2: Promise (microtask)
// 5 или 4 (зависит от таймингов)
// 4 или 5
```

**Иерархия**:

1. Синхронный код
2. `process.nextTick()`
3. Promise microtasks
4. `setTimeout()` / `setImmediate()` (зависит от контекста)

---

### Множественные setImmediate

```javascript
setImmediate(() => {
    console.log('Immediate 1');
    
    setImmediate(() => {
        console.log('Immediate 3 (next iteration)');
    });
});

setImmediate(() => {
    console.log('Immediate 2');
});

// Вывод:
// Immediate 1
// Immediate 2
// Immediate 3 (next iteration)
```

**Поведение**:

- Все setImmediate из одной итерации выполняются вместе
- Вложенные setImmediate попадают в следующую итерацию

---

### setImmediate с microtasks

```javascript
setImmediate(() => {
    console.log('1: setImmediate');
    
    process.nextTick(() => {
        console.log('2: nextTick in setImmediate');
    });
    
    Promise.resolve().then(() => {
        console.log('3: Promise in setImmediate');
    });
});

setImmediate(() => {
    console.log('4: setImmediate 2');
});

// Вывод:
// 1: setImmediate
// 2: nextTick in setImmediate (microtask между setImmediate)
// 3: Promise in setImmediate (microtask)
// 4: setImmediate 2
```

**Правило**: Microtasks выполняются между каждым setImmediate callback.

---

### Практические примеры использования

#### Пример 1: Разбиение тяжелой работы

```javascript
function processLargeArray(array) {
    const CHUNK_SIZE = 1000;
    let index = 0;
    
    function processChunk() {
        const end = Math.min(index + CHUNK_SIZE, array.length);
        
        for (let i = index; i < end; i++) {
            // Обработка элемента
            heavyOperation(array[i]);
        }
        
        index = end;
        
        if (index < array.length) {
            // Отдаем управление Event Loop между чанками
            setImmediate(processChunk);
        } else {
            console.log('Обработка завершена');
        }
    }
    
    processChunk();
}

// Преимущество: Event Loop может обработать другие события между чанками
```

#### Пример 2: Рекурсивная обработка без блокировки

```javascript
// ❌ ПЛОХО - блокирует Event Loop
function recursiveBad(n) {
    if (n === 0) return;
    heavyOperation();
    recursiveBad(n - 1);
}
recursiveBad(10000); // Блокирует надолго!

// ✅ ХОРОШО - не блокирует Event Loop
function recursiveGood(n) {
    if (n === 0) return;
    heavyOperation();
    
    setImmediate(() => {
        recursiveGood(n - 1);
    });
}
recursiveGood(10000); // Другие события могут выполняться между вызовами
```

#### Пример 3: Гарантия асинхронного API

```javascript
class AsyncEmitter extends EventEmitter {
    emitAsync(event, ...args) {
        setImmediate(() => {
            this.emit(event, ...args);
        });
    }
}

const emitter = new AsyncEmitter();

emitter.on('data', (data) => {
    console.log('Получено:', data);
});

console.log('1: До emit');
emitter.emitAsync('data', 'Hello');
console.log('2: После emit');

// Вывод:
// 1: До emit
// 2: После emit
// Получено: Hello (асинхронно!)
```

---

### setImmediate vs process.nextTick - когда что использовать?

#### ✅ Используйте setImmediate:

```javascript
// 1. Разбиение длительных операций
function processHugeFile() {
    // Читаем и обрабатываем по частям
    readChunk();
    setImmediate(processHugeFile); // Даем дышать Event Loop
}

// 2. Отложенное выполнение без высокого приоритета
setImmediate(() => {
    cleanupResources();
});

// 3. Рекурсивные операции
function traverse(node) {
    processNode(node);
    node.children.forEach(child => {
        setImmediate(() => traverse(child));
    });
}
```

#### ✅ Используйте process.nextTick:

```javascript
// 1. Гарантия асинхронности, но с высоким приоритетом
function asyncAPI(callback) {
    process.nextTick(callback);
}

// 2. Обработка ошибок
function readConfig(callback) {
    if (!fs.existsSync('config.json')) {
        process.nextTick(() => {
            callback(new Error('Config not found'));
        });
        return;
    }
    // ...
}

// 3. События до следующей фазы Event Loop
emitter.emit('ready');
process.nextTick(() => {
    emitter.emit('started');
});
```

---

### Сравнительная таблица

|Характеристика|process.nextTick|setImmediate|
|---|---|---|
|**Когда выполняется**|Между фазами Event Loop|В фазе Check|
|**Приоритет**|Самый высокий|Обычный (после Poll)|
|**Риск блокировки**|Высокий ⚠️|Низкий ✅|
|**Предсказуемость**|Всегда до Event Loop|В контексте Event Loop|
|**Использование**|Критичные операции|Разбиение работы|

---

### Сложный пример со всеми компонентами

```javascript
const fs = require('fs');

console.log('1: Start');

// Microtasks
process.nextTick(() => console.log('2: nextTick 1'));
Promise.resolve().then(() => console.log('3: Promise 1'));

// Event Loop: Timers
setTimeout(() => {
    console.log('7: setTimeout 1');
    process.nextTick(() => console.log('8: nextTick in setTimeout'));
}, 0);

setTimeout(() => {
    console.log('9: setTimeout 2');
}, 0);

// Event Loop: Check
setImmediate(() => {
    console.log('10: setImmediate 1');
    process.nextTick(() => console.log('11: nextTick in setImmediate'));
});

setImmediate(() => {
    console.log('12: setImmediate 2');
});

// I/O
fs.readFile(__filename, () => {
    console.log('13: I/O callback');
    
    setTimeout(() => console.log('16: setTimeout in I/O'), 0);
    setImmediate(() => console.log('14: setImmediate in I/O'));
    
    process.nextTick(() => console.log('15: nextTick in I/O'));
});

// Microtasks
process.nextTick(() => console.log('4: nextTick 2'));
Promise.resolve().then(() => console.log('5: Promise 2'));

console.log('6: End');

// Примерный вывод:
// 1: Start
// 6: End
// 2: nextTick 1
// 4: nextTick 2
// 3: Promise 1
// 5: Promise 2
// 7: setTimeout 1
// 9: setTimeout 2
// 8: nextTick in setTimeout
// 10: setImmediate 1
// 12: setImmediate 2
// 11: nextTick in setImmediate
// 13: I/O callback
// 15: nextTick in I/O
// 14: setImmediate in I/O (текущая итерация)
// 16: setTimeout in I/O (следующая итерация)
```

---

## 14. Блокирующие операции

### Что такое блокирующая операция?

**Определение**: Операция, которая **занимает Event Loop надолго** и не дает выполняться другим событиям.

### Примеры блокирующих операций:

#### 1. Сложные вычисления

```javascript
// ❌ БЛОКИРУЕТ Event Loop
function calculateFibonacci(n) {
    if (n <= 1) return n;
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

console.log('Start');
const result = calculateFibonacci(40); // Блокирует на несколько секунд!
console.log('End');

// Проблема: Веб-сервер не сможет отвечать на запросы
```

#### 2. Синхронные операции с файлами

```javascript
// ❌ БЛОКИРУЕТ
const fs = require('fs');

console.log('1: Start');
const data = fs.readFileSync('huge-file.txt', 'utf8'); // Блокирует!
console.log('2: File read');
console.log('3: End');

// ✅ НЕ БЛОКИРУЕТ
console.log('1: Start');
fs.readFile('huge-file.txt', 'utf8', (err, data) => {
    console.log('3: File read');
});
console.log('2: End');
```

#### 3. Циклы с большим количеством итераций

```javascript
// ❌ БЛОКИРУЕТ
function processArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        // Если arr.length = 10,000,000 - Event Loop заблокирован!
        arr[i] = arr[i] * 2;
    }
}

// ✅ НЕ БЛОКИРУЕТ (обработка чанками)
function processArrayAsync(arr, chunkSize = 1000) {
    let index = 0;
    
    function processChunk() {
        const end = Math.min(index + chunkSize, arr.length);
        
        for (let i = index; i < end; i++) {
            arr[i] = arr[i] * 2;
        }
        
        index = end;
        
        if (index < arr.length) {
            setImmediate(processChunk); // Отдаем управление Event Loop
        }
    }
    
    processChunk();
}
```

#### 4. Парсинг больших JSON

```javascript
// ❌ БЛОКИРУЕТ
const hugeJson = fs.readFileSync('huge.json', 'utf8');
const parsed = JSON.parse(hugeJson); // Может заблокировать на секунды!

// ✅ РЕШЕНИЕ: Стриминг
const JSONStream = require('JSONStream');
const stream = fs.createReadStream('huge.json');
const parser = JSONStream.parse('*');

stream.pipe(parser);
parser.on('data', (data) => {
    // Обработка по частям, не блокирует Event Loop
});
```

---

### Как обнаружить блокирование?

#### Метод 1: Измерение задержки Event Loop

```javascript
let lastCheck = Date.now();

setInterval(() => {
    const now = Date.now();
    const delay = now - lastCheck - 1000; // Ожидали 1000ms
    
    if (delay > 100) {
        console.warn(`Event Loop задержка: ${delay}ms`);
    }
    
    lastCheck = now;
}, 1000);

// Если видите большие задержки - Event Loop блокируется!
```

#### Метод 2: Использование библиотек

```javascript
const blocked = require('blocked-at');

blocked((time, stack) => {
    console.log(`Блокировка ${time}ms`);
    console.log(stack);
});

// Автоматически обнаруживает блокировки >10ms
```

---

### Решения для блокирующих операций

#### Решение 1: Worker Threads (для CPU-интенсивных задач)

```javascript
const { Worker } = require('worker_threads');

// main.js
function runHeavyTask(data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {
            workerData: data
        });
        
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with code ${code}`));
            }
        });
    });
}

// Использование
runHeavyTask({ n: 40 }).then(result => {
    console.log('Result:', result);
});

// worker.js
const { parentPort, workerData } = require('worker_threads');

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.n);
parentPort.postMessage(result);
```

#### Решение 2: Child Processes

```javascript
const { fork } = require('child_process');

// main.js
const child = fork('child.js');

child.send({ command: 'calculate', data: 40 });

child.on('message', (result) => {
    console.log('Result:', result);
    child.kill();
});

// child.js
process.on('message', (msg) => {
    if (msg.command === 'calculate') {
        const result = heavyCalculation(msg.data);
        process.send(result);
    }
});
```

#### Решение 3: Разбиение на асинхронные чанки

```javascript
async function processLargeDataset(dataset) {
    const CHUNK_SIZE = 1000;
    
    for (let i = 0; i < dataset.length; i += CHUNK_SIZE) {
        const chunk = dataset.slice(i, i + CHUNK_SIZE);
        
        // Обрабатываем чанк
        await processChunk(chunk);
        
        // Отдаем управление Event Loop
        await new Promise(resolve => setImmediate(resolve));
    }
}

function processChunk(chunk) {
    return new Promise((resolve) => {
        // Синхронная обработка чанка
        const results = chunk.map(item => item * 2);
        resolve(results);
    });
}
```

#### Решение 4: Использование стримов

```javascript
const fs = require('fs');
const readline = require('readline');

// ❌ ПЛОХО - загружает весь файл в память
const data = fs.readFileSync('huge.txt', 'utf8');
const lines = data.split('\n');
lines.forEach(line => processLine(line));

// ✅ ХОРОШО - обрабатывает построчно
const stream = fs.createReadStream('huge.txt');
const rl = readline.createInterface({ input: stream });

rl.on('line', (line) => {
    processLine(line); // Обработка не блокирует Event Loop
});
```

---

### LibUV и асинхронные операции

**LibUV автоматически делает асинхронными**:

1. **Файловые операции**:

```javascript
// Эти операции НЕ блокируют Event Loop
fs.readFile('file.txt', callback);  // → Thread Pool
fs.writeFile('file.txt', data, callback); // → Thread Pool
fs.stat('file.txt', callback); // → Thread Pool
```

2. **DNS операции**:

```javascript
dns.lookup('google.com', callback); // → Thread Pool
```

3. **Криптография**:

```javascript
crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', callback); // → Thread Pool
```

4. **Сжатие**:

```javascript
zlib.gzip(buffer, callback); // → Thread Pool
```

5. **Сетевые операции**:

```javascript
http.get('http://api.com', callback); // → OS асинхронность (epoll/kqueue/IOCP)
```

---

### Правила работы с блокирующими операциями

#### ✅ Делайте:

1. **Используйте асинхронные API**

```javascript
// Хорошо
fs.readFile('file.txt', callback);

// Плохо
fs.readFileSync('file.txt');
```

2. **Разбивайте большие задачи**

```javascript
function bigTask() {
    // Сделать часть работы
    doSomeWork();
    
    // Отдать управление Event Loop
    setImmediate(bigTask);
}
```

3. **Используйте Worker Threads для CPU задач**

```javascript
const worker = new Worker('./heavy-computation.js');
```

4. **Мониторьте производительность**

```javascript
const start = Date.now();
heavyOperation();
const duration = Date.now() - start;

if (duration > 100) {
    console.warn('Операция слишком долгая!');
}
```

#### ❌ Избегайте:

1. **Синхронных операций в production**

```javascript
// НЕ используйте в production
fs.readFileSync();
crypto.pbkdf2Sync();
child_process.execSync();
```

2. **Длинных циклов без перерывов**

```javascript
// Плохо
for (let i = 0; i < 1000000; i++) {
    // ...
}
```

3. **Рекурсии без асинхронности**

```javascript
// Плохо
function recursiveSync(n) {
    if (n === 0) return;
    work();
    recursiveSync(n - 1); // Блокирует!
}
```

---

### Практический пример: Веб-сервер с блокировкой

```javascript
const http = require('http');

// ❌ ПЛОХОЙ ПРИМЕР
const server = http.createServer((req, res) => {
    if (req.url === '/heavy') {
        // Блокирует Event Loop на ~5 секунд
        const result = fibonacci(40);
        res.end(`Result: ${result}`);
    } else {
        res.end('Fast response');
    }
});

server.listen(3000);

// Проблема:
// 1. Запрос к /heavy блокирует сервер
// 2. Все остальные запросы ждут 5 секунд!
// 3. Сервер не отвечает на новые под
```
```javascript
// 3. Сервер не отвечает на новые подключения
```

#### ✅ ИСПРАВЛЕННЫЙ ПРИМЕР с Worker Threads:

```javascript
const http = require('http');
const { Worker } = require('worker_threads');

const server = http.createServer((req, res) => {
    if (req.url === '/heavy') {
        // Делегируем в Worker Thread
        const worker = new Worker('./fibonacci-worker.js', {
            workerData: { n: 40 }
        });
        
        worker.on('message', (result) => {
            res.end(`Result: ${result}`);
        });
        
        worker.on('error', (err) => {
            res.statusCode = 500;
            res.end('Error: ' + err.message);
        });
    } else {
        // Быстрый ответ без блокировки
        res.end('Fast response');
    }
});

server.listen(3000);

// fibonacci-worker.js
const { parentPort, workerData } = require('worker_threads');

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.n);
parentPort.postMessage(result);
```

**Результат**:

- Запросы к `/heavy` обрабатываются в отдельном потоке
- Event Loop остается свободным
- Другие запросы обрабатываются мгновенно

---

## 15. Визуализация полного Event Loop

```
┌───────────────────────────────────────────────────────────────┐
│                    НАЧАЛО ИТЕРАЦИИ EVENT LOOP                  │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         ФАЗА 1: TIMERS                   │
        │  ┌────────────────────────────────┐     │
        │  │ setTimeout callbacks           │     │
        │  │ setInterval callbacks          │     │
        │  └────────────────────────────────┘     │
        └──────────────────┬──────────────────────┘
                           │
                ┌──────────▼──────────┐
                │   MICROTASKS        │
                │  • nextTick queue   │
                │  • Promise queue    │
                └──────────┬──────────┘
                           │
        ┌──────────────────▼──────────────────────┐
        │   ФАЗА 2: PENDING CALLBACKS              │
        │  ┌────────────────────────────────┐     │
        │  │ Отложенные I/O callbacks       │     │
        │  │ (системные ошибки и т.д.)      │     │
        │  └────────────────────────────────┘     │
        └──────────────────┬──────────────────────┘
                           │
                ┌──────────▼──────────┐
                │   MICROTASKS        │
                └──────────┬──────────┘
                           │
        ┌──────────────────▼──────────────────────┐
        │   ФАЗА 3: IDLE, PREPARE                  │
        │  ┌────────────────────────────────┐     │
        │  │ Внутренние операции Node.js    │     │
        │  └────────────────────────────────┘     │
        └──────────────────┬──────────────────────┘
                           │
                ┌──────────▼──────────┐
                │   MICROTASKS        │
                └──────────┬──────────┘
                           │
        ┌──────────────────▼──────────────────────┐
        │        ФАЗА 4: POLL  ⭐ ГЛАВНАЯ          │
        │  ┌────────────────────────────────┐     │
        │  │ 1. Вычислить timeout           │     │
        │  │ 2. Ждать I/O события           │     │
        │  │ 3. Выполнить I/O callbacks     │     │
        │  │    • fs.readFile callbacks     │     │
        │  │    • network callbacks         │     │
        │  │    • database callbacks        │     │
        │  └────────────────────────────────┘     │
        │                                          │
        │  Логика:                                 │
        │  • Если очередь НЕ пуста →              │
        │    выполнить все callbacks              │
        │  • Если очередь пуста:                  │
        │    - Есть setImmediate? → к CHECK       │
        │    - Есть таймеры? → ждать их           │
        │    - Иначе → ждать I/O                  │
        └──────────────────┬──────────────────────┘
                           │
                ┌──────────▼──────────┐
                │   MICROTASKS        │
                └──────────┬──────────┘
                           │
        ┌──────────────────▼──────────────────────┐
        │      ФАЗА 5: CHECK                       │
        │  ┌────────────────────────────────┐     │
        │  │ setImmediate callbacks         │     │
        │  └────────────────────────────────┘     │
        └──────────────────┬──────────────────────┘
                           │
                ┌──────────▼──────────┐
                │   MICROTASKS        │
                └──────────┬──────────┘
                           │
        ┌──────────────────▼──────────────────────┐
        │   ФАЗА 6: CLOSE CALLBACKS                │
        │  ┌────────────────────────────────┐     │
        │  │ socket.on('close')             │     │
        │  │ server.on('close')             │     │
        │  └────────────────────────────────┘     │
        └──────────────────┬──────────────────────┘
                           │
                ┌──────────▼──────────┐
                │   MICROTASKS        │
                └──────────┬──────────┘
                           │
                ┌──────────▼──────────┐
                │ Есть ещё работа?    │
                │                     │
                │ • Активные таймеры? │
                │ • Открытые handles? │
                │ • Pending операции? │
                └──────────┬──────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
                ДА│               │НЕТ
                  │                 │
                  ▼                 ▼
        ┌─────────────────┐   ┌─────────────┐
        │ Следующая       │   │ ЗАВЕРШЕНИЕ  │
        │ итерация        │   │ ПРОЦЕССА    │
        └─────────────────┘   └─────────────┘
```

---

### Таблица сравнения асинхронных механизмов

|Механизм|Выполнение|Приоритет|Блокировка Event Loop|Использование|
|---|---|---|---|---|
|**Синхронный код**|Немедленно|Наивысший|❌ Блокирует|Простые операции|
|**process.nextTick()**|После текущей операции|Очень высокий|⚠️ Может блокировать|Критичные callbacks|
|**Promise microtasks**|После nextTick|Высокий|⚠️ Может блокировать|Асинхронный код|
|**setTimeout(0)**|В фазе Timers|Средний|✅ Не блокирует|Отложенное выполнение|
|**setImmediate()**|В фазе Check|Средний|✅ Не блокирует|Разбиение задач|
|**I/O callbacks**|В фазе Poll|Средний|✅ Не блокирует|I/O операции|
|**Worker Threads**|В отдельном потоке|Независимый|✅ Не блокирует|CPU-интенсивные задачи|

---

### Часто встречающиеся паттерны и антипаттерны

#### ❌ Антипаттерн 1: Бесконечный nextTick

```javascript
// НИКОГДА ТАК НЕ ДЕЛАЙТЕ!
function infiniteNextTick() {
    console.log('tick');
    process.nextTick(infiniteNextTick);
}
infiniteNextTick();

// Результат: Event Loop полностью заблокирован
// setTimeout, I/O, ничего не будет работать!
```

#### ✅ Правильно: Используйте setImmediate

```javascript
function recursiveTask() {
    console.log('tick');
    setImmediate(recursiveTask); // Event Loop может обрабатывать другие события
}
recursiveTask();
```

---

#### ❌ Антипаттерн 2: Синхронные операции в production

```javascript
// ПЛОХО для production
app.get('/users', (req, res) => {
    const data = fs.readFileSync('users.json'); // Блокирует!
    res.json(JSON.parse(data));
});
```

#### ✅ Правильно: Асинхронные операции

```javascript
// ХОРОШО
app.get('/users', async (req, res) => {
    try {
        const data = await fs.promises.readFile('users.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

---

#### ❌ Антипаттерн 3: Длинные синхронные циклы

```javascript
// ПЛОХО
app.post('/process', (req, res) => {
    const results = [];
    
    for (let i = 0; i < 1000000; i++) {
        results.push(heavyComputation(i)); // Блокирует на секунды!
    }
    
    res.json(results);
});
```

#### ✅ Правильно: Обработка чанками

```javascript
// ХОРОШО
app.post('/process', async (req, res) => {
    const results = [];
    const CHUNK_SIZE = 1000;
    
    for (let i = 0; i < 1000000; i += CHUNK_SIZE) {
        for (let j = i; j < i + CHUNK_SIZE && j < 1000000; j++) {
            results.push(heavyComputation(j));
        }
        
        // Отдаем управление Event Loop
        await new Promise(resolve => setImmediate(resolve));
    }
    
    res.json(results);
});
```

---

### Инструменты для диагностики Event Loop

#### 1. Встроенный Node.js профайлер

```bash
# Запуск с профилированием
node --prof app.js

# После остановки, обработка профиля
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

#### 2. Clinic.js - диагностика производительности

```bash
npm install -g clinic

# Doctor - общая диагностика
clinic doctor -- node app.js

# Bubbleprof - визуализация асинхронных операций
clinic bubbleprof -- node app.js

# Flame - CPU профилирование
clinic flame -- node app.js
```

#### 3. Мониторинг задержек Event Loop

```javascript
const { monitorEventLoopDelay } = require('perf_hooks');

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

setInterval(() => {
    console.log('Event Loop delay:');
    console.log('  min:', h.min);
    console.log('  max:', h.max);
    console.log('  mean:', h.mean);
    console.log('  stddev:', h.stddev);
    
    h.reset();
}, 5000);
```

#### 4. Библиотека blocked-at

```javascript
const blocked = require('blocked-at');

blocked((time, stack) => {
    console.log(`Blocked for ${time}ms, operation started here:`);
    console.log(stack.join('\n'));
}, { threshold: 50 }); // Порог 50ms
```

---

### Метрики для мониторинга

#### 1. Event Loop Lag (Задержка Event Loop)

```javascript
class EventLoopMonitor {
    constructor() {
        this.lastCheck = Date.now();
        this.expectedDelay = 100;
    }
    
    start() {
        setInterval(() => {
            const now = Date.now();
            const delay = now - this.lastCheck - this.expectedDelay;
            
            if (delay > 50) {
                console.warn(`⚠️ Event Loop Lag: ${delay}ms`);
                
                // Отправить метрику в систему мониторинга
                metrics.recordEventLoopLag(delay);
            }
            
            this.lastCheck = now;
        }, this.expectedDelay);
    }
}

const monitor = new EventLoopMonitor();
monitor.start();
```

#### 2. Счетчик активных handles и requests

```javascript
function getActiveHandles() {
    return {
        handles: process._getActiveHandles().length,
        requests: process._getActiveRequests().length
    };
}

setInterval(() => {
    const active = getActiveHandles();
    console.log('Active handles:', active.handles);
    console.log('Active requests:', active.requests);
}, 5000);
```

#### 3. Использование памяти

```javascript
function getMemoryUsage() {
    const usage = process.memoryUsage();
    
    return {
        rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(usage.external / 1024 / 1024) + 'MB'
    };
}

setInterval(() => {
    console.log('Memory:', getMemoryUsage());
}, 5000);
```

---

### Практические рекомендации для production

#### 1. Настройка Thread Pool

```javascript
// В начале приложения, до любых require
if (process.env.NODE_ENV === 'production') {
    // Увеличить для I/O-интенсивных приложений
    process.env.UV_THREADPOOL_SIZE = 128;
}

// Количество зависит от:
// - Количество CPU ядер
// - Тип операций (больше I/O = больше потоков)
// - Доступная память
```

#### 2. Graceful Shutdown

```javascript
const server = http.createServer(app);

function gracefulShutdown(signal) {
    console.log(`${signal} received, shutting down gracefully`);
    
    server.close(() => {
        console.log('HTTP server closed');
        
        // Закрыть соединения с БД
        database.close();
        
        // Дождаться завершения активных задач
        Promise.all(activeTasks).then(() => {
            console.log('All tasks completed');
            process.exit(0);
        });
    });
    
    // Принудительное завершение через 30 секунд
    setTimeout(() => {
        console.error('Forced shutdown');
        process.exit(1);
    }, 30000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

#### 3. Обработка необработанных ошибок

```javascript
// Необработанные Promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    
    // Логирование в систему мониторинга
    logger.error('Unhandled rejection', { reason, promise });
    
    // В production: graceful shutdown
    if (process.env.NODE_ENV === 'production') {
        gracefulShutdown('unhandledRejection');
    }
});

// Необработанные исключения
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    
    logger.error('Uncaught exception', { error });
    
    // Всегда завершать процесс при uncaughtException
    gracefulShutdown('uncaughtException');
});
```

#### 4. Кластеризация для масштабирования

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    
    console.log(`Master ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...`);
    
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log('Starting a new worker...');
        cluster.fork();
    });
    
} else {
    // Worker процессы запускают сервер
    const server = require('./app');
    
    server.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
```

---

### Сложный реальный пример: API с обработкой изображений

```javascript
const express = require('express');
const { Worker } = require('worker_threads');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Очередь задач для обработки
class TaskQueue {
    constructor(concurrency = 4) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    
    async add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.process();
        });
    }
    
    async process() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }
        
        this.running++;
        const { task, resolve, reject } = this.queue.shift();
        
        try {
            const result = await task();
            resolve(result);
        } catch (err) {
            reject(err);
        } finally {
            this.running--;
            this.process();
        }
    }
}

const imageQueue = new TaskQueue(4);

// Endpoint для загрузки и обработки изображений
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;
        
        // Добавляем в очередь для предотвращения перегрузки
        const result = await imageQueue.add(async () => {
            // Обработка в Worker Thread
            return new Promise((resolve, reject) => {
                const worker = new Worker('./image-worker.js', {
                    workerData: { imageBuffer }
                });
                
                worker.on('message', resolve);
                worker.on('error', reject);
            });
        });
        
        res.json({ success: true, processed: result });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Мониторинг Event Loop
const { monitorEventLoopDelay } = require('perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

app.get('/metrics', (req, res) => {
    res.json({
        eventLoop: {
            min: h.min,
            max: h.max,
            mean: h.mean,
            stddev: h.stddev
        },
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        queueSize: imageQueue.queue.length,
        activeWorkers: imageQueue.running
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

// image-worker.js
const { parentPort, workerData } = require('worker_threads');
const sharp = require('sharp');

(async () => {
    try {
        const { imageBuffer } = workerData;
        
        // Обработка изображения (CPU-интенсивная операция)
        const processed = await sharp(imageBuffer)
            .resize(800, 600)
            .jpeg({ quality: 80 })
            .toBuffer();
        
        parentPort.postMessage({
            size: processed.length,
            format: 'jpeg'
        });
        
    } catch (err) {
        throw err;
    }
})();
```

---

### Финальные рекомендации

#### 🎯 Золотые правила Event Loop:

1. **Никогда не блокируйте Event Loop**
    
    - Избегайте синхронных операций
    - Разбивайте длинные задачи на чанки
    - Используйте Worker Threads для CPU задач
2. **Понимайте приоритеты**
    
    - `process.nextTick()` > `Promise` > `setTimeout` ≈ `setImmediate`
    - Используйте правильный инструмент для каждой задачи
3. **Мониторьте производительность**
    
    - Отслеживайте задержки Event Loop
    - Используйте профилирование
    - Логируйте медленные операции
4. **Правильно обрабатывайте ошибки**
    
    - Всегда обрабатывайте Promise rejections
    - Graceful shutdown при критических ошибках
    - Логируйте всё для отладки
5. **Масштабируйте правильно**
    
    - Используйте кластеризацию для множества запросов
    - Worker Threads для CPU задач
    - Child Processes для изоляции

---

## Заключение

Event Loop - это сердце Node.js, которое позволяет однопоточному JavaScript выполнять неблокирующие операции. Понимание его работы критически важно для написания производительных приложений.

**Ключевые моменты**:

- ✅ Node.js однопоточный, но использует LibUV для асинхронности
- ✅ Event Loop проходит по 6 фазам в каждой итерации
- ✅ Microtasks (nextTick, Promise) выполняются между фазами
- ✅ Thread Pool (4-1024 потоков) для блокирующих операций
- ✅ Worker Threads для CPU-интенсивных задач
- ✅ Мониторинг и оптимизация - основа production приложений

