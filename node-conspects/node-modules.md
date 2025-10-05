## 1. Введение в модульную систему Node.js

### Что такое модуль?

Модуль в Node.js — это автономный блок кода, который инкапсулирует связанную функциональность. Каждый файл в Node.js рассматривается как отдельный модуль.

### Зачем нужны модули?

- **Организация кода** — разделение на логические части
- **Повторное использование** — один раз написать, использовать везде
- **Инкапсуляция** — скрытие внутренней реализации
- **Управление зависимостями** — явное указание зависимостей
- **Избежание конфликтов** — изоляция области видимости

---

## 2. Характеристики модулей в Node.js

### Основные свойства:

1. **Изоляция области видимости**
    
    - Каждый модуль имеет собственную область видимости
    - Переменные и функции модуля не загрязняют глобальное пространство имён
    - Доступ к содержимому модуля только через экспорт
2. **Кэширование модулей**
    
    - При первом импорте модуль выполняется и кэшируется
    - Повторные импорты возвращают закэшированный результат
    - Кэш хранится в `require.cache` (для CommonJS)
    
3. **Синхронная загрузка (CommonJS)**
    
    - Модули загружаются синхронно и блокирующе
    - Подходит для серверной среды
4. **Асинхронная загрузка (ESM)**
    
    - ES модули загружаются асинхронно
    - Поддержка динамического импорта
5. **Циклические зависимости**
    
    - Node.js может обрабатывать циклические зависимости
    - Возвращает частично заполненный экспорт

---

## 3. Типы модулей в Node.js

### 3.1 Встроенные модули (Core Modules)

Модули, встроенные в Node.js:

```javascript
const fs = require('fs');
const http = require('http');
const path = require('path');
```

### 3.2 Локальные модули (Local Modules)

Созданные разработчиком модули:

```javascript
const myModule = require('./myModule');
const utils = require('../utils/helpers');
```

### 3.3 Модули из node_modules (Third-party Modules)

Установленные через npm/yarn:

```javascript
const express = require('express');
const lodash = require('lodash');
```

---

## 4. CommonJS модули (require)

### 4.1 Основы CommonJS

CommonJS — это стандарт модульной системы, используемый в Node.js по умолчанию.

**Основные характеристики:**

- Синхронная загрузка
- Используется `require()` для импорта
- Используется `module.exports` или `exports` для экспорта
- Расширение файлов: `.js`, `.json`, `.node`

### 4.2 Экспорт в CommonJS

#### Способ 1: module.exports (рекомендуемый)

```javascript
// calculator.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// Экспорт объекта с функциями
module.exports = {
  add,
  subtract
};

// Или экспорт одной функции
module.exports = add;
```

#### Способ 2: exports (shortcut)

```javascript
// utils.js
exports.formatDate = function(date) {
  return date.toISOString();
};

exports.capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
```

⚠️ **Важно:** Нельзя переназначать `exports` напрямую:

```javascript
// ❌ Неправильно - не сработает
exports = { hello: 'world' };

// ✅ Правильно
module.exports = { hello: 'world' };
```

#### Экспорт классов

```javascript
// User.js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  greet() {
    return `Hello, ${this.name}!`;
  }
}

module.exports = User;
```

### 4.3 Импорт с помощью require()

#### Базовый импорт

```javascript
// Импорт всего модуля
const calculator = require('./calculator');
console.log(calculator.add(2, 3)); // 5

// Деструктуризация при импорте
const { add, subtract } = require('./calculator');
console.log(add(5, 3)); // 8

// Импорт класса
const User = require('./User');
const user = new User('John', 'john@example.com');
```

#### Импорт встроенных модулей

```javascript
const fs = require('fs');
const path = require('path');
const http = require('http');
```

#### Импорт JSON файлов

```javascript
// config.json
{
  "port": 3000,
  "database": "mongodb://localhost"
}

// app.js
const config = require('./config.json');
console.log(config.port); // 3000
```

### 4.4 Алгоритм разрешения модулей require()

Когда вызывается `require('module')`, Node.js ищет модуль в следующем порядке:

