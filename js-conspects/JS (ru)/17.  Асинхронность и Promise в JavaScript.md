# 1. Основы асинхронности в JavaScript

### 1.1 Что такое асинхронность?

**Асинхронность** — это способность выполнения кода без блокировки основного потока выполнения. В JavaScript асинхронные операции позволяют программе продолжать работу, не дожидаясь завершения долгих операций (запросы к серверу, чтение файлов, таймеры).

### 1.2 Однопоточность JavaScript

JavaScript — однопоточный язык, но благодаря Event Loop может обрабатывать асинхронные операции:

```javascript
console.log("1 - Начало");

setTimeout(() => {
    console.log("2 - Асинхронная операция");
}, 0);

console.log("3 - Конец");

// Вывод:
// 1 - Начало
// 3 - Конец
// 2 - Асинхронная операция
```

### 1.3 Event Loop (Цикл событий)

Event Loop — механизм, который управляет выполнением асинхронного кода:

```javascript
// Call Stack (Стек вызовов)
function first() {
    console.log("Первая функция");
    second();
}

function second() {
    console.log("Вторая функция");
}

// Web APIs (setTimeout, fetch, DOM events)
setTimeout(() => {
    console.log("Из Web API");
}, 0);

// Callback Queue (Очередь колбэков)
first(); // Синхронно
// Затем выполнится setTimeout

// Вывод:
// Первая функция
// Вторая функция
// Из Web API
```

### 1.4 Microtasks vs Macrotasks

```javascript
console.log("1 - Синхронный код");

// Macrotask (setTimeout)
setTimeout(() => console.log("2 - Macrotask"), 0);

// Microtask (Promise)
Promise.resolve().then(() => console.log("3 - Microtask"));

console.log("4 - Синхронный код");

// Вывод:
// 1 - Синхронный код
// 4 - Синхронный код
// 3 - Microtask (выполняется первым!)
// 2 - Macrotask
```

### 1.5 Эволюция асинхронности

#### Callbacks (колбэки)

```javascript
// Старый способ
function getData(callback) {
    setTimeout(() => {
        callback(null, "Данные получены");
    }, 1000);
}

getData((error, data) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
});
```

#### Callback Hell (Ад колбэков)

```javascript
// Проблема вложенности
getData((error, data) => {
    if (error) throw error;
    
    processData(data, (error, processedData) => {
        if (error) throw error;
        
        saveData(processedData, (error, result) => {
            if (error) throw error;
            
            console.log("Готово:", result);
        });
    });
});
```

# 2. Что такое Promise?

**Promise** (промис) — это объект в JavaScript, который представляет результат асинхронной операции. Промис может находиться в одном из трех состояний:

- **Pending** (ожидание) — начальное состояние, операция еще не завершена
- **Fulfilled** (выполнен) — операция завершена успешно
- **Rejected** (отклонен) — операция завершена с ошибкой

## 2. Создание Promise

### Базовый синтаксис

```javascript
const myPromise = new Promise((resolve, reject) => {
    // Асинхронная операция
    if (/* операция успешна */) {
        resolve(результат); // Промис выполнен
    } else {
        reject(ошибка); // Промис отклонен
    }
});
```

### Пример создания простого промиса

```javascript
const fetchData = new Promise((resolve, reject) => {
    setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) {
            resolve("Данные получены успешно!");
        } else {
            reject("Ошибка при получении данных");
        }
    }, 2000);
});
```

## 3. Методы Promise

### 3.1 then()

Обрабатывает успешное выполнение промиса:

```javascript
promise.then(
    result => {
        // Обработка успешного результата
        console.log(result);
    },
    error => {
        // Обработка ошибки (необязательно)
        console.error(error);
    }
);
```

### 3.2 catch()

Обрабатывает отклонение промиса:

```javascript
promise.catch(error => {
    console.error("Произошла ошибка:", error);
});
```

### 3.3 finally()

Выполняется независимо от результата промиса:

```javascript
promise.finally(() => {
    console.log("Операция завершена");
});
```

## 4. Цепочки промисов (Promise Chaining)

