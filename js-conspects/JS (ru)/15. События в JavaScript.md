
### Что такое события?

**События** - это действия, которые происходят в браузере: клики мышью, нажатия клавиш, загрузка страницы, отправка форм и т.д.

### Зачем нужны события?

- Делают веб-страницы **интерактивными**
- Позволяют **реагировать** на действия пользователя
- Создают **динамический** пользовательский интерфейс

### Модель событий в браузере:

```
Событие происходит → Браузер создает объект Event → Вызываются обработчики
```

### Способы добавления обработчиков:

#### 1. HTML-атрибуты (не рекомендуется)

```html
<button onclick="alert('Клик!')">Кнопка</button>
```

#### 2. Свойства элемента (устаревший способ)

```javascript
button.onclick = function() {
  alert('Клик!');
};
```

#### 3. addEventListener (современный способ) ✅

```javascript
button.addEventListener('click', function() {
  alert('Клик!');
});

// Или стрелочная функция
button.addEventListener('click', () => {
  alert('Клик!');
});
```

---

## Form Events (События форм)

### Основные события форм

#### 1. `submit` - отправка формы

```javascript
const form = document.querySelector('#myForm');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Останавливаем стандартную отправку
  console.log('Форма отправлена!');
  
  // Получаем данные формы
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  console.log(data);
});
```

#### 2. `input` - изменение в реальном времени

```javascript
const textInput = document.querySelector('#text');

textInput.addEventListener('input', (e) => {
  console.log('Текущее значение:', e.target.value);
  // Обновляется при каждом изменении
});
```

#### 3. `change` - изменение с потерей фокуса

```javascript
const select = document.querySelector('#select');

select.addEventListener('change', (e) => {
  console.log('Выбрано:', e.target.value);
  // Срабатывает только после потери фокуса
});
```

#### 4. `focus` и `blur` - получение/потеря фокуса

```javascript
const input = document.querySelector('#email');

input.addEventListener('focus', () => {
  console.log('Поле получило фокус');
  input.style.borderColor = 'blue';
});

input.addEventListener('blur', () => {
  console.log('Поле потеряло фокус');
  input.style.borderColor = '';
});
```

### Пример из todo-приложения:

```javascript
// Полная обработка формы todo
todoForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Предотвращаем перезагрузку страницы
  
  const text = todoInput.value.trim(); // Получаем и очищаем текст
  
  if (text) {
    addTodoItem(text);        // Добавляем задачу
    todoInput.value = "";     // Очищаем поле
    todoInput.focus();        // Возвращаем фокус
    updateStats();            // Обновляем статистику
  } else {
    alert('Введите текст задачи!');
  }
});

// Валидация в реальном времени
todoInput.addEventListener('input', (e) => {
  const submitBtn = document.querySelector('#submit');
  submitBtn.disabled = e.target.value.trim().length === 0;
});
```

### Работа с различными типами полей:

#### Checkbox и Radio

```javascript
const checkbox = document.querySelector('#agree');
const radio = document.querySelectorAll('input[name="gender"]');

checkbox.addEventListener('change', (e) => {
  console.log('Согласие:', e.target.checked);
});

radio.forEach(input => {
  input.addEventListener('change', (e) => {
    if (e.target.checked) {
      console.log('Выбран пол:', e.target.value);
    }
  });
});
```

#### Select (выпадающий список)

```javascript
const select = document.querySelector('#country');

select.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  console.log('Выбрана страна:', selectedOption.text);
  console.log('Код страны:', selectedOption.value);
});
```

---

## Browser Default Actions (Стандартные действия браузера)

### Что такое стандартные действия?

Браузер имеет **встроенное поведение** для многих событий:

|Событие|Стандартное действие|
|---|---|
|`submit` формы|Отправка данных на сервер, перезагрузка страницы|
|`click` по ссылке|Переход по ссылке|
|`contextmenu` (правый клик)|Показ контекстного меню|
|`keydown` в input|Ввод символа|
|`mousedown` на тексте|Начало выделения|
|`wheel` (колесо мыши)|Прокрутка страницы|

### Отмена стандартных действий

#### Метод `preventDefault()`

```javascript
// Отмена отправки формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Форма не отправится на сервер');
});

// Отмена перехода по ссылке
link.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Переход не произойдет');
});

// Отмена контекстного меню
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  console.log('Контекстное меню не появится');
});
```

#### Возврат `false` (только для on-свойств)