1. **Встроенные модули** — проверяется, является ли модуль встроенным
2. **Относительные пути** (`./`, `../`) — поиск относительно текущего файла
3. **Абсолютные пути** (`/`) — поиск по абсолютному пути
4. **node_modules** — поиск в директориях node_modules

**Порядок поиска файлов:**

```javascript
require('./module');
// Поиск в следующем порядке:
// 1. ./module.js
// 2. ./module.json
// 3. ./module.node
// 4. ./module/package.json (поле "main")
// 5. ./module/index.js
// 6. ./module/index.json
// 7. ./module/index.node
```

### 4.5 Кэширование модулей

```javascript
// counter.js
let count = 0;

module.exports = {
  increment() {
    return ++count;
  },
  getCount() {
    return count;
  }
};

// app.js
const counter1 = require('./counter');
const counter2 = require('./counter');

console.log(counter1.increment()); // 1
console.log(counter2.increment()); // 2 (тот же экземпляр!)
console.log(counter1.getCount()); // 2

// Проверка кэша
console.log(require.cache); // объект со всеми закэшированными модулями

// Очистка кэша (редко используется)
delete require.cache[require.resolve('./counter')];
```

---

## 5. Как устроен CommonJS внутри

### 5.1 Module Wrapper Function

Каждый модуль в Node.js оборачивается в специальную функцию перед выполнением:

```javascript
(function(exports, require, module, __filename, __dirname) {
  // Код вашего модуля здесь
  
  const myVar = 'Hello';
  module.exports = myVar;
});
```

**Параметры wrapper-функции:**

- `exports` — ссылка на `module.exports`
- `require` — функция для импорта модулей
- `module` — ссылка на текущий модуль
- `__filename` — абсолютный путь к текущему файлу
- `__dirname` — абсолютный путь к директории файла

### 5.2 Объект module

```javascript
// Внутри любого модуля доступен объект module
console.log(module);

/* Вывод:
Module {
  id: '/path/to/file.js',
  path: '/path/to',
  exports: {},
  parent: Module { ... },
  filename: '/path/to/file.js',
  loaded: false,
  children: [],
  paths: [
    '/path/to/node_modules',
    '/path/node_modules',
    '/node_modules'
  ]
}
*/
```

**Свойства объекта module:**

- `id` — идентификатор модуля (обычно путь к файлу)
- `exports` — объект экспорта модуля
- `parent` — модуль, который импортировал текущий модуль
- `filename` — полный путь к файлу модуля
- `loaded` — загружен ли модуль полностью
- `children` — массив модулей, импортированных данным модулем
- `paths` — массив путей поиска модулей

### 5.3 Связь exports и module.exports

```javascript
// В начале каждого модуля Node.js делает:
exports = module.exports = {};

// Поэтому это работает:
exports.foo = 'bar';
console.log(module.exports.foo); // 'bar'

// Но если переназначить exports:
exports = { foo: 'bar' }; // теряется связь с module.exports

// module.exports остается пустым: {}
// Поэтому нужно использовать:
module.exports = { foo: 'bar' };
```

### 5.4 Псевдокод работы require()

```javascript
function require(modulePath) {
  // 1. Разрешение пути к модулю
  const absolutePath = resolveModule(modulePath);
  
  // 2. Проверка кэша
  if (require.cache[absolutePath]) {
    return require.cache[absolutePath].exports;
  }
  
  // 3. Создание объекта модуля
  const module = {
    exports: {},
    id: absolutePath,
    loaded: false
  };
  
  // 4. Добавление в кэш
  require.cache[absolutePath] = module;
  
  // 5. Чтение содержимого файла
  const code = fs.readFileSync(absolutePath, 'utf8');
  
  // 6. Оборачивание в wrapper функцию
  const wrappedCode = `
    (function(exports, require, module, __filename, __dirname) {
      ${code}
    })
  `;
  
  // 7. Компиляция и выполнение
  const compiledWrapper = eval(wrappedCode);
  compiledWrapper(
    module.exports,
    require,
    module,
    absolutePath,
    path.dirname(absolutePath)
  );
  
  // 8. Пометка как загруженный
  module.loaded = true;
  
  // 9. Возврат экспорта
  return module.exports;
}

require.cache = {};
```

