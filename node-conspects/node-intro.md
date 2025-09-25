разберем такие темы как:

- для чего нужен Node.js
    
- как установить Node.js
    
- pwd (print working directory) путь к файлу в терминале
    
- выполнение кода в терминале с помощью интерпритатора node, выполнение программы без указания расширения
    
- выполнение программы с помощью Code runner
    
- ошибки при выполнение кода
    
- настроки проекта, и приоритетные настройки проекта через VScode/settings.json
  


## 1. Для чего нужен Node.js

Node.js — это серверная среда выполнения JavaScript, построенная на движке V8 от Google Chrome. Это революционная технология, которая вывела JavaScript за пределы браузера и позволила использовать его для создания полноценных серверных приложений.

### Подробное описание Node.js:

**Что такое Node.js технически:** Node.js представляет собой runtime-среду, которая позволяет выполнять JavaScript-код вне браузера. Она использует событийно-ориентированную архитектуру с неблокирующим вводом-выводом, что делает её идеальной для создания масштабируемых сетевых приложений. В основе Node.js лежит движок V8 - тот же самый движок, который используется в браузере Google Chrome для выполнения JavaScript.

**Архитектурные особенности:**

- **Однопоточность с циклом событий (Event Loop)**: Node.js работает в одном потоке, но использует асинхронные операции для обработки множественных запросов
- **Неблокирующий I/O**: операции чтения/записи файлов, сетевые запросы выполняются асинхронно
- **V8 движок**: высокопроизводительный JavaScript-движок от Google
- **libuv**: библиотека на C++, обеспечивающая асинхронный ввод-вывод

### Основное назначение:

**Серверная разработка:** Node.js идеально подходит для создания веб-серверов благодаря своей асинхронной природе. Традиционные серверы создают новый поток для каждого запроса, что требует много памяти. Node.js обрабатывает все запросы в одном потоке, используя колбэки, промисы и async/await для управления асинхронными операциями. Это позволяет обслуживать тысячи одновременных соединений с минимальными накладными расходами.

**API и микросервисы:** Node.js превосходно подходит для создания RESTful API и GraphQL серверов. Благодаря JSON как нативному формату данных в JavaScript, работа с API становится очень естественной. Микросервисная архитектура также выигрывает от быстрого старта приложений Node.js и низкого потребления памяти.

**Консольные приложения и автоматизация:** CLI-утилиты на Node.js позволяют автоматизировать рутинные задачи разработки: сборка проектов, развертывание, тестирование. Многие популярные инструменты разработки написаны на Node.js: Webpack, Parcel, ESLint, Prettier.

**Desktop приложения (Electron):** Electron позволяет создавать кроссплатформенные desktop приложения используя веб-технологии. Приложения работают в Chromium браузере, упакованном вместе с Node.js runtime. Примеры: Visual Studio Code, Discord, Slack, WhatsApp Desktop, Figma.

- **Electron**
    - VS Code построен на **Electron** — это фреймворк для создания кроссплатформенных приложений с помощью **HTML, CSS и JavaScript**.
        
    - Electron включает **Chromium** (для интерфейса) и **Node.js** (для работы с файловой системой, плагинами и другими низкоуровневыми функциями).
        
- **Node.js**
    
    - Node.js в VS Code используется для выполнения внутренних задач, расширений и взаимодействия с ОС.
        
    - Например, все расширения VS Code работают через Node.js, и многие операции с файлами или терминалом внутри VS Code используют Node.js API.
        
- **TypeScript**
    
    - Основная часть исходного кода VS Code написана на **TypeScript** (надстройка над JavaScript), который компилируется в JavaScript.

**Мобильная разработка:** React Native использует Node.js для сборки и разработки мобильных приложений. Ionic Framework также опирается на Node.js экосистему для создания гибридных мобильных приложений.

**IoT (Internet of Things):** Благодаря небольшому размеру и эффективности, Node.js подходит для IoT устройств. Johnny-Five - популярная библиотека для программирования микроконтроллеров на JavaScript.

### Преимущества Node.js (подробное объяснение):

**Единый язык программирования:** Использование JavaScript на frontend и backend значительно упрощает разработку. Разработчики могут переключаться между клиентской и серверной частью без смены языка программирования.

**Неблокирующий ввод-вывод:** Традиционные серверы блокируются при выполнении I/O операций (чтение файлов, запросы к базе данных, HTTP-запросы). Node.js использует колбэки и промисы для продолжения выполнения других задач во время ожидания I/O операций. Это позволяет обрабатывать больше запросов с теми же ресурсами.