```javascript
// Работает только так:
element.onclick = function(e) {
  // делаем что-то
  return false; // отменяет стандартное действие
};

// НЕ работает с addEventListener!
element.addEventListener('click', (e) => {
  return false; // НЕ отменит стандартное действие!
});
```

### Практические примеры:

#### 1. Кастомная валидация формы

```javascript
const form = document.querySelector('#registrationForm');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Останавливаем стандартную отправку
  
  const email = form.email.value;
  const password = form.password.value;
  
  // Кастомная валидация
  if (!email.includes('@')) {
    alert('Некорректный email');
    return;
  }
  
  if (password.length < 6) {
    alert('Пароль должен быть не менее 6 символов');
    return;
  }
  
  // Если все ОК, отправляем через JavaScript
  submitFormData({ email, password });
});
```

#### 2. Кастомные ссылки

```javascript
const links = document.querySelectorAll('.custom-link');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Отменяем стандартный переход
    
    const url = link.href;
    
    // Кастомная логика
    if (confirm(`Перейти на ${url}?`)) {
      window.location.href = url;
    }
  });
});
```

#### 3. Запрет на копирование текста

```javascript
document.addEventListener('selectstart', (e) => {
  e.preventDefault(); // Запрещаем выделение текста
});

document.addEventListener('copy', (e) => {
  e.preventDefault(); // Запрещаем копирование
  alert('Копирование запрещено!');
});
```

---

## Event Delegation (Делегирование событий)

### Проблема с множественными обработчиками

Представим список из 1000 элементов:

```html
<ul id="taskList">
  <li><button class="delete">Удалить</button> Задача 1</li>
  <li><button class="delete">Удалить</button> Задача 2</li>
  <!-- ... 998 элементов ... -->
</ul>
```

#### Плохой подход (без делегирования):

```javascript
// 1000 обработчиков = много памяти!
const deleteButtons = document.querySelectorAll('.delete');
deleteButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    deleteTask(index);
  });
});
```

#### Хороший подход (с делегированием):

```javascript
// Один обработчик для всех!
const taskList = document.querySelector('#taskList');

taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const taskItem = e.target.closest('li');
    const taskIndex = Array.from(taskList.children).indexOf(taskItem);
    deleteTask(taskIndex);
  }
});
```

### Как работает всплытие событий:

```
Клик по кнопке → Событие всплывает вверх:
<button> → <li> → <ul> → <body> → <html> → document
```

### Полный пример делегирования из todo:

```javascript
// Обработчик для всего списка задач
todoList.addEventListener('click', (e) => {
  const todoItem = e.target.closest('.todo-item');
  if (!todoItem) return; // Клик не по задаче
  
  const todoId = parseInt(todoItem.dataset.id);
  
  // Определяем, по какому элементу кликнули
  if (e.target.classList.contains('delete-btn')) {
    // Удаление задачи
    deleteTodoWithAnimation(todoId);
    
  } else if (e.target.classList.contains('todo-checkbox')) {
    // Изменение статуса
    toggleTodoWithAnimation(todoId);
    
  } else if (e.target.classList.contains('edit-btn')) {
    // Редактирование
    editTodo(todoId);
  }
});

// Также можно обрабатывать события клавиатуры
todoList.addEventListener('keydown', (e) => {
  if (e.key === 'Delete') {
    const focusedItem = document.activeElement.closest('.todo-item');
    if (focusedItem) {
      const todoId = parseInt(focusedItem.dataset.id);
      deleteTodoWithAnimation(todoId);
    }
  }
});
```

### Преимущества делегирования:

1. **Экономия памяти** - один обработчик вместо тысяч
2. **Работа с динамическими элементами** - новые элементы автоматически получают обработчики
3. **Упрощение кода** - вся логика в одном месте
4. **Лучшая производительность** - меньше привязок событий

### Методы для работы с делегированием:

#### `closest()` - поиск ближайшего предка

```javascript
// Ищем ближайший элемент с классом 'todo-item'
const todoItem = e.target.closest('.todo-item');

// Ищем ближайший элемент с data-атрибутом
const dataItem = e.target.closest('[data-id]');
```

#### `matches()` - проверка соответствия селектору

```javascript
container.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    // Клик по кнопке
  } else if (e.target.matches('.link')) {
    // Клик по ссылке
  }
});
```

---

## Всплытие и погружение событий

### Фазы обработки событий:

```
1. Погружение (capturing) - сверху вниз
   document → html → body → div → button
   
2. Целевая фаза (target) - на целевом элементе
   button
   
3. Всплытие (bubbling) - снизу вверх
   button → div → body → html → document
```