---

## 6. ECMAScript Modules (ESM) - import/export

### 6.1 Введение в ESM

ES модули — это официальный стандарт модульной системы JavaScript (ES6+).

**Характеристики ESM:**

- Асинхронная загрузка
- Статический анализ импортов/экспортов
- Использует `import` и `export`
- Строгий режим по умолчанию (`'use strict'`)
- Поддержка Tree Shaking
- Top-level await

**Включение ESM в Node.js:**

Способ 1: Расширение `.mjs`

```javascript
// module.mjs
export const hello = 'world';
```

Способ 2: `"type": "module"` в package.json

```json
{
  "type": "module"
}
```

### 6.2 Экспорт в ESM

#### Named Export (именованный экспорт)

```javascript
// utils.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export class Calculator {
  multiply(a, b) {
    return a * b;
  }
}

// Или экспорт списком
const x = 10;
const y = 20;
export { x, y };
```

#### Default Export (экспорт по умолчанию)

```javascript
// config.js
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

export default config;

// Или inline
export default function greet(name) {
  return `Hello, ${name}!`;
}

// Для классов
export default class User {
  constructor(name) {
    this.name = name;
  }
}
```

#### Смешанный экспорт

```javascript
// math.js
export const PI = 3.14159;
export const E = 2.71828;

export default function calculate(x) {
  return x * PI;
}
```

#### Re-export (реэкспорт)

```javascript
// index.js - бочкообразный файл (barrel)
export { add, subtract } from './calculator.js';
export { formatDate } from './utils.js';
export * from './constants.js';

// Переименование при реэкспорте
export { default as Calculator } from './Calculator.js';
```

### 6.3 Импорт в ESM

#### Named Import (именованный импорт)

```javascript
// Импорт конкретных экспортов
import { add, subtract } from './calculator.js';

// Импорт с переименованием
import { add as sum, subtract as diff } from './calculator.js';

// Импорт всего в namespace
import * as calc from './calculator.js';
console.log(calc.add(2, 3));
```

#### Default Import

```javascript
// Импорт дефолтного экспорта
import config from './config.js';
import greet from './greet.js';
import User from './User.js';
```

#### Смешанный импорт

```javascript
import calculate, { PI, E } from './math.js';
```

#### Импорт для побочных эффектов

```javascript
// Выполняет код модуля без импорта значений
import './polyfills.js';
import './styles.css';
```

#### Динамический импорт

```javascript
// Возвращает Promise
const module = await import('./module.js');

// Или с then
import('./module.js')
  .then(module => {
    module.doSomething();
  })
  .catch(err => {
    console.error('Ошибка загрузки модуля:', err);
  });

// Условный импорт
if (condition) {
  const { feature } = await import('./feature.js');
  feature();
}
```

### 6.4 Top-level await

```javascript
// database.js
const connection = await connectToDatabase();

export default connection;

// app.js
import db from './database.js'; // await выполняется автоматически
```

### 6.5 Особенности ESM

#### Статический анализ

```javascript
// ✅ Работает - статический импорт
import { func } from './module.js';

// ❌ Не работает - динамическое имя модуля
const moduleName = './module.js';
import { func } from moduleName; // Ошибка!

// ✅ Для динамики используйте динамический импорт
const module = await import(moduleName);
```

#### Строгий режим

```javascript
// Автоматически включен 'use strict'
// Нельзя использовать необъявленные переменные
x = 10; // ReferenceError
```

#### Live bindings (живые привязки)

```javascript
// counter.js
export let count = 0;

export function increment() {
  count++;
}

// app.js
import { count, increment } from './counter.js';

console.log(count); // 0
increment();
console.log(count); // 1 - значение обновилось!

// В CommonJS это не работает (копируется значение)
```

---

## 7. Сравнение CommonJS и ESM

### 7.1 Таблица различий