**NPM экосистема:** NPM (Node Package Manager) содержит более миллиона пакетов - самый большой репозиторий пакетов среди всех языков программирования. Это означает, что для большинства задач уже существуют готовые решения.

**Быстрая разработка и прототипирование:** Динамическая типизация JavaScript, богатая экосистема пакетов и простота синтаксиса позволяют очень быстро создавать прототипы и MVP (Minimum Viable Product).

**Производительность:** V8 движок компилирует JavaScript в машинный код, что обеспечивает высокую скорость выполнения. Event-driven архитектура обеспечивает отличную производительность для I/O-интенсивных приложений.

**Сообщество и поддержка:** Node.js имеет огромное и активное сообщество разработчиков. Это означает регулярные обновления, быстрые исправления багов, обширную документацию и множество обучающих материалов.

### Где используется (расширенное описание):

**Крупные технологические компании:**

- **Netflix**: использует Node.js для создания пользовательского интерфейса и API, что позволило сократить время загрузки на 70%
- **PayPal**: перешел с Java на Node.js и получил удвоение производительности при вдвое меньшем количестве кода
- **Uber**: использует Node.js для обработки миллионов запросов в реальном времени для сопоставления водителей и пассажиров
- **LinkedIn**: мобильное приложение LinkedIn полностью построено на Node.js
	
	- Раньше LinkedIn использовал **Ruby on Rails** для своего мобильного бэкенда, но в 2011–2012 годах они **переписали сервер мобильного приложения на Node.js**.
	    
	- Почему Node.js:
	    
	    - Node.js поддерживает **неблокирующий I/O**, что идеально подходит для большого количества одновременных сетевых запросов от мобильных пользователей.
	        
	    - Это позволило **снизить время отклика сервера и уменьшить количество серверов**, так как один Node.js-процесс может обрабатывать **десятки тысяч соединений одновременно**.
	        
	- Архитектура:
	    
	    - Node.js обрабатывает **REST API для мобильного приложения**.
	        
	    - Сервер быстро получает запросы от мобильного клиента, обращается к базе данных, кешу и возвращает JSON-ответ.
	        
	    - Благодаря асинхронному подходу Node.js масштабируется под миллионы пользователей.
	      
- **WhatsApp**: обслуживает миллиарды сообщений используя Node.js
	 WhatsApp — один из крупнейших мессенджеров в мире с **миллиардами сообщений в день**.
	    
	- Серверная часть WhatsApp использует **Node.js для обработки сообщений в реальном времени**.
	    
	- Почему Node.js:
	    
	    - Мессенджер требует **высокую производительность при огромном количестве соединений**, а Node.js идеально подходит для таких задач из-за **event-driven архитектуры**.
	        
	    - Каждый пользователь поддерживает **постоянное TCP/WebSocket соединение**, а Node.js позволяет **обрабатывать миллионы соединений в одном процессе**.
	        
	- Архитектура:
	    
	    - Node.js обрабатывает входящие и исходящие сообщения, используя **неблокирующий I/O и события**.
	        
	    - Благодаря этому сервер может **моментально пересылать сообщения** и уведомления без задержек.
	        
	    - Также Node.js используется для синхронизации данных между клиентами и хранением состояний соединений.

**Типы приложений:**

- **Чаты в реальном времени**: WebSocket-соединения для мгновенного обмена сообщениями
- **Стриминговые сервисы**: обработка потоков данных в реальном времени
- **Социальные сети**: обработка больших объемов пользовательского контента
- **E-commerce платформы**: обработка заказов, платежей, управление каталогом
- **Системы аналитики**: сбор и обработка метрик в реальном времени
- **Content Management Systems**: создание и управление контентом

## 2. Установка Node.js

Существует несколько способов установки, каждый из которых имеет свои преимущества и недостатки.

### Подробное описание процесса установки:

**Что происходит при установке Node.js:** При установке Node.js на вашу систему устанавливаются несколько компонентов:

- **Node.js runtime** - среда выполнения JavaScript
- **NPM (Node Package Manager)** - менеджер пакетов для установки библиотек
- **Node REPL** - интерактивная консоль для быстрого тестирования кода
- **Документация** - справочные материалы (опционально)

**Версии Node.js:** Node.js выпускается в двух типах версий:

- **LTS (Long Term Support)** - стабильные версии с долгосрочной поддержкой (рекомендуется для продакшена)
- **Current** - самые новые версии с последними функциями (для экспериментов и изучения новых возможностей)

Версии LTS выпускаются каждые 6 месяцев и поддерживаются 30 месяцев. Они обеспечивают стабильность и совместимость для коммерческих проектов.

### Способы установки (детальное описание):

Установка с официального сайта nodejs.org - самый простой и безопасный способ

**Преимущества:**

- Гарантированно оригинальные и безопасные файлы
- Автоматическая настройка PATH переменных
- Включает NPM в комплекте
- Простой графический инсталлятор

**Процесс установки:**

1. Перейдите на https://nodejs.org/
2. Выберите LTS версию для стабильности
3. Скачайте установщик для вашей ОС (Windows .msi, macOS .pkg, Linux .tar.xz)
4. Запустите установщик и следуйте инструкциям
5. Установщик автоматически добавит Node.js в системный PATH

**Что устанавливается:**

- Node.js executable в системную папку
- NPM (обычно в той же папке)
- Документация (опционально)
- Символические ссылки для доступа из командной строки

#### Через пакетные менеджеры:

Пакетные менеджеры - это инструменты для автоматической установки, обновления и удаления программного обеспечения. Они особенно полезны для разработчиков, так как позволяют легко управлять зависимостями и версиями.

**Преимущества пакетных менеджеров:**

- Автоматическое управление зависимостями
- Легкое обновление до новых версий
- Простое удаление программ
- Централизованное управление всем ПО
- Возможность устанавливать из командной строки

**Windows (Chocolatey):** Chocolatey - популярный пакетный менеджер для Windows, аналог apt или homebrew.

Сначала нужно установить Chocolatey:

1. Откройте PowerShell от имени администратора
2. Выполните команду установки Chocolatey
3. После установки перезапустите PowerShell

```bash
choco install nodejs
choco install nodejs-lts    # только LTS версия
choco upgrade nodejs        # обновление
```

**macOS (Homebrew):** Homebrew - стандартный пакетный менеджер для macOS, широко используемый разработчиками.

```bash
brew install node
brew install node@18        # конкретная версия
brew upgrade node          # обновление
brew uninstall node        # удаление
```

**Linux (Ubuntu/Debian):** APT (Advanced Package Tool) - стандартный менеджер пакетов для Debian-основанных систем.

```bash
sudo apt update
sudo apt install nodejs npm
sudo apt upgrade nodejs     # обновление
```

**Важное замечание для Linux:** В некоторых дистрибутивах Ubuntu команда `node` может быть занята другим пакетом. В этом случае Node.js доступен как `nodejs`. Чтобы создать символическую ссылку:

```bash
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

**Linux (CentOS/RHEL):** YUM/DNF - менеджеры пакетов для Red Hat-основанных систем.

```bash
sudo yum install nodejs npm     # для старых версий
sudo dnf install nodejs npm     # для новых версий
```

#### Проверка установки (подробное описание):

После установки Node.js важно убедиться, что все компоненты установлены корректно и доступны из командной строки.

```bash
node --version     # или node -v
npm --version      # или npm -v
```

**Что означают версии:**

- **Node.js версия**: показывает версию установленной среды выполнения (например, v18.17.0)
- **NPM версия**: показывает версию менеджера пакетов (например, 9.6.7)

**Расшифровка версий Node.js:** Версии Node.js следуют схеме семантического версионирования (SemVer):

- **Major версия** (18) - значительные изменения, могут нарушить совместимость
- **Minor версия** (17) - новые функции, обратно совместимые
- **Patch версия** (0) - исправления багов

##### **Major (18) — Главная версия**

- **Что означает:** крупные изменения, которые могут **нарушить обратную совместимость**.
    
- Примеры изменений:
    
    - удаление старых API
        
    - изменения поведения функций
        
    - обновление движка V8 с новыми возможностями, но с несовместимым поведением
        
- Когда обновлять:
    
    - Major версии требуют проверки вашего кода, так как старые приложения могут **сломаться без изменений**.
        

---

#####  **Minor (17) — Минорная версия**

- **Что означает:** добавление **новых возможностей и функций**, которые **не ломают существующий код**.
    
- Примеры изменений:
    
    - новые методы в стандартной библиотеке
        
    - поддержка новых стандартов JavaScript
        
    - улучшения существующих API
        
- Когда обновлять:
    
    - безопасно обновлять, так как существующий код **должен работать без изменений**.
        

---

##### **Patch (0) — Патч**

- **Что означает:** исправления багов и уязвимостей, **без добавления новых функций и без нарушения совместимости**.
    
- Примеры изменений:
    
    - исправление утечек памяти
        
    - исправление ошибок в стандартных модулях
        
    - обновления безопасности
        
- Когда обновлять:
    
    - рекомендуется обновлять как можно скорее, особенно если это исправление безопасности.
        

---

#####  **Дополнительно: LTS и Current**

- Node.js имеет **две основные ветки релизов**:
    
    - **LTS (Long-Term Support)** — стабильные версии для продакшена. Поддерживаются дольше, безопасны для серверов.
        
    - **Current** — новые функции, могут включать экспериментальные возможности.
        

Пример:
```sql
Node.js 18.17.0 LTS → безопасно для продакшена 
Node.js 20.0.0 Current → новые функции, нужно тестировать`
```


