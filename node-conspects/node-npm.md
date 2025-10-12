## Введение в NPM

**NPM (Node Package Manager)** — это стандартный пакетный менеджер для Node.js, который позволяет управлять зависимостями проекта, устанавливать библиотеки и делиться своим кодом с сообществом.

NPM состоит из трёх компонентов:

- Веб-сайт (npmjs.com) — для поиска пакетов
- CLI (Command Line Interface) — инструмент командной строки
- Реестр (registry) — база данных пакетов

## Семантическое версионирование (Semantic Versioning)

### Структура версии: MAJOR.MINOR.PATCH

**Формат:** `1.2.3`

- **MAJOR (1)** — мажорная версия, несовместимые изменения API
- **MINOR (2)** — минорная версия, новая функциональность с обратной совместимостью
- **PATCH (3)** — патч-версия, исправления багов

### Правила изменения версий

1. **PATCH** увеличивается при исправлении багов без изменения API
2. **MINOR** увеличивается при добавлении новой функциональности с сохранением совместимости
3. **MAJOR** увеличивается при внесении несовместимых изменений

### Примеры версий

```
1.0.0 → 1.0.1  (исправление бага)
1.0.1 → 1.1.0  (новая функция)
1.1.0 → 2.0.0  (breaking changes)
```

### Pre-release версии

```
1.0.0-alpha
1.0.0-alpha.1
1.0.0-beta
1.0.0-rc.1
```

## Допустимые версии и диапазоны

### Символы указания диапазонов

**Caret (^)** — обновления, не меняющие первую ненулевую цифру:

```json
"^1.2.3" → >=1.2.3 <2.0.0
"^0.2.3" → >=0.2.3 <0.3.0
"^0.0.3" → >=0.0.3 <0.0.4
```

**Tilde (~)** — обновления только PATCH версии:

```json
"~1.2.3" → >=1.2.3 <1.3.0
"~1.2" → >=1.2.0 <1.3.0
"~1" → >=1.0.0 <2.0.0
```

**Wildcard (*)** — любая версия:

```json
"*" → любая версия
"1.x" → >=1.0.0 <2.0.0
"1.2.x" → >=1.2.0 <1.3.0
```

**Точная версия**:

```json
"1.2.3" → только версия 1.2.3
```

**Диапазоны**:

```json
">=1.2.3 <2.0.0"
"1.2.3 - 1.8.0"
">1.0.0"
"<=2.0.0"
```

### Практические рекомендации

- **^** (по умолчанию) — для большинства зависимостей
- **~** — для более консервативного подхода
- **Точная версия** — для критичных зависимостей
- **latest** — последняя стабильная версия (не рекомендуется в продакшене)

## Установка, обновление и удаление пакетов

### Установка пакетов

**Локальная установка** (в проект):

```bash
npm install express
npm install express@4.18.2  # конкретная версия
npm i express               # короткая форма
```

**Глобальная установка**:

```bash
npm install -g nodemon
npm i -g typescript
```

**Установка из package.json**:

```bash
npm install  # установит все зависимости
npm ci       # чистая установка (для CI/CD)
```

**Установка в devDependencies**:

```bash
npm install --save-dev jest
npm i -D eslint
```

**Установка в optionalDependencies**:

```bash
npm install --save-optional fsevents
```

### Обновление пакетов

**Проверка устаревших пакетов**:

```bash
npm outdated
```

**Обновление пакетов**:

```bash
npm update              # обновит в пределах диапазона
npm update express      # обновить конкретный пакет
npm update -g           # обновить глобальные пакеты
```

**Обновление до последней версии** (игнорируя диапазон):

```bash
npm install express@latest
```

**Интерактивное обновление**:

```bash
npx npm-check-updates        # проверка
npx npm-check-updates -u     # обновление package.json
npm install                  # установка новых версий
```

### Удаление пакетов

**Локальное удаление**:

```bash
npm uninstall express
npm remove express
npm rm express
npm un express
```

**Глобальное удаление**:

```bash
npm uninstall -g nodemon
```

**Очистка неиспользуемых пакетов**:

```bash
npm prune              # удалит пакеты, не указанные в package.json
npm prune --production # удалит devDependencies
```

## Файл package.json