|Характеристика|CommonJS|ESM|
|---|---|---|
|Синтаксис импорта|`require()`|`import`|
|Синтаксис экспорта|`module.exports`|`export`|
|Загрузка|Синхронная|Асинхронная|
|Когда загружается|Во время выполнения|Во время парсинга|
|Кэширование|`require.cache`|Встроенное|
|Условный импорт|Легко (`if/require`)|Через динамический импорт|
|Tree Shaking|Нет|Да|
|Top-level await|Нет|Да|
|Копирование vs Ссылка|Копия значения|Живая ссылка|
|Строгий режим|Опционально|Всегда|
|`this` в модуле|`exports`|`undefined`|
|Расширение файла|`.js`, `.cjs`|`.mjs`, `.js` (с "type": "module")|

### 7.2 Примеры кода

**CommonJS:**

```javascript
// math.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
module.exports = { add, subtract };

// app.js
const { add } = require('./math');
console.log(add(2, 3));
```

**ESM:**

```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// app.js
import { add } from './math.js';
console.log(add(2, 3));
```

---

## 8. Взаимодействие между CommonJS и ESM

### 8.1 Импорт CommonJS из ESM

```javascript
// commonjs-module.js (CommonJS)
module.exports = {
  name: 'CommonJS Module',
  version: '1.0'
};

// esm-module.mjs (ESM)
import cjsModule from './commonjs-module.js';
console.log(cjsModule.name); // 'CommonJS Module'

// Named import не работает
// import { name } from './commonjs-module.js'; // Ошибка!
```

### 8.2 Импорт ESM из CommonJS

```javascript
// esm-module.mjs (ESM)
export const data = 'ESM Data';

// commonjs-module.js (CommonJS)
// require() не может импортировать ESM синхронно!
// const esmModule = require('./esm-module.mjs'); // Ошибка!

// Используйте динамический импорт
async function loadModule() {
  const esmModule = await import('./esm-module.mjs');
  console.log(esmModule.data);
}

loadModule();
```

### 8.3 Dual Package (гибридный пакет)

Создание пакета, работающего в обеих системах:

```json
// package.json
{
  "name": "my-package",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "exports": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  }
}
```

---

## 9. Продвинутые темы

### 9.1 Циклические зависимости

**CommonJS:**

```javascript
// a.js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done =', b.done);
exports.done = true;
console.log('a done');

// b.js
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done =', a.done); // false (частичный экспорт)
exports.done = true;
console.log('b done');

// main.js
const a = require('./a.js');
const b = require('./b.js');
// Вывод:
// a starting
// b starting
// in b, a.done = false
// b done
// in a, b.done = true
// a done
```

**ESM:**

```javascript
// a.mjs
import { b } from './b.mjs';
export const a = 'a';
console.log(b);

// b.mjs
import { a } from './a.mjs';
export const b = 'b';
console.log(a);

// Работает благодаря hoisting экспортов
```

### 9.2 Условная загрузка модулей

**CommonJS:**

```javascript
let module;

if (process.env.NODE_ENV === 'production') {
  module = require('./prod-module');
} else {
  module = require('./dev-module');
}
```

**ESM:**

```javascript
let module;

if (process.env.NODE_ENV === 'production') {
  module = await import('./prod-module.js');
} else {
  module = await import('./dev-module.js');
}
```

### 9.3 Monkey Patching модулей

```javascript
// Изменение модуля после загрузки (CommonJS)
const fs = require('fs');
const originalReadFile = fs.readFile;

fs.readFile = function(...args) {
  console.log('Reading file:', args[0]);
  return originalReadFile.apply(this, args);
};
```

### 9.4 Создание своего загрузчика модулей

```javascript
// custom-loader.mjs
export async function resolve(specifier, context, defaultResolve) {
  console.log('Resolving:', specifier);
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  console.log('Loading:', url);
  return defaultLoad(url, context, defaultLoad);
}

// Запуск: node --loader ./custom-loader.mjs app.js
```

---

## 10. Лучшие практики

### 10.1 Общие рекомендации