**Дополнительные команды проверки:**

```bash
node -p "process.version"           # версия Node.js
node -p "process.platform"         # операционная система
node -p "process.arch"              # архитектура процессора
npm config list                    # настройки NPM
which node                         # путь к исполняемому файлу (Linux/macOS)
where node                         # путь к исполняемому файлу (Windows)
```

**Troubleshooting (устранение проблем):** Если команды не работают, возможные причины:

1. **PATH не настроен**: Node.js не добавлен в системную переменную PATH
2. **Права доступа**: недостаточно прав для выполнения
3. **Конфликт версий**: установлено несколько версий Node.js
4. **Неполная установка**: установка прервалась или выполнилась с ошибками

#### Управление версиями Node.js (подробное объяснение):

В процессе разработки часто возникает необходимость работать с разными версиями Node.js для различных проектов. Некоторые проекты могут требовать старые версии для совместимости, в то время как новые проекты используют последние возможности.

**Зачем нужны менеджеры версий:**

- Разные проекты могут требовать разные версии Node.js
- Тестирование приложения на разных версиях
- Безопасное обновление без нарушения работы существующих проектов
- Возможность быстро переключаться между версиями

**NVM (Node Version Manager) - детальное описание:**

NVM - самый популярный менеджер версий Node.js, доступный для Linux, macOS и Windows (через nvm-windows).

**Установка NVM:**

```bash
# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# или
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# После установки перезапустите терминал или выполните:
source ~/.bashrc
```

**Основные команды NVM:**

```bash
nvm install node        # установка последней версии
nvm install 18.17.0     # установка конкретной версии
nvm install --lts       # установка последней LTS версии
nvm use 18.17.0         # переключение на версию
nvm use node           # переключение на последнюю версию
nvm use --lts          # переключение на последнюю LTS
nvm list               # список установленных версий
nvm ls                 # короткая версия списка
nvm list-remote        # доступные для установки версии
nvm current            # текущая используемая версия
nvm alias default 18.17.0  # установить версию по умолчанию
nvm uninstall 16.14.0  # удаление версии
```

**Практические примеры использования:**

```bash
# Установка нескольких версий
nvm install 16.20.0
nvm install 18.17.0
nvm install 20.5.0

# Переключение для конкретного проекта
cd my-old-project
nvm use 16.20.0
node --version  # v16.20.0

cd my-new-project
nvm use 20.5.0
node --version  # v20.5.0
```

**Файл .nvmrc для автоматического переключения:**

```bash
# Создайте файл .nvmrc в корне проекта
echo "18.17.0" > .nvmrc

# Теперь можно использовать:
nvm use  # автоматически использует версию из .nvmrc
```

**Альтернативы NVM:**

- **n** - простой менеджер версий Node.js для Linux/macOS
- **fnm** - быстрый менеджер версий написанный на Rust
- **Volta** - менеджер версий с поддержкой нескольких языков
- **nvm-windows** - версия NVM для Windows

## 3. PWD (Print Working Directory) - Путь к файлу в терминале

Понимание работы с файловой системой через командную строку является фундаментальным навыком для любого разработчика, особенно при работе с Node.js проектами.

### Подробное описание PWD и навигации:

**Что такое рабочая директория:** Рабочая директория (Working Directory) - это текущая папка, в которой вы находитесь в терминале. Все относительные пути рассчитываются от этой директории. При запуске терминала рабочей директорией обычно становится домашняя папка пользователя.