### Визуализация:

```html
<div id="outer">
  <div id="middle">
    <div id="inner">
      Кликни меня
    </div>
  </div>
</div>
```

```javascript
// По умолчанию обработчики срабатывают в фазе всплытия
document.getElementById('outer').addEventListener('click', () => {
  console.log('outer');
});

document.getElementById('middle').addEventListener('click', () => {
  console.log('middle');
});

document.getElementById('inner').addEventListener('click', () => {
  console.log('inner');
});

// При клике по inner выведется:
// inner
// middle  
// outer
```

### Фаза погружения:

```javascript
// Третий параметр true = обработка в фазе погружения
document.getElementById('outer').addEventListener('click', () => {
  console.log('outer (capturing)');
}, true);

document.getElementById('middle').addEventListener('click', () => {
  console.log('middle (capturing)');
}, true);

document.getElementById('inner').addEventListener('click', () => {
  console.log('inner (capturing)');
}, true);

// При клике по inner выведется:
// outer (capturing)
// middle (capturing)
// inner (capturing)
```

### Остановка всплытия:

#### `stopPropagation()` - остановить всплытие

```javascript
document.getElementById('inner').addEventListener('click', (e) => {
  console.log('inner');
  e.stopPropagation(); // Событие не пойдет дальше
});

// При клике выведется только:
// inner
```

#### `stopImmediatePropagation()` - остановить все обработчики

```javascript
button.addEventListener('click', (e) => {
  console.log('Первый обработчик');
  e.stopImmediatePropagation();
});

button.addEventListener('click', (e) => {
  console.log('Второй обработчик'); // НЕ выполнится
});
```

---

## Объект Event

### Основные свойства:

#### `target` vs `currentTarget`

```javascript
<div id="container">
  <button id="btn">Кнопка</button>
</div>

document.getElementById('container').addEventListener('click', (e) => {
  console.log('target:', e.target.id);        // btn (где произошел клик)
  console.log('currentTarget:', e.currentTarget.id); // container (где висит обработчик)
});
```

#### Информация о событии:

```javascript
document.addEventListener('click', (e) => {
  console.log('Тип события:', e.type);          // 'click'
  console.log('Время:', e.timeStamp);           // время в миллисекундах
  console.log('Координаты:', e.clientX, e.clientY); // позиция мыши
  console.log('Какая кнопка:', e.button);       // 0-левая, 1-средняя, 2-правая
  console.log('Модификаторы:', {
    ctrl: e.ctrlKey,
    shift: e.shiftKey,
    alt: e.altKey,
    meta: e.metaKey  // Cmd на Mac, Win на Windows
  });
});
```

#### События клавиатуры:

```javascript
document.addEventListener('keydown', (e) => {
  console.log('Код клавиши:', e.code);     // 'KeyA', 'Space', 'Enter'
  console.log('Символ:', e.key);           // 'a', ' ', 'Enter'
  console.log('Устаревший код:', e.keyCode); // 65, 32, 13
  
  // Проверка специальных клавиш
  if (e.key === 'Enter') {
    console.log('Нажат Enter');
  }
  
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    console.log('Ctrl+S - сохранение');
  }
});
```

### Создание собственных событий:

#### CustomEvent

```javascript
// Создаем событие
const customEvent = new CustomEvent('todoAdded', {
  detail: {
    todoId: 123,
    todoText: 'Новая задача'
  }
});

// Отправляем событие
document.dispatchEvent(customEvent);

// Слушаем событие
document.addEventListener('todoAdded', (e) => {
  console.log('Добавлена задача:', e.detail);
});
```

#### Практический пример:

```javascript
// В функции добавления todo
function addTodoItem(text) {
  const todo = {
    id: nextId++,
    text: text,
    completed: false,
  };
  todos.push(todo);
  
  // Отправляем кастомное событие
  document.dispatchEvent(new CustomEvent('todoChanged', {
    detail: { action: 'add', todo }
  }));
  
  renderAllTodos();
}

// Слушатель для аналитики
document.addEventListener('todoChanged', (e) => {
  console.log('Статистика:', e.detail);
  // Отправить данные в аналитику
});
```

---

## Типы событий

### События мыши:

#### Основные события:

```javascript
element.addEventListener('click', handler);       // Клик
element.addEventListener('dblclick', handler);    // Двойной клик
element.addEventListener('mousedown', handler);   // Нажатие кнопки мыши
element.addEventListener('mouseup', handler);     // Отпускание кнопки мыши
element.addEventListener('mousemove', handler);   // Движение мыши
element.addEventListener('mouseover', handler);   // Мышь входит в элемент
element.addEventListener('mouseout', handler);    // Мышь покидает элемент
element.addEventListener('mouseenter', handler);  // Мышь входит (не всплывает)
element.addEventListener('mouseleave', handler);  // Мышь покидает (не всплывает)
```

#### Пример интерактивной карточки:

```javascript
const card = document.querySelector('.card');

card.addEventListener('mouseenter', () => {
  card.style.transform = 'scale(1.05)';
  card.style.transition = 'transform 0.3s';
});

card.addEventListener('mouseleave', () => {
  card.style.transform = 'scale(1)';
});

card.addEventListener('mousedown', (e) => {
  card.style.transform = 'scale(0.95)';
});

card.addEventListener('mouseup', (e) => {
  card.style.transform = 'scale(1.05)';
});
```

### События клавиатуры:

```javascript
// Порядок событий: keydown → keypress → keyup
document.addEventListener('keydown', (e) => {
  console.log('Клавиша нажата:', e.key);
});

document.addEventListener('keyup', (e) => {
  console.log('Клавиша отпущена:', e.key);
});

// Горячие клавиши
document.addEventListener('keydown', (e) => {
  // Ctrl+S
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    saveData();
  }
  
  // Escape
  if (e.key === 'Escape') {
    closeModal();
  }
  
  // Enter в форме
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
    submitForm();
  }
});
```

### События формы (подробнее):

```javascript
const form = document.querySelector('#myForm');
const input = document.querySelector('#myInput');

// События формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Форма отправлена');
});

form.addEventListener('reset', (e) => {
  console.log('Форма сброшена');
});

// События полей ввода
input.addEventListener('input', (e) => {
  console.log('Ввод изменен:', e.target.value);
});

input.addEventListener('change', (e) => {
  console.log('Значение изменено:', e.target.value);
});

input.addEventListener('focus', (e) => {
  console.log('Поле получило фокус');
});

input.addEventListener('blur', (e) => {
  console.log('Поле потеряло фокус');
});
```

### События окна и документа:

```javascript
// Загрузка страницы
window.addEventListener('load', () => {
  console.log('Страница полностью загружена');
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM построен');
});

// Изменение размера окна
window.addEventListener('resize', () => {
  console.log('Размер окна изменен');
});

// Прокрутка
window.addEventListener('scroll', () => {
  console.log('Страница прокручена');
});

// Закрытие страницы
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  e.returnValue = ''; // Показать диалог подтверждения
});
```

---

## Практические примеры

### 1. Интерактивная галерея изображений

```javascript
const gallery = document.querySelector('.gallery');
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal img');

// Делегирование для открытия изображений
gallery.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    modal.style.display = 'block';
    modalImg.src = e.target.src;
  }
});

// Закрытие модального окна
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
  }
});
```

### 2. Drag & Drop для todo-списка

```javascript
let draggedElement = null;

// Начало перетаскивания
todoList.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('todo-item')) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
  }
});

// Окончание перетаскивания
todoList.addEventListener('dragend', (e) => {
  if (e.target.classList.contains('todo-item')) {
    e.target.style.opacity = '';
    draggedElement = null;
  }
});

// Разрешение сброса
todoList.addEventListener('dragover', (e) => {
  e.preventDefault();
});

// Сброс элемента
todoList.addEventListener('drop', (e) => {
  e.preventDefault();
  
  const target = e.target.closest('.todo-item');
  if (target && target !== draggedElement) {
    const rect = target.getBoundingClientRect();
    const insertBefore = e.clientY < (rect.top + rect.height / 2);
    
    if (insertBefore) {
      todoList.insertBefore(draggedElement, target);
    } else {
      todoList.insertBefore(draggedElement, target.nextSibling);
    }
    
    updateTodoOrder();
  }
});
```

### 3. Умный поиск с задержкой

```javascript
const searchInput = document.querySelector('#search');
const searchResults = document.querySelector('#results');
let searchTimeout;

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  
  // Очищаем предыдущий таймер
  clearTimeout(searchTimeout);
  
  if (query.length < 2) {
    searchResults.innerHTML = '';
    return;
  }
  
  // Устанавливаем новый таймер
  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, 300); // Поиск через 300мс после последнего ввода
});

function performSearch(query) {
  // Имитация поиска
  const results = todos.filter(todo => 
    todo.text.toLowerCase().includes(query.toLowerCase())
  );
  
  displaySearchResults(results);
}
```