1. **Используйте ESM для новых проектов**
    
    - Современный стандарт
    - Лучшая поддержка инструментов
    - Tree shaking
2. **Явные расширения файлов в ESM**
    
    ```javascript
    // ✅ Правильно
    import { func } from './module.js';
    
    // ❌ Неправильно
    import { func } from './module';
    ```
    
3. **Один модуль = одна ответственность**
    
    ```javascript
    // ✅ Хорошо
    // user.js - только логика пользователей
    // database.js - только работа с БД
    
    // ❌ Плохо
    // utils.js - всё подряд
    ```
    
4. **Избегайте циклических зависимостей**
    
    - Рефакторите общий код в отдельный модуль
    - Используйте dependency injection
5. **Не мутируйте импортированные объекты**
    
    ```javascript
    // ❌ Плохо
    import config from './config.js';
    config.apiUrl = 'new-url'; // мутация
    
    // ✅ Хорошо
    import config from './config.js';
    const newConfig = { ...config, apiUrl: 'new-url' };
    ```
    

### 10.2 Структура проекта

```
project/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   └── index.js (barrel file)
│   ├── services/
│   │   ├── auth.js
│   │   └── database.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── config/
│   │   └── index.js
│   └── index.js
├── package.json
└── README.md
```

### 10.3 Производительность

1. **Минимизируйте импорты**
    
    ```javascript
    // ❌ Медленно
    import _ from 'lodash';
    
    // ✅ Быстрее
    import debounce from 'lodash/debounce';
    ```
    
2. **Используйте ленивую загрузку**
    
    ```javascript
    // Загружаем только при необходимости
    async function heavyTask() {
      const { processData } = await import('./heavy-module.js');
      return processData();
    }
    ```
    
3. **Кэширование при необходимости**
    
    ```javascript
    let cachedModule;
    
    async function getModule() {
      if (!cachedModule) {
        cachedModule = await import('./module.js');
      }
      return cachedModule;
    }
    ```
    

---

## 11. Отладка модулей

### 11.1 Просмотр кэша модулей

```javascript
// CommonJS
console.log(Object.keys(require.cache));

// Очистка конкретного модуля
delete require.cache[require.resolve('./module.js')];
```

### 11.2 Трассировка загрузки модулей

```bash
# Node.js флаги для отладки
node --trace-warnings app.js
node --trace-deprecation app.js
node --inspect app.js
```

### 11.3 Проверка типа модуля

```javascript
// В package.json
console.log(require('./package.json').type); // 'module' или undefined

// Проверка в коде
if (typeof require !== 'undefined') {
  console.log('CommonJS context');
} else {
  console.log('ESM context');
}
```

---

## 12. Миграция с CommonJS на ESM

### Шаги миграции:

1. **Добавьте `"type": "module"` в package.json**
    
2. **Замените require на import**
    
    ```javascript
    // Было
    const express = require('express');
    const { readFile } = require('fs').promises;
    
    // Стало
    import express from 'express';
    import { readFile } from 'fs/promises';
    ```
    
3. **Замените module.exports на export**
    
    ```javascript
    // Было
    module.exports = { func1, func2 };
    
    // Стало
    export { func1, func2 };
    ```
    
4. **Добавьте расширения .js к импортам**
    
    ```javascript
    // Было
    import utils from './utils';
    
    // Стало
    import utils from './utils.js';
    ```
    
5. **Замените __dirname и __filename**
    
    ```javascript
    // В ESM нет __dirname и __filename
    import { fileURLToPath } from 'url';
    import { dirname } from 'path';
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    ```
    
6. **Используйте динамический импорт для условной загрузки**
    

---

## Заключение

Модульная система Node.js эволюционировала от CommonJS к стандарту ESM. Понимание обеих систем критично для работы с современным JavaScript:

- **CommonJS** — традиционная система, синхронная, простая
- **ESM** — современный стандарт, асинхронный, мощный

Выбор системы зависит от:

- Поддержки зависимостей
- Требований к производительности
- Совместимости с инструментами
- Предпочтений команды

Для новых проектов рекомендуется использовать **ESM** как будущее JavaScript.