**Понятие пути в файловой системе:** Файловая система организована в виде дерева, где каждый файл и папка имеют уникальный адрес - путь. Существуют два типа путей:

- **Абсолютный путь**: полный путь от корня файловой системы
- **Относительный путь**: путь относительно текущей рабочей директории

**Команда PWD (Print Working Directory):**

```bash
pwd                     # показать текущий путь
/Users/username/projects/my-app
```

Команда pwd крайне полезна когда вы:

- Потерялись в файловой системе
- Хотите скопировать текущий путь
- Пишете скрипты и нужно знать контекст выполнения
- Отлаживаете проблемы с путями в Node.js приложении

### Основные команды навигации (подробное описание):

**Команды просмотра содержимого директории:**

```bash
ls                      # список файлов и папок
ls -la                  # подробный список со скрытыми файлами
ls -l *.js              # только JavaScript файлы
ls -lh                  # с человекочитаемыми размерами файлов
```

**Расшифровка ls -la:**

- **l**: длинный формат с деталями
- **a**: показать все файлы, включая скрытые (начинающиеся с точки)

Вывод ls -la показывает:

- Права доступа (rwxrwxrwx)
- Количество жестких ссылок
- Владелец файла
- Группа владельца
- Размер файла
- Дата последнего изменения
- Имя файла

**Команды навигации между директориями:**

```bash
cd path/to/directory    # перейти в папку
cd ..                   # на уровень вверх (родительская папка)
cd ~                    # в домашнюю папку пользователя
cd /                    # в корень файловой системы
cd -                    # в предыдущую директорию
cd                      # в домашнюю папку (без аргументов)
```

**Специальные символы в путях:**