Промисы можно связывать в цепочки для последовательного выполнения:

```javascript
fetchUserData()
    .then(user => {
        console.log("Пользователь:", user);
        return fetchUserPosts(user.id);
    })
    .then(posts => {
        console.log("Посты:", posts);
        return processePosts(posts);
    })
    .then(processedPosts => {
        console.log("Обработанные посты:", processedPosts);
    })
    .catch(error => {
        console.error("Ошибка в цепочке:", error);
    })
    .finally(() => {
        console.log("Цепочка завершена");
    });
```

## 5. Статические методы Promise

### 5.1 Promise.resolve()

Создает уже выполненный промис:

```javascript
const resolvedPromise = Promise.resolve("Успех!");
resolvedPromise.then(result => console.log(result)); // "Успех!"
```

### 5.2 Promise.reject()

Создает уже отклоненный промис:

```javascript
const rejectedPromise = Promise.reject("Ошибка!");
rejectedPromise.catch(error => console.log(error)); // "Ошибка!"
```

### 5.3 Promise.all()

Ждет выполнения всех промисов:

```javascript
const promise1 = fetch('/api/data1');
const promise2 = fetch('/api/data2');
const promise3 = fetch('/api/data3');

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log("Все запросы выполнены:", results);
    })
    .catch(error => {
        console.error("Один из запросов не удался:", error);
    });
```

### 5.4 Promise.allSettled()

Ждет завершения всех промисов (независимо от результата):

```javascript
const promises = [
    Promise.resolve("Успех 1"),
    Promise.reject("Ошибка 1"),
    Promise.resolve("Успех 2")
];

Promise.allSettled(promises)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Промис ${index}: ${result.value}`);
            } else {
                console.log(`Промис ${index} отклонен: ${result.reason}`);
            }
        });
    });
```

### 5.5 Promise.race()

Возвращает первый завершившийся промис:

```javascript
const promise1 = new Promise(resolve => setTimeout(resolve, 500, 'Первый'));
const promise2 = new Promise(resolve => setTimeout(resolve, 100, 'Второй'));

Promise.race([promise1, promise2])
    .then(result => {
        console.log(result); // "Второй" (завершился первым)
    });
```

### 5.6 Promise.any()

Возвращает первый успешно выполненный промис:

```javascript
const promises = [
    Promise.reject("Ошибка 1"),
    Promise.resolve("Успех!"),
    Promise.reject("Ошибка 2")
];

Promise.any(promises)
    .then(result => {
        console.log(result); // "Успех!"
    })
    .catch(error => {
        console.log("Все промисы отклонены");
    });
```

## 6. Async/Await

Современный синтаксис для работы с промисами:

### 6.1 Async функции

```javascript
	async function fetchUserData() {
	    try {
	        const response = await fetch('/api/user');
	        const user = await response.json();
	        return user;
	    } catch (error) {
	        console.error("Ошибка получения данных:", error);
	        throw error;
	    }
	}
```

### 6.2 Использование async/await

```javascript
async function processUser() {
    try {
        const user = await fetchUserData();
        const posts = await fetchUserPosts(user.id);
        const comments = await fetchPostComments(posts[0].id);
        
        console.log("Пользователь:", user);
        console.log("Посты:", posts);
        console.log("Комментарии:", comments);
    } catch (error) {
        console.error("Произошла ошибка:", error);
    }
}
```

## 7. Обработка ошибок

### 7.1 Try-catch с async/await

```javascript
async function safeAsyncOperation() {
    try {
        const result = await riskyOperation();
        return result;
    } catch (error) {
        console.error("Обработка ошибки:", error);
        return null; // Возвращаем значение по умолчанию
    }
}
```

### 7.2 Множественная обработка ошибок

```javascript
fetchData()
    .then(data => processData(data))
    .catch(error => {
        if (error.name === 'NetworkError') {
            console.log("Проблемы с сетью");
        } else if (error.name === 'ValidationError') {
            console.log("Ошибка валидации данных");
        } else {
            console.log("Неизвестная ошибка:", error);
        }
    });