### Структура package.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "Описание проекта",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "keywords": ["node", "express"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "~7.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo.git"
  }
}
```

### Основные поля

**Обязательные поля**:

- `name` — имя пакета (строчные буквы, без пробелов)
- `version` — версия пакета

**Важные поля**:

- `description` — краткое описание
- `main` — точка входа в приложение
- `scripts` — команды для выполнения
- `keywords` — ключевые слова для поиска
- `author` — автор пакета
- `license` — тип лицензии
- `dependencies` — производственные зависимости
- `devDependencies` — зависимости для разработки

**Дополнительные поля**:

- `engines` — требуемые версии Node.js и npm
- `repository` — репозиторий с кодом
- `bugs` — адрес для сообщений об ошибках
- `homepage` — домашняя страница проекта
- `private` — если true, пакет не будет опубликован

### Создание package.json

```bash
npm init              # интерактивное создание
npm init -y           # создание с настройками по умолчанию
npm init --scope=@username  # создание scoped-пакета
```

## Файл package-lock.json

### Назначение

**package-lock.json** автоматически генерируется при изменении `node_modules` или `package.json` и фиксирует:

- Точные версии всех установленных пакетов
- Полное дерево зависимостей
- Контрольные суммы для проверки целостности
- URL источников пакетов

### Зачем нужен

1. **Детерминированность** — одинаковое дерево зависимостей на всех машинах
2. **Безопасность** — проверка целостности через контрольные суммы
3. **Скорость** — ускорение установки за счёт кэшированной информации
4. **Откат** — возможность вернуться к предыдущему состоянию

### Структура

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "my-project",
      "version": "1.0.0",
      "dependencies": {
        "express": "^4.18.2"
      }
    },
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "body-parser": "1.20.1"
      }
    }
  }
}
```

### Работа с lock-файлом

**Добавление в Git**:

```bash
git add package-lock.json
```

✅ **Всегда** коммитьте `package-lock.json` в репозиторий!

**Обновление lock-файла**:

```bash
npm install         # обновит lock при изменении package.json
npm update          # обновит lock при обновлении пакетов
```

**Чистая установка**:

```bash
npm ci  # устанавливает точно по lock-файлу, быстрее install
```

**Различия npm install vs npm ci**:

|npm install|npm ci|
|---|---|
|Может изменить package-lock.json|Требует наличия package-lock.json|
|Устанавливает по диапазонам|Устанавливает точные версии|
|Медленнее|Быстрее|
|Для разработки|Для CI/CD и продакшн|

## node_modules и переустановка

### Структура node_modules

```
node_modules/
├── express/
│   ├── package.json
│   ├── index.js
│   └── lib/
├── mongoose/
└── .package-lock.json
```

**Особенности**:

- Содержит все зависимости проекта
- Может весить сотни мегабайт
- **Никогда** не добавляется в Git (через .gitignore)
- Flat-структура (с npm 3+) для оптимизации

### Переустановка node_modules

**Полная переустановка**:

```bash
rm -rf node_modules package-lock.json
npm install
```

Или на Windows:

```bash
rmdir /s node_modules
del package-lock.json
npm install
```

**Причины для переустановки**:

- Решение проблем с зависимостями
- Конфликты версий
- Повреждённые пакеты
- Переход между ветками с разными зависимостями

**Очистка кэша NPM**:

```bash
npm cache clean --force
npm cache verify
```

### .gitignore для Node.js проектов

```gitignore
# Dependencies
node_modules/

# Logs
logs/
*.log
npm-debug.log*

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Build
dist/
build/
```

## Исполняемые файлы и bin

### Что такое bin

Поле `bin` в `package.json` определяет исполняемые команды, которые будут доступны после установки пакета.

### Создание исполняемого пакета

**package.json**:

```json
{
  "name": "my-cli-tool",
  "version": "1.0.0",
  "bin": {
    "mytool": "./bin/cli.js"
  }
}
```

**bin/cli.js**:

```javascript
#!/usr/bin/env node

console.log('Hello from my CLI tool!');
```

**Права на выполнение** (Linux/Mac):

```bash
chmod +x bin/cli.js
```

### Глобальная установка

После установки команда становится доступной глобально:

```bash
npm install -g my-cli-tool
mytool  # выполнит bin/cli.js
```

### Локальная установка

При локальной установке команда доступна через:

```bash
npx mytool
# или
./node_modules/.bin/mytool
```

### Папка .bin

При установке пакетов с `bin`, NPM создаёт симлинки в:

```
node_modules/.bin/
├── eslint
├── jest
├── nodemon
└── prettier
```

### NPX — запуск без установки

**npx** позволяет запускать пакеты без глобальной установки:

```bash
npx create-react-app my-app  # временно скачает и запустит
npx cowsay "Hello"
npx json-server --watch db.json
```

**Преимущества npx**:

- Не засоряет глобальное пространство
- Всегда использует последнюю версию
- Удобно для одноразовых задач
- Автоматически находит локальные бинарники

## devDependencies vs dependencies