### 4. Система горячих клавиш

```javascript
const shortcuts = {
  'ctrl+n': () => showNewTodoForm(),
  'ctrl+s': () => saveTodos(),
  'ctrl+z': () => undoLastAction(),
  'escape': () => closeAllModals(),
  'delete': () => deleteSelectedTodos(),
  'ctrl+a': () => selectAllTodos()
};

document.addEventListener('keydown', (e) => {
  let shortcut = '';
  
  if (e.ctrlKey) shortcut += 'ctrl+';
  if (e.shiftKey) shortcut += 'shift+';
  if (e.altKey) shortcut += 'alt+';
  
  shortcut += e.key.toLowerCase();
  
  if (shortcuts[shortcut]) {
    e.preventDefault();
    shortcuts[shortcut]();
  }
});
```

### 5. Автосохранение данных

```javascript
let saveTimeout;
const AUTOSAVE_DELAY = 2000; // 2 секунды

function scheduleAutosave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveTodosToLocalStorage();
    showNotification('Данные сохранены автоматически');
  }, AUTOSAVE_DELAY);
}

// Автосохранение при любых изменениях
document.addEventListener('todoChanged', scheduleAutosave);
document.addEventListener('todoDeleted', scheduleAutosave);
document.addEventListener('todoToggled', scheduleAutosave);

// Сохранение при закрытии страницы
window.addEventListener('beforeunload', () => {
  saveTodosToLocalStorage();
});
```

---

## Лучшие практики

### 1. Управление обработчиками событий

#### Удаление обработчиков:

```javascript
function handleClick() {
  console.log('Клик!');
}

// Добавляем
button.addEventListener('click', handleClick);

// Удаляем (функция должна быть той же самой!)
button.removeEventListener('click', handleClick);

// Не сработает - разные функции:
button.addEventListener('click', () => console.log('Клик!'));
button.removeEventListener('click', () => console.log('Клик!')); // ❌
```

#### Одноразовые обработчики:

```javascript
// Сработает только один раз
button.addEventListener('click', handler, { once: true });

// Или вручную:
function handleClickOnce(e) {
  console.log('Однократный клик');
  button.removeEventListener('click', handleClickOnce);
}
button.addEventListener('click', handleClickOnce);
```

### 2. Оптимизация производительности

#### Throttling (ограничение частоты):

```javascript
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    }
  };
}

// Ограничиваем scroll до 60fps
window.addEventListener('scroll', throttle(() => {
  updateScrollIndicator();
}, 16)); // ~60fps
```

#### Debouncing (задержка выполнения):

```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Поиск только после паузы в вводе
searchInput.addEventListener('input', debounce((e) => {
  performSearch(e.target.value);
}, 300));
```

### 3. Обработка ошибок

```javascript
function safeEventHandler(handler) {
  return function(e) {
    try {
      handler(e);
    } catch (error) {
      console.error('Ошибка в обработчике события:', error);
      // Отправка в систему мониторинга
      reportError(error);
    }
  };
}

// Использование:
button.addEventListener('click', safeEventHandler((e) => {
  // Код, который может упасть
  riskyFunction();
}));
```

### 4. Работа с современными возможностями

#### Passive слушатели (для touch событий):

```javascript
// Для улучшения производительности прокрутки
document.addEventListener('touchstart', handler, { passive: true });
document.addEventListener('wheel', handler, { passive: true });

// Или с дополнительными опциями
element.addEventListener('scroll', handler, {
  passive: true,    // Не будет вызывать preventDefault()
  capture: false,   // Фаза всплытия
  once: false      // Может сработать много раз
});
```

#### AbortController для отмены обработчиков:

```javascript
const controller = new AbortController();

// Добавляем обработчики с возможностью отмены
button.addEventListener('click', handler, {
  signal: controller.signal
});

document.addEventListener('keydown', anotherHandler, {
  signal: controller.signal
});

// Отменяем все обработчики одной командой
controller.abort();
```

### 5. Доступность (Accessibility)

#### Поддержка клавиатурной навигации:

```javascript
// Делаем div интерактивным для клавиатуры
const customButton = document.querySelector('.custom-button');
customButton.setAttribute('tabindex', '0');
customButton.setAttribute('role', 'button');

customButton.addEventListener('keydown', (e) => {
  // Enter или Space активируют кнопку
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    customButton.click();
  }
});

// Визуальный фокус
customButton.addEventListener('focus', () => {
  customButton.classList.add('focused');
});

customButton.addEventListener('blur', () => {
  customButton.classList.remove('focused');
});
```

#### Поддержка screen readers:

```javascript
function updateTaskStatus(taskId, completed) {
  const task = todos.find(t => t.id === taskId);
  task.completed = completed;
  
  // Обновляем ARIA-атрибуты
  const taskElement = document.querySelector(`[data-id="${taskId}"]`);
  taskElement.setAttribute('aria-checked', completed);
  
  // Уведомляем screen reader
  const announcement = completed ? 
    'Задача выполнена' : 'Задача не выполнена';
  announceToScreenReader(announcement);
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Скрыто визуально
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
```

### 6. Отладка событий

#### Мониторинг всех событий:

```javascript
// Для отладки - логируем все события
function logAllEvents(element) {
  const events = [
    'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
    'keydown', 'keyup', 'focus', 'blur', 'change', 'input', 'submit'
  ];
  
  events.forEach(eventType => {
    element.addEventListener(eventType, (e) => {
      console.log(`Событие: ${eventType}`, {
        target: e.target,
        currentTarget: e.currentTarget,
        timeStamp: e.timeStamp
      });
    });
  });
}

// Использование:
logAllEvents(document.querySelector('#debugElement'));
```

#### Инструменты разработчика:

```javascript
// Проверка привязанных обработчиков
function getEventListeners(element) {
  // В DevTools Console:
  // getEventListeners($0) - для выбранного элемента
  return getEventListeners(element);
}

// Эмуляция событий для тестирования
function simulateClick(element) {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  element.dispatchEvent(event);
}
```

---

## Продвинутые техники

### 1. Создание компонентной системы

```javascript
class TodoComponent {
  constructor(container) {
    this.container = container;
    this.todos = [];
    this.init();
  }
  
  init() {
    this.render();
    this.attachEvents();
  }
  
  attachEvents() {
    // Используем стрелочные функции для сохранения контекста
    this.container.addEventListener('click', (e) => this.handleClick(e));
    this.container.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.container.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  handleClick(e) {
    const action = e.target.dataset.action;
    const todoId = this.getTodoId(e.target);
    
    switch(action) {
      case 'delete':
        this.deleteTodo(todoId);
        break;
      case 'toggle':
        this.toggleTodo(todoId);
        break;
      case 'edit':
        this.editTodo(todoId);
        break;
    }
  }
  
  handleKeydown(e) {
    if (e.key === 'Enter' && e.target.classList.contains('todo-input')) {
      this.addTodo(e.target.value);
    }
  }
  
  // Кастомные события для связи между компонентами
  emit(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    this.container.dispatchEvent(event);
  }
  
  addTodo(text) {
    const todo = { id: Date.now(), text, completed: false };
    this.todos.push(todo);
    this.render();
    this.emit('todo:added', todo);
  }
}

// Использование:
const todoApp = new TodoComponent(document.querySelector('#todo-app'));

// Слушаем кастомные события
document.addEventListener('todo:added', (e) => {
  console.log('Добавлена задача:', e.detail);
  updateStatistics();
});
```

### 2. Система middleware для событий

```javascript
class EventMiddleware {
  constructor() {
    this.middlewares = [];
  }
  
  use(middleware) {
    this.middlewares.push(middleware);
  }
  
  handle(event, element) {
    let index = 0;
    
    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        middleware(event, element, next);
      }
    };
    
    next();
  }
}

// Создаем систему middleware
const eventSystem = new EventMiddleware();

// Middleware для логирования
eventSystem.use((event, element, next) => {
  console.log(`Событие ${event.type} на`, element);
  next();
});

// Middleware для проверки прав
eventSystem.use((event, element, next) => {
  if (element.dataset.protected && !userHasPermission()) {
    event.preventDefault();
    alert('Нет прав доступа');
    return;
  }
  next();
});

// Middleware для аналитики
eventSystem.use((event, element, next) => {
  analytics.track(event.type, {
    element: element.tagName,
    timestamp: Date.now()
  });
  next();
});

// Применяем middleware ко всем кликам
document.addEventListener('click', (e) => {
  eventSystem.handle(e, e.target);
});
```

### 3. Реактивная система событий