```

## 8. Практические примеры

### 8.1 Последовательные запросы

```javascript
async function loadUserProfile(userId) {
    try {
        // Загрузка данных пользователя
        const user = await fetch(`/api/users/${userId}`).then(r => r.json());
        
        // Загрузка постов пользователя
        const posts = await fetch(`/api/users/${userId}/posts`).then(r => r.json());
        
        // Загрузка подписчиков
        const followers = await fetch(`/api/users/${userId}/followers`).then(r => r.json());
        
        return {
            user,
            posts,
            followers
        };
    } catch (error) {
        throw new Error(`Не удалось загрузить профиль: ${error.message}`);
    }
}
```

### 8.2 Параллельные запросы

```javascript
async function loadDashboardData(userId) {
    try {
        const [user, posts, notifications] = await Promise.all([
            fetch(`/api/users/${userId}`).then(r => r.json()),
            fetch(`/api/users/${userId}/posts`).then(r => r.json()),
            fetch(`/api/users/${userId}/notifications`).then(r => r.json())
        ]);
        
        return {
            user,
            posts,
            notifications
        };
    } catch (error) {
        throw new Error(`Ошибка загрузки данных: ${error.message}`);
    }
}
```

### 8.3 Создание промиса для таймера

```javascript
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Использование
async function example() {
    console.log("Начало");
    await delay(2000);
    console.log("Через 2 секунды");
}
```

### 8.4 Промисификация callback-функций

```javascript
function promisify(callbackFunction) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            callbackFunction(...args, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

// Пример использования
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

readFileAsync('file.txt', 'utf8')
    .then(content => console.log(content))
    .catch(error => console.error(error));
```

## 9. Лучшие практики

### 9.1 Всегда обрабатывайте ошибки

```javascript
// Плохо
fetchData().then(result => console.log(result));

// Хорошо
fetchData()
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

### 9.2 Избегайте вложенных промисов

```javascript
// Плохо (Callback Hell с промисами)
fetchUser()
    .then(user => {
        return fetchPosts(user.id)
            .then(posts => {
                return fetchComments(posts[0].id)
                    .then(comments => {
                        return { user, posts, comments };
                    });
            });
    });

// Хорошо
fetchUser()
    .then(user => {
        return Promise.all([
            user,
            fetchPosts(user.id)
        ]);
    })
    .then([user, posts] => {
        return Promise.all([
            user,
            posts,
            fetchComments(posts[0].id)
        ]);
    })
    .then([user, posts, comments] => {
        return { user, posts, comments };
    });
```

### 9.3 Используйте async/await для читаемости

```javascript
// С промисами
function processData() {
    return fetchUser()
        .then(user => fetchPosts(user.id))
        .then(posts => processPosts(posts))
        .catch(error => handleError(error));
}

// С async/await (более читаемо)
async function processData() {
    try {
        const user = await fetchUser();
        const posts = await fetchPosts(user.id);
        return await processPosts(posts);
    } catch (error) {
        handleError(error);
    }
}
```

## 10. Частые ошибки и их решения

### 10.1 Забывание return в цепочке

```javascript
// Неправильно
promise
    .then(result => {
        processResult(result); // Забыли return!
    })
    .then(processed => {
        console.log(processed); // undefined
    });

// Правильно
promise
    .then(result => {
        return processResult(result);
    })
    .then(processed => {
        console.log(processed); // Правильное значение
    });
```

### 10.2 Неправильная обработка ошибок в async/await

```javascript
// Неправильно
async function badExample() {
    const result = await riskyOperation(); // Ошибка не обрабатывается
    return result;
}

// Правильно
async function goodExample() {
    try {
        const result = await riskyOperation();
        return result;
    } catch (error) {
        console.error("Ошибка:", error);
        throw error; // Пробрасываем ошибку дальше
    }
}
```

## 12. Продвинутые темы асинхронности

### 12.1 Генераторы и асинхронность

```javascript
function* asyncGenerator() {
    console.log("Начало генератора");
    
    const data1 = yield fetch('/api/data1');
    console.log("Получены данные 1:", data1);
    
    const data2 = yield fetch('/api/data2');
    console.log("Получены данные 2:", data2);
    
    return "Генератор завершен";
}

// Функция для выполнения асинхронного генератора
async function runAsyncGenerator(generator) {
    const gen = generator();
    let result = gen.next();
    
    while (!result.done) {
        try {
            const value = await result.value;
            result = gen.next(value);
        } catch (error) {
            result = gen.throw(error);
        }
    }
    
    return result.value;
}

// Использование
runAsyncGenerator(asyncGenerator);
```

### 12.2 Async Iterators (Асинхронные итераторы)

```javascript
// Создание асинхронного итератора
async function* asyncNumberGenerator() {
    for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield i;
    }
}

// Использование for await...of
async function processNumbers() {
    for await (const number of asyncNumberGenerator()) {
        console.log("Получено число:", number);
    }
}

processNumbers();
```

### 12.3 Streams и асинхронность

```javascript
// Чтение потока данных
async function processStream(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    try {
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            console.log("Получен фрагмент:", chunk);
            
            // Обработка фрагмента данных
            processChunk(chunk);
        }
    } finally {
        reader.releaseLock();
    }
}

// Использование
fetch('/api/large-data')
    .then(response => processStream(response))
    .catch(error => console.error(error));
```

### 12.4 Web Workers и асинхронность

```javascript
// main.js - основной поток
function heavyCalculationWithWorker(data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('worker.js');
        
        worker.postMessage(data);
        
        worker.onmessage = (event) => {
            resolve(event.data);
            worker.terminate();
        };
        
        worker.onerror = (error) => {
            reject(error);
            worker.terminate();
        };
    });
}

// Использование
async function processData() {
    try {
        const result = await heavyCalculationWithWorker(largeDataSet);
        console.log("Результат вычислений:", result);
    } catch (error) {
        console.error("Ошибка в worker:", error);
    }
}

// worker.js - рабочий поток
self.onmessage = function(event) {
    const data = event.data;
    
    // Тяжелые вычисления
    const result = performHeavyCalculation(data);
    
    // Отправка результата обратно
    self.postMessage(result);
};
```

### 12.5 AbortController для отмены запросов

```javascript
class AsyncRequestManager {
    constructor() {
        this.controllers = new Map();
    }
    
    async makeRequest(url, requestId) {
        // Отменяем предыдущий запрос с тем же ID
        this.cancelRequest(requestId);
        
        const controller = new AbortController();
        this.controllers.set(requestId, controller);
        
        try {
            const response = await fetch(url, {
                signal: controller.signal
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.controllers.delete(requestId);
            
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Запрос ${requestId} был отменен`);
            } else {
                console.error(`Ошибка запроса ${requestId}:`, error);
                throw error;
            }
        }
    }
    
    cancelRequest(requestId) {
        const controller = this.controllers.get(requestId);
        if (controller) {
            controller.abort();
            this.controllers.delete(requestId);
        }
    }
    
    cancelAllRequests() {
        for (const [requestId, controller] of this.controllers) {
            controller.abort();
        }
        this.controllers.clear();
    }
}