- **~**: домашняя папка пользователя (/home/username в Linux, /Users/username в macOS)
- **.**: текущая директория
- **..**: родительская директория
- **-**: предыдущая директория
- **/**: корень файловой системы

**Команды создания и удаления директорий:**

```bash
mkdir new-folder        # создать папку
mkdir -p path/to/deep/folder  # создать вложенные папки
rmdir empty-folder      # удалить пустую папку
rm -rf folder          # удалить папку с содержимым (ОСТОРОЖНО!)
```

**Опасность команды rm -rf:** Эта команда безвозвратно удаляет файлы и папки. Флаги означают:

- **r**: рекурсивно (включая все вложенные файлы и папки)
- **f**: принудительно (без запроса подтверждения)

### Работа с путями (детальное объяснение):

**Абсолютные пути:** Абсолютный путь всегда начинается от корня файловой системы и не зависит от текущего местоположения в терминале.

```bash
# Linux/macOS - начинаются с /
/Users/username/projects/app.js
/home/user/documents/script.js
/var/log/application.log

# Windows - начинаются с буквы диска
C:\Users\Username\Projects\app.js
D:\Development\NodeJS\server.js
```

**Относительные пути:** Относительный путь рассчитывается от текущей рабочей директории.

```bash
./app.js               # в текущей папке (. можно опустить: app.js)
../app.js              # в родительской папке
../../app.js           # на два уровня вверх
folder/app.js          # в подпапке folder
../sibling/app.js      # в соседней папке sibling
```

**Практические примеры навигации:**

Представим структуру проекта:

```
~/projects/
├── my-app/
│   ├── src/
│   │   ├── app.js
│   │   └── utils.js
│   ├── tests/
│   └── package.json
└── other-project/
    └── index.js
```

Навигация по этой структуре:

```bash
cd ~/projects/my-app     # переход в проект
pwd                      # /Users/username/projects/my-app
cd src                   # переход в папку src
pwd                      # /Users/username/projects/my-app/src
cd ../tests             # переход в tests из src
cd ../../other-project  # переход в другой проект
cd ~/projects/my-app/src # абсолютный путь к src
```

**Автодополнение путей:** Большинство терминалов поддерживают автодополнение:

- Нажмите **Tab** после частичного ввода имени файла/папки
- Двойное нажатие **Tab** покажет все возможные варианты
- Используйте стрелки вверх/вниз для навигации по истории команд

**Работа с пробелами в именах:**

```bash
cd "My Folder"          # имя в кавычках
cd My\ Folder           # экранирование пробела
ls "Program Files"      # для папок с пробелами
```

## 4. Выполнение кода в терминале с помощью интерпретатора Node

### Базовое выполнение:

```bash
# Создать файл app.js
echo 'console.log("Hello, Node.js!");' > app.js

# Выполнить файл
node app.js
# Вывод: Hello, Node.js!
```

### Выполнение без расширения:

```bash
# Node.js автоматически ищет файл с расширением .js
node app              # эквивалентно node app.js
```

### Примеры выполнения:

```bash
# Простой скрипт
node -e "console.log('Быстрая команда')"

# С параметрами
node app.js arg1 arg2

# Файл с параметрами (app.js):
console.log('Аргументы:', process.argv.slice(2));
```

### Выполнение кода напрямую:

```bash
node -p "2 + 2"        # выведет 4
node -e "console.log(Math.random())"  # случайное число
```

## 5. Выполнение программы с помощью Code Runner

### Установка расширения Code Runner в VS Code:

1. Откройте VS Code
2. Перейдите в Extensions (Ctrl+Shift+X)
3. Найдите "Code Runner" от Jun Han
4. Установите расширение

### Использование Code Runner:

```bash
# Способы запуска:
# 1. Ctrl+Alt+N (Run Code)
# 2. Щелкнуть правой кнопкой → Run Code
# 3. Command Palette → Run Code
```

### Настройка Code Runner для Node.js:

```json
// В settings.json
{
    "code-runner.executorMap": {
        "javascript": "node"
    },
    "code-runner.runInTerminal": true,
    "code-runner.saveFileBeforeRun": true
}
```

## 6. Ошибки при выполнении кода

### Типичные ошибки и их решения:

#### SyntaxError:

```javascript
// Ошибка: отсутствует скобка
console.log("Hello"
// SyntaxError: missing ) after argument list
```

#### ReferenceError:

```javascript
// Ошибка: переменная не определена
console.log(unknownVariable);
// ReferenceError: unknownVariable is not defined
```

#### TypeError:

```javascript
// Ошибка: неправильный тип данных
let num = 5;
num.toUpperCase();
// TypeError: num.toUpperCase is not a function
```

#### ModuleNotFoundError:

```bash
# Ошибка: модуль не найден
node app.js
# Error: Cannot find module './nonexistent.js'
```

### Отладка ошибок:

```bash
# Запуск с отладчиком
node --inspect app.js
node --inspect-brk app.js  # с остановкой на первой строке

# Подробный вывод ошибок
node --trace-warnings app.js
```

## 7. Настройки проекта и VS Code

### Структура проекта Node.js:

```
my-project/
├── package.json          # описание проекта
├── package-lock.json     # точные версии зависимостей
├── node_modules/         # установленные пакеты
├── src/                  # исходный код
├── tests/               # тесты
├── .gitignore           # игнорируемые файлы
├── README.md            # документация
└── .vscode/             # настройки VS Code
    └── settings.json
```

### VS Code settings.json:

```json
{
    // Node.js специфичные настройки
    "node.autoDetect": "on",
    "javascript.preferences.importModuleSpecifier": "relative",
    "javascript.suggest.autoImports": true,
    
    // Code Runner
    "code-runner.executorMap": {
        "javascript": "node"
    },
    "code-runner.runInTerminal": true,
    "code-runner.saveFileBeforeRun": true,
    "code-runner.clearPreviousOutput": true,
    
    // Форматирование
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    
    // Отладка
    "debug.node.autoAttach": "smart",
    "debug.terminal.clearBeforeReusing": true,
    
    // Файлы
    "files.exclude": {
        "**/node_modules": true,
        "**/.git": true
    },
    
    // Интегрированный терминал
    "terminal.integrated.defaultProfile.windows": "PowerShell",
    "terminal.integrated.fontSize": 14
}
```

### Приоритетные настройки проекта:

```json
// .vscode/settings.json (локальные для проекта)
{
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "files.eol": "\n",
    "javascript.preferences.quoteStyle": "single"
}
```

## 8. Node REPL (Read-Eval-Print Loop)

### Запуск REPL:

```bash
node              # запуск интерактивной консоли
> console.log("Hello REPL!");
Hello REPL!
> 2 + 2
4
> .exit           # или Ctrl+C дважды
```

### Основные возможности REPL:

```javascript
> let x = 10
undefined
> x * 2
20
> Math.random()
0.8394729834729834