```javascript
class ReactiveEventSystem {
  constructor() {
    this.subscribers = new Map();
  }
  
  // Подписка на события
  on(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push(callback);
    
    // Возвращаем функцию отписки
    return () => {
      const callbacks = this.subscribers.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  // Эмиссия событий
  emit(eventType, data) {
    const callbacks = this.subscribers.get(eventType) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Ошибка в обработчике:', error);
      }
    });
  }
  
  // Подписка с автоматической отпиской
  once(eventType, callback) {
    const unsubscribe = this.on(eventType, (data) => {
      callback(data);
      unsubscribe();
    });
    return unsubscribe;
  }
}

// Глобальная шина событий
const eventBus = new ReactiveEventSystem();

// Использование:
const unsubscribe = eventBus.on('user:login', (user) => {
  console.log('Пользователь вошел:', user);
  updateUI(user);
});

// В другой части приложения
eventBus.emit('user:login', { name: 'John', id: 123 });

// Отписка когда не нужно
unsubscribe();
```

---

## Паттерны проектирования с событиями

### 1. Observer (Наблюдатель)

```javascript
class TodoModel {
  constructor() {
    this.todos = [];
    this.observers = [];
  }
  
  // Подписка на изменения
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  // Отписка
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  // Уведомление всех наблюдателей
  notify(event, data) {
    this.observers.forEach(observer => {
      if (typeof observer[event] === 'function') {
        observer[event](data);
      }
    });
  }
  
  addTodo(text) {
    const todo = { id: Date.now(), text, completed: false };
    this.todos.push(todo);
    this.notify('todoAdded', todo);
  }
  
  deleteTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index > -1) {
      const todo = this.todos.splice(index, 1)[0];
      this.notify('todoDeleted', todo);
    }
  }
}

// Наблюдатели
class TodoView {
  todoAdded(todo) {
    console.log('Представление: добавлена задача', todo);
    this.renderTodo(todo);
  }
  
  todoDeleted(todo) {
    console.log('Представление: удалена задача', todo);
    this.removeTodoElement(todo.id);
  }
}

class TodoStats {
  constructor() {
    this.totalTodos = 0;
  }
  
  todoAdded(todo) {
    this.totalTodos++;
    this.updateDisplay();
  }
  
  todoDeleted(todo) {
    this.totalTodos--;
    this.updateDisplay();
  }
  
  updateDisplay() {
    document.querySelector('#stats').textContent = `Всего: ${this.totalTodos}`;
  }
}

// Использование:
const model = new TodoModel();
const view = new TodoView();
const stats = new TodoStats();

model.subscribe(view);
model.subscribe(stats);
```

### 2. Command (Команда)

```javascript
// Система команд с отменой действий
class TodoCommand {
  execute() {
    throw new Error('Метод execute должен быть реализован');
  }
  
  undo() {
    throw new Error('Метод undo должен быть реализован');
  }
}

class AddTodoCommand extends TodoCommand {
  constructor(todoList, text) {
    super();
    this.todoList = todoList;
    this.text = text;
    this.addedTodo = null;
  }
  
  execute() {
    this.addedTodo = this.todoList.addTodo(this.text);
  }
  
  undo() {
    if (this.addedTodo) {
      this.todoList.deleteTodo(this.addedTodo.id);
    }
  }
}

class DeleteTodoCommand extends TodoCommand {
  constructor(todoList, todoId) {
    super();
    this.todoList = todoList;
    this.todoId = todoId;
    this.deletedTodo = null;
  }
  
  execute() {
    this.deletedTodo = this.todoList.getTodo(this.todoId);
    this.todoList.deleteTodo(this.todoId);
  }
  
  undo() {
    if (this.deletedTodo) {
      this.todoList.addTodoWithId(this.deletedTodo);
    }
  }
}

// Менеджер команд
class CommandManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }
  
  execute(command) {
    // Удаляем команды после текущей позиции
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }
  
  undo() {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex];
      command.undo();
      this.currentIndex--;
    }
  }
  
  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
    }
  }
}

// Использование:
const commandManager = new CommandManager();

// Обработчики событий с командами
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault();
    commandManager.undo();
  }
  
  if (e.ctrlKey && e.key === 'y') {
    e.preventDefault();
    commandManager.redo();
  }
});

// Добавление задачи через команду
function addTodoWithUndo(text) {
  const command = new AddTodoCommand(todoList, text);
  commandManager.execute(command);
}
```

---

## Тестирование событий

### 1. Эмуляция событий для тестов