// Использование
const requestManager = new AsyncRequestManager();

// Запрос данных пользователя
requestManager.makeRequest('/api/user/123', 'user-data')
    .then(data => console.log('Данные пользователя:', data))
    .catch(error => console.error(error));

// Отмена запроса через 2 секунды
setTimeout(() => {
    requestManager.cancelRequest('user-data');
}, 2000);
```

### 12.6 Батчинг асинхронных операций

```javascript
class AsyncBatcher {
    constructor(batchSize = 5, delay = 100) {
        this.batchSize = batchSize;
        this.delay = delay;
        this.queue = [];
        this.timeoutId = null;
    }
    
    add(asyncOperation) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                operation: asyncOperation,
                resolve,
                reject
            });
            
            if (this.queue.length >= this.batchSize) {
                this.processBatch();
            } else {
                this.scheduleBatch();
            }
        });
    }
    
    scheduleBatch() {
        if (this.timeoutId) return;
        
        this.timeoutId = setTimeout(() => {
            this.processBatch();
        }, this.delay);
    }
    
    async processBatch() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        
        const batch = this.queue.splice(0, this.batchSize);
        if (batch.length === 0) return;
        
        console.log(`Обработка батча из ${batch.length} операций`);
        
        const promises = batch.map(async ({ operation, resolve, reject }) => {
            try {
                const result = await operation();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
        
        await Promise.allSettled(promises);
    }
}

// Использование батчера
const batcher = new AsyncBatcher(3, 500);

// Добавление операций в батч
for (let i = 0; i < 10; i++) {
    batcher.add(async () => {
        const response = await fetch(`/api/item/${i}`);
        return response.json();
    }).then(data => {
        console.log(`Получены данные для элемента ${i}:`, data);
    });
}
```

### 12.7 Retry механизм для асинхронных операций

```javascript
class AsyncRetry {
    static async execute(
        asyncFunction,
        options = {}
    ) {
        const {
            maxAttempts = 3,
            delay = 1000,
            backoffMultiplier = 2,
            retryCondition = () => true
        } = options;
        
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await asyncFunction();
            } catch (error) {
                lastError = error;
                
                console.log(`Попытка ${attempt} не удалась:`, error.message);
                
                if (attempt === maxAttempts || !retryCondition(error)) {
                    throw error;
                }
                
                const waitTime = delay * Math.pow(backoffMultiplier, attempt - 1);
                console.log(`Ожидание ${waitTime}ms перед следующей попыткой...`);
                
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        
        throw lastError;
    }
}

// Использование retry механизма
async function fetchWithRetry() {
    try {
        const data = await AsyncRetry.execute(
            () => fetch('/api/unreliable-endpoint').then(r => r.json()),
            {
                maxAttempts: 5,
                delay: 1000,
                backoffMultiplier: 1.5,
                retryCondition: (error) => {
                    // Повторяем только для сетевых ошибок
                    return error.name === 'NetworkError' || 
                           error.message.includes('fetch');
                }
            }
        );
        
        console.log('Данные получены:', data);
    } catch (error) {
        console.error('Не удалось получить данные после всех попыток:', error);
    }
}
```

### 12.8 Кэширование асинхронных результатов

```javascript
class AsyncCache {
    constructor(ttl = 60000) { // TTL в миллисекундах
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    async get(key, asyncFunction) {
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            console.log(`Возвращаем из кэша: ${key}`);
            return cached.data;
        }
        
        console.log(`Выполняем запрос: ${key}`);
        
        try {
            const data = await asyncFunction();
            
            this.cache.set(key, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            // Удаляем неудачный результат из кэша
            this.cache.delete(key);
            throw error;
        }
    }
    
    invalidate(key) {
        this.cache.delete(key);
    }
    
    clear() {
        this.cache.clear();
    }
    
    // Автоматическая очистка устаревших записей
    startCleanup(interval = 60000) {
        setInterval(() => {
            const now = Date.now();
            for (const [key, value] of this.cache.entries()) {
                if (now - value.timestamp >= this.ttl) {
                    this.cache.delete(key);
                }
            }
        }, interval);
    }
}

// Использование кэша
const cache = new AsyncCache(30000); // Кэш на 30 секунд
cache.startCleanup();

async function getUserData(userId) {
    return await cache.get(`user_${userId}`, async () => {
        const response = await fetch(`/api/users/${userId}`);
        return response.json();
    });
}

// Первый вызов - запрос к серверу
getUserData(123).then(data => console.log(data));

// Второй вызов - данные из кэша
setTimeout(() => {
    getUserData(123).then(data => console.log(data));
}, 5000);
```

## 13. Заключение

Promise в JavaScript — это мощный инструмент для работы с асинхронным кодом, который позволяет:

- Избежать "callback hell"
- Создавать читаемые цепочки асинхронных операций
- Эффективно обрабатывать ошибки
- Выполнять операции параллельно или последовательно

Современный подход с использованием async/await делает асинхронный код еще более читаемым и похожим на синхронный, сохраняя при этом все преимущества промисов.