// Многострочный ввод
> function greet(name) {
... return `Hello, ${name}!`;
... }
undefined
> greet("Node.js")
'Hello, Node.js!'
```

## 9. Node REPL .help - Доступные команды

```bash
> .help
.break    Sometimes you get stuck, this gets you out
.clear    Alias for .break
.editor   Enter editor mode
.exit     Exit the repl
.help     Print this help message
.load     Load JS from a file into the REPL session
.save     Save all evaluated commands in this REPL session to a file
```

### Подробное описание команд:

#### .break / .clear:

```javascript
> function incomplete(
... // застряли в многострочном вводе
... .break
> // вернулись в обычный режим
```

#### .exit:

```javascript
> .exit
# Завершает сессию REPL
```

#### .load:

```javascript
> .load ./myScript.js
# Загружает и выполняет файл в текущем контексте
```

## 10. Очистка Node REPL

### Способы очистки:

```bash
# 1. Команда clear в терминале (очищает весь терминал)
> console.clear()

# 2. Горячие клавиши
Ctrl+L          # очистка экрана (Linux/macOS)
Cmd+K           # очистка экрана (macOS в некоторых терминалах)

# 3. В Windows PowerShell
cls

# 4. Перезапуск REPL
> .exit
node
```

### Сброс контекста (переменных):

```javascript
// К сожалению, нет прямой команды для очистки переменных
// Нужно перезапустить REPL
> .exit
node
```

## 11. Node REPL Global объект

### Исследование глобального объекта:

```javascript
> global
// Показывает все глобальные переменные и функции

> Object.keys(global)
// Массив всех свойств глобального объекта

> global.process
// Объект process с информацией о текущем процессе

> global.console
// Глобальный объект console

> global.Buffer
// Конструктор Buffer для работы с бинарными данными
```

### Добавление глобальных переменных:

```javascript
> global.myVar = "Hello Global!"
'Hello Global!'
> myVar
'Hello Global!'

> global.myFunction = () => console.log("Global function")
[Function (anonymous)]
> myFunction()
Global function
```

### Важные глобальные объекты:

```javascript
> process.version        # версия Node.js
> process.platform       # операционная система
> process.cwd()          # текущая рабочая папка
> process.env            # переменные окружения
> __dirname              # (не доступно в REPL)
> __filename             # (не доступно в REPL)
```

## 12. Node REPL .editor - Базовые примеры

### Вход в режим редактора:

```javascript
> .editor
// Entering editor mode (^D to finish, ^C to cancel)

function calculateArea(radius) {
  return Math.PI * radius * radius;
}

function greetUser(name) {
  return `Welcome, ${name}! Today is ${new Date().toDateString()}`;
}

console.log(calculateArea(5));
console.log(greetUser("Alice"));

// Нажать Ctrl+D для выполнения
```

### Примеры использования .editor:

#### Пример 1: Работа с массивами

```javascript
> .editor
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const filtered = numbers.filter(n => n > 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log('Original:', numbers);
console.log('Doubled:', doubled);
console.log('Filtered:', filtered);
console.log('Sum:', sum);
// Ctrl+D
```

#### Пример 2: Асинхронный код

```javascript
> .editor
async function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({id: 1, name: "John", age: 30});
    }, 1000);
  });
}

fetchData().then(data => {
  console.log('Received data:', data);
});
// Ctrl+D
```

#### Пример 3: Классы

```javascript
> .editor
class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
    this.speed = 0;
  }
  
  accelerate(amount) {
    this.speed += amount;
    console.log(`${this.brand} ${this.model} now going ${this.speed} km/h`);
  }
}

const myCar = new Car("Toyota", "Camry");
myCar.accelerate(50);
myCar.accelerate(30);
// Ctrl+D
```

## 13. Node REPL .save - Сохранение сессии

### Сохранение всей сессии:

```javascript
> let x = 10
> let y = 20
> function add(a, b) { return a + b; }
> add(x, y)
30
> .save my-session.js
Session saved to: my-session.js
```

### Содержимое сохраненного файла:

```javascript
// my-session.js будет содержать:
let x = 10
let y = 20
function add(a, b) { return a + b; }
add(x, y)
```

### Загрузка сохраненной сессии:

```bash
# Новая сессия REPL
node
> .load my-session.js
let x = 10
let y = 20
function add(a, b) { return a + b; }
add(x, y)
30
```

### Практические применения .save:

```javascript
// Создание полезных утилит
> const utils = {
...   formatDate: (date) => date.toISOString().split('T')[0],
...   randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
...   capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1)
... }
> .save utils.js
# Теперь можно использовать в других проектах
```

## 14. Cat - Просмотр файлов

### Основное использование cat:

```bash
# Просмотр содержимого файла
cat app.js