### dependencies

**Производственные зависимости** — необходимы для работы приложения:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3"
  }
}
```

Установка:

```bash
npm install express
npm install --save express  # устаревший способ
```

### devDependencies

**Зависимости для разработки** — нужны только при разработке:

```json
{
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "@types/node": "^20.0.0"
  }
}
```

Установка:

```bash
npm install --save-dev jest
npm install -D eslint
```

### Когда использовать devDependencies

Инструменты для разработки:

- **Тестирование**: jest, mocha, chai
- **Линтеры**: eslint, tslint
- **Форматтеры**: prettier
- **Сборщики**: webpack, rollup, vite
- **TypeScript**: typescript, @types/*
- **Транспиляторы**: babel
- **Мониторинг**: nodemon, pm2

### Production установка

При деплое устанавливайте только production зависимости:

```bash
npm install --production
# или
npm ci --only=production
```

Это ускоряет установку и уменьшает размер образа в Docker.

### optionalDependencies

Опциональные зависимости — не критичны для работы:

```json
{
  "optionalDependencies": {
    "fsevents": "^2.3.2"
  }
}
```

Если установка не удалась, процесс продолжится без ошибок.

### peerDependencies

Зависимости, которые должны быть установлены пользователем:

```json
{
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  }
}
```

Используется в библиотеках и плагинах.

## Скрипты (npm scripts)

### Определение скриптов

Скрипты определяются в поле `scripts` в `package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode production",
    "lint": "eslint .",
    "format": "prettier --write \"**/*.js\""
  }
}
```

### Запуск скриптов

```bash
npm run start
npm start          # короткая форма для start
npm run dev
npm test           # короткая форма для test
npm run build
```

### Специальные скрипты

**Lifecycle scripts** — выполняются автоматически:

```json
{
  "scripts": {
    "preinstall": "echo Перед установкой",
    "postinstall": "echo После установки",
    "prepublish": "npm run build",
    "prepare": "npm run build",
    "pretest": "eslint .",
    "test": "jest",
    "posttest": "echo Тесты завершены"
  }
}
```

**Порядок выполнения**:

```
npm install
  → preinstall → install → postinstall → prepare

npm test
  → pretest → test → posttest
```

### Передача аргументов

```bash
npm run test -- --coverage
npm run dev -- --port 4000
```

Два дефиса `--` отделяют аргументы npm от аргументов скрипта.

### Переменные окружения

В скриптах доступны специальные переменные:

```json
{
  "scripts": {
    "info": "echo $npm_package_name@$npm_package_version"
  }
}
```

**Доступные переменные**:

- `npm_package_name` — имя пакета
- `npm_package_version` — версия
- `npm_package_scripts_*` — все скрипты
- `npm_config_*` — конфигурация npm

### Последовательное выполнение

**С помощью &&** (выполняется последовательно):

```json
{
  "scripts": {
    "build": "npm run clean && npm run compile && npm run minify"
  }
}
```

**С помощью npm-run-all** (пакет):

```bash
npm install -D npm-run-all
```

```json
{
  "scripts": {
    "build": "npm-run-all clean compile minify",
    "build:parallel": "npm-run-all --parallel watch:*"
  }
}
```

### Параллельное выполнение

```json
{
  "scripts": {
    "watch:js": "webpack --watch",
    "watch:css": "sass --watch",
    "watch": "npm run watch:js & npm run watch:css"
  }
}
```

### Кроссплатформенные скрипты

Используйте пакеты для совместимости:

**cross-env** — установка переменных окружения:

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development nodemon index.js"
  }
}
```

**rimraf** — удаление файлов:

```json
{
  "scripts": {
    "clean": "rimraf dist build"
  }
}
```