```javascript
// Утилиты для тестирования
class EventTestUtils {
  static fireEvent(element, eventType, options = {}) {
    const event = new Event(eventType, {
      bubbles: options.bubbles !== false,
      cancelable: options.cancelable !== false,
      ...options
    });
    
    // Добавляем дополнительные свойства
    Object.assign(event, options);
    
    element.dispatchEvent(event);
    return event;
  }
  
  static fireMouseEvent(element, eventType, options = {}) {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: options.x || 0,
      clientY: options.y || 0,
      button: options.button || 0,
      ...options
    });
    
    element.dispatchEvent(event);
    return event;
  }
  
  static fireKeyboardEvent(element, eventType, options = {}) {
    const event = new KeyboardEvent(eventType, {
      bubbles: true,
      cancelable: true,
      key: options.key || '',
      code: options.code || '',
      ctrlKey: options.ctrlKey || false,
      shiftKey: options.shiftKey || false,
      altKey: options.altKey || false,
      ...options
    });
    
    element.dispatchEvent(event);
    return event;
  }
}

// Примеры тестов
describe('Todo App Events', () => {
  let todoApp, addButton, todoInput;
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="todo-app">
        <input id="todo-input" type="text">
        <button id="add-btn">Добавить</button>
        <ul id="todo-list"></ul>
      </div>
    `;
    
    todoApp = new TodoApp(document.getElementById('todo-app'));
    addButton = document.getElementById('add-btn');
    todoInput = document.getElementById('todo-input');
  });
  
  test('Добавление задачи по клику', () => {
    todoInput.value = 'Тестовая задача';
    
    EventTestUtils.fireMouseEvent(addButton, 'click');
    
    const todoItems = document.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(1);
    expect(todoItems[0].textContent).toContain('Тестовая задача');
  });
  
  test('Добавление задачи по Enter', () => {
    todoInput.value = 'Задача через Enter';
    
    EventTestUtils.fireKeyboardEvent(todoInput, 'keydown', {
      key: 'Enter'
    });
    
    const todoItems = document.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(1);
  });
  
  test('Удаление задачи', () => {
    // Добавляем задачу
    todoApp.addTodo('Задача для удаления');
    
    const deleteButton = document.querySelector('.delete-btn');
    EventTestUtils.fireMouseEvent(deleteButton, 'click');
    
    const todoItems = document.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(0);
  });
});
```

### 2. Моки и шпионы для событий

```javascript
// Создание моков для обработчиков
class EventMock {
  constructor() {
    this.calls = [];
  }
  
  handler = (e) => {
    this.calls.push({
      event: e,
      timestamp: Date.now(),
      target: e.target
    });
  }
  
  wasCalled() {
    return this.calls.length > 0;
  }
  
  wasCalledWith(expectedEvent) {
    return this.calls.some(call => 
      call.event.type === expectedEvent.type &&
      call.target === expectedEvent.target
    );
  }
  
  getCallCount() {
    return this.calls.length;
  }
  
  reset() {
    this.calls = [];
  }
}

// Использование в тестах
test('Обработчик вызывается при клике', () => {
  const mockHandler = new EventMock();
  const button = document.createElement('button');
  
  button.addEventListener('click', mockHandler.handler);
  
  // Эмулируем клик
  EventTestUtils.fireMouseEvent(button, 'click');
  
  expect(mockHandler.wasCalled()).toBe(true);
  expect(mockHandler.getCallCount()).toBe(1);
});
```

---

## Заключение

События в JavaScript - это мощный механизм для создания интерактивных веб-приложений. Основные принципы:

### Ключевые концепции:

1. **События** - способ реагировать на действия пользователя
2. **Form Events** - обработка форм и пользовательского ввода
3. **Default Actions** - контроль стандартного поведения браузера
4. **Event Delegation** - эффективная обработка множественных элементов
5. **Bubbling/Capturing** - механизм распространения событий

### Лучшие практики:

- Используйте `addEventListener` вместо on-свойств
- Применяйте делегирование для динамических списков
- Отменяйте стандартные действия через `preventDefault()`
- Оптимизируйте производительность с throttling/debouncing
- Не забывайте про доступность и поддержку клавиатуры
- Тестируйте обработчики событий

### Современные возможности:

- `AbortController` для управления обработчиками
- `CustomEvent` для создания собственных событий
- Passive listeners для улучшения производительности
- Реактивные системы и паттерны проектирования

Понимание событий критически важно для создания качественных веб-приложений. Начните с простых примеров и постепенно изучайте более сложные техники.