# Вывод:
console.log("Hello, Node.js!");
const message = "Learning Node.js";
console.log(message);
```

### Дополнительные опции cat:

```bash
# Просмотр с нумерацией строк
cat -n app.js
#      1  console.log("Hello, Node.js!");
#      2  const message = "Learning Node.js";
#      3  console.log(message);

# Просмотр нескольких файлов
cat app.js utils.js

# Просмотр с показом непечатаемых символов
cat -A app.js
```

### Альтернативы cat:

```bash
# Windows
type app.js           # аналог cat
more app.js          # постраничный просмотр
Get-Content app.js   # PowerShell

# Linux/macOS дополнительно
less app.js          # постраничный просмотр с навигацией
head app.js          # первые 10 строк
tail app.js          # последние 10 строк
head -n 5 app.js     # первые 5 строк
tail -n 3 app.js     # последние 3 строки
```

## 15. Дополнительные моменты знакомства с Node.js

### package.json - Сердце Node.js проекта:

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "My first Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "keywords": ["nodejs", "javascript"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

### NPM (Node Package Manager):

```bash
# Инициализация проекта
npm init              # интерактивно
npm init -y           # с настройками по умолчанию

# Установка пакетов
npm install express          # локально в проект
npm install -g nodemon      # глобально
npm install --save-dev jest # как зависимость для разработки

# Управление пакетами
npm list                    # список установленных пакетов
npm outdated               # устаревшие пакеты
npm update                 # обновление пакетов
npm uninstall express      # удаление пакета

# Скрипты
npm run dev               # запуск скрипта "dev"
npm start                 # запуск скрипта "start"
```

### Модульная система Node.js:

#### CommonJS (старый стандарт):

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };

// app.js
const { add, multiply } = require('./math');
console.log(add(5, 3));        // 8
console.log(multiply(4, 7));   // 28
```

#### ES Modules (современный стандарт):

```javascript
// package.json должен содержать "type": "module"

// math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// app.js
import { add, multiply } from './math.js';
console.log(add(5, 3));        // 8
console.log(multiply(4, 7));   // 28
```

### Встроенные модули Node.js:

```javascript
// Файловая система
const fs = require('fs');
fs.readFileSync('file.txt', 'utf8');

// HTTP сервер
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

// Путь к файлам
const path = require('path');
console.log(path.join(__dirname, 'public', 'index.html'));

// Операционная система
const os = require('os');
console.log('Platform:', os.platform());
console.log('CPU architecture:', os.arch());
```

### Переменные окружения:

```javascript
// Чтение переменных окружения
console.log(process.env.NODE_ENV);
console.log(process.env.PORT || 3000);

// Создание .env файла
// PORT=3000
// DATABASE_URL=mongodb://localhost:27017/mydb

// Использование с пакетом dotenv
require('dotenv').config();
console.log(process.env.PORT);
```

### Отладка Node.js приложений:

```bash
# Встроенный отладчик
node inspect app.js

# Chrome DevTools
node --inspect app.js
# Открыть chrome://inspect в браузере

# VS Code отладка (launch.json)
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Program",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/app.js"
    }
  ]
}
```

### Полезные инструменты для Node.js:

```bash
# Nodemon - автоперезапуск при изменениях
npm install -g nodemon
nodemon app.js

# PM2 - менеджер процессов для продакшена
npm install -g pm2
pm2 start app.js
pm2 list
pm2 restart app

# ESLint - проверка качества кода
npm install -g eslint
eslint --init
eslint app.js
```

### Создание простого HTTP сервера:

```javascript
// server.js
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Установка CORS заголовков
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (path === '/' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Hello, Node.js Server!' }));
  } else if (path === '/api/users' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Работа с файловой системой:

```javascript
const fs = require('fs').promises;

async function fileOperations() {
  try {
    // Чтение файла
    const data = await fs.readFile('input.txt', 'utf8');
    console.log('File content:', data);

    // Запись в файл
    await fs.writeFile('output.txt', 'Hello, Node.js!');
    console.log('File written successfully');

    // Проверка существования файла
    try {
      await fs.access('output.txt');
      console.log('File exists');
    } catch {
      console.log('File does not exist');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fileOperations();
```