### Примеры практичных скриптов

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.js",
    "build": "tsc",
    "watch": "tsc --watch",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "clean": "rimraf dist",
    "prebuild": "npm run clean",
    "prepare": "husky install",
    "deploy": "npm run build && node deploy.js"
  }
}
```

## NVM (Node Version Manager)

### Что такое NVM

**NVM** — инструмент для управления несколькими версиями Node.js на одной машине. Позволяет легко переключаться между версиями.

⚠️ **Примечание**: NVM и NPM — это разные инструменты!

- **NVM** — управляет версиями Node.js
- **NPM** — управляет пакетами проекта

### Установка NVM

**Linux/Mac**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# или
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Windows** — используйте nvm-windows:

- Скачайте с: https://github.com/coreybutler/nvm-windows

### Основные команды NVM

**Установка версии Node.js**:

```bash
nvm install 18        # последняя версия 18.x
nvm install 20.0.0    # конкретная версия
nvm install --lts     # последняя LTS версия
nvm install node      # последняя версия
```

**Список установленных версий**:

```bash
nvm ls
nvm list
```

**Список доступных версий**:

```bash
nvm ls-remote        # Linux/Mac
nvm list available   # Windows
```

**Переключение версии**:

```bash
nvm use 18
nvm use 20.0.0
nvm use --lts
```

**Версия по умолчанию**:

```bash
nvm alias default 18
nvm alias default node
```

**Текущая версия**:

```bash
nvm current
node --version
```

**Удаление версии**:

```bash
nvm uninstall 16
```

### .nvmrc файл

Файл `.nvmrc` в корне проекта определяет нужную версию Node.js:

```
18.16.0
```

или:

```
lts/hydrogen
```

**Использование**:

```bash
nvm use          # прочитает версию из .nvmrc
nvm install      # установит версию из .nvmrc
```

### Автоматическое переключение

**Для Bash** (добавьте в `.bashrc`):

```bash
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

### Практические советы

1. **Используйте .nvmrc** в каждом проекте для консистентности
2. **LTS версии** предпочтительны для продакшн-проектов
3. **Последние версии** для экспериментов и новых проектов
4. **Не забывайте** переустанавливать глобальные пакеты при смене версии

```bash
# Переустановка глобальных пакетов из другой версии
nvm use 20
nvm reinstall-packages 18
```

## Дополнительные возможности NPM

### Конфигурация NPM

**Просмотр конфигурации**:

```bash
npm config list
npm config get registry
npm config get prefix
```

**Изменение конфигурации**:

```bash
npm config set registry https://registry.npmjs.org/
npm config set save-exact true
```

**Файлы конфигурации**:

- `.npmrc` в проекте (приоритет)
- `.npmrc` в домашней директории
- Глобальная конфигурация

### Приватные пакеты и скоупы

**Scoped пакеты**:

```json
{
  "name": "@mycompany/mypackage",
  "version": "1.0.0"
}
```

**Установка**:

```bash
npm install @mycompany/mypackage
```

### Публикация пакета

```bash
npm login
npm publish
npm publish --access public  # для scoped пакетов
```

### Версионирование при публикации

```bash
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.1 → 1.1.0
npm version major    # 1.1.0 → 2.0.0
npm publish
```

### Аудит безопасности

```bash
npm audit              # проверка уязвимостей
npm audit fix          # автоматическое исправление
npm audit fix --force  # принудительное обновление
```

### Альтернативы NPM

**Yarn** — альтернативный пакетный менеджер:

```bash
yarn install
yarn add express
yarn remove express
```

**pnpm** — быстрый и экономный:

```bash
pnpm install
pnpm add express
pnpm remove express
```

## Лучшие практики

### 1. Версионирование

✅ Используйте семантическое версионирование ✅ Коммитьте `package-lock.json` ✅ Используйте `^` для библиотек, точные версии для критичных зависимостей

### 2. Зависимости

✅ Разделяйте `dependencies` и `devDependencies` ✅ Регулярно обновляйте зависимости ✅ Проверяйте уязвимости через `npm audit` ✅ Удаляйте неиспользуемые пакеты

### 3. Скрипты

✅ Документируйте скрипты в README ✅ Используйте осмысленные имена ✅ Группируйте связанные скрипты (test, test:watch, test:coverage)

### 4. Производительность

✅ Используйте `npm ci` в CI/CD ✅ Кэшируйте `node_modules` в CI ✅ Не коммитьте `node_modules` в Git ✅ Используйте `.npmignore` при публикации

### 5. Безопасность

✅ Не храните секреты в `package.json` ✅ Используйте переменные окружения ✅ Регулярно проверяйте `npm audit` ✅ Используйте `npm ci` вместо `npm install` в продакшн

## Полезные команды (шпаргалка)

```bash
# Инициализация
npm init
npm init -y

# Установка
npm install
npm install <package>
npm install -g <package>
npm install --save-dev <package>
npm ci

# Обновление
npm update
npm update <package>
npm outdated

# Удаление
npm uninstall <package>
npm prune

# Информация
npm list
npm list --depth=0
npm list -g --depth=0
npm view <package>
npm info <package>

# Скрипты
npm run <script>
npm start
npm test

# Версионирование
npm version patch
npm version minor
npm version major

# Безопасность
npm audit
npm audit fix

# Конфигурация
npm config list
npm config get <key>
npm config set <key> <value>

# Очистка
npm cache clean --force
npm cache verify

# NPX
npx <package>

# Публикация
npm login
npm publish
npm unpublish
```

