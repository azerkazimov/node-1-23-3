# DOM в JavaScript - Полный конспект

## Что такое DOM?

**DOM (Document Object Model)** — это программный интерфейс для HTML и XML документов. Он представляет структуру документа в виде дерева объектов, которые можно изменять с помощью JavaScript.

### Ключевые особенности:

- DOM представляет документ как дерево узлов
- Каждый HTML-элемент является объектом
- JavaScript может изменять содержимое, структуру и стили страницы
- DOM не является частью JavaScript, это веб-API

---

## Структура DOM

![[dom.png]]
### Типы узлов:

- **Element Node** (узел элемента) - HTML-теги
- **Text Node** (текстовый узел) - текст внутри элементов
- **Comment Node** (узел комментария) - HTML-комментарии
- **Document Node** (узел документа) - корень дерева DOM

### Иерархия:

```
Document
└── html
    ├── head
    │   ├── title
    │   └── meta
    └── body
        ├── div
        └── p
```

---

## Выбор элементов

### Основные методы выбора:

#### По ID:

```javascript
const element = document.getElementById('myId');
```

#### По классу:

```javascript
const elements = document.getElementsByClassName('myClass');
const element = document.querySelector('.myClass');
const allElements = document.querySelectorAll('.myClass');
```

#### По тегу:

```javascript
const elements = document.getElementsByTagName('div');
const element = document.querySelector('div');
```

#### Универсальные селекторы:

```javascript
// Первый элемент, соответствующий селектору
const element = document.querySelector('selector');

// Все элементы, соответствующие селектору
const elements = document.querySelectorAll('selector');

// Примеры селекторов:
document.querySelector('#id');           // по ID
document.querySelector('.class');        // по классу
document.querySelector('tag');           // по тегу
document.querySelector('[attr="value"]'); // по атрибуту
document.querySelector('div > p');       // вложенные элементы
```

---

## Свойства и методы элементов

### Основные свойства:

#### Содержимое:

```javascript
element.innerHTML = `<p>HTML содержимое ${content}</p>`;
element.textContent = 'Только текст';
element.innerText = 'Видимый текст';
```

#### Атрибуты:

```javascript
element.getAttribute('href');
element.setAttribute('href', 'https://example.com');
element.removeAttribute('href');
element.hasAttribute('href');

// Прямое обращение к стандартным атрибутам:
element.id = 'newId';
element.className = 'newClass';
element.src = 'image.jpg';
```

#### Классы:

```javascript
element.classList.add('newClass');
element.classList.remove('oldClass');
element.classList.toggle('activeClass');
element.classList.contains('someClass');
element.classList.replace('oldClass', 'newClass');
```

#### Размеры и позиция:

```javascript
element.offsetWidth;    // ширина с границами
element.offsetHeight;   // высота с границами
element.clientWidth;    // ширина без границ
element.clientHeight;   // высота без границ
element.scrollWidth;    // полная ширина содержимого
element.scrollHeight;   // полная высота содержимого

element.offsetTop;      // позиция сверху
element.offsetLeft;     // позиция слева
element.scrollTop;      // прокрутка сверху
element.scrollLeft;     // прокрутка слева
```

---

## Создание и изменение элементов

### Создание элементов:

```javascript
// Создание нового элемента
const newDiv = document.createElement('div');
const newText = document.createTextNode('Привет, мир!');

// Настройка элемента
newDiv.id = 'myDiv';
newDiv.className = 'container';
newDiv.innerHTML = `<p>Привет ${name}</p>`;
```

### Добавление элементов:

```javascript
// Добавление в конец
parent.appendChild(newElement);

// Вставка перед элементом
parent.insertBefore(newElement, existingElement);

// Современные методы:
parent.prepend(newElement);        // в начало
parent.append(newElement);         // в конец
element.before(newElement);        // перед элементом
element.after(newElement);         // после элемента
```

### Удаление элементов:

```javascript
// Старый способ
parent.removeChild(element);

// Современный способ
element.remove();
```

### Замена элементов:

```javascript
// Старый способ
parent.replaceChild(newElement, oldElement);

// Современный способ
oldElement.replaceWith(newElement);
```

### Клонирование:

```javascript
const clone = element.cloneNode(false); // поверхностное копирование
const deepClone = element.cloneNode(true); // глубокое копирование
```

---

## Обработка событий

### Добавление обработчиков:

```javascript
// Метод addEventListener (рекомендуется)
element.addEventListener('click', function(event) {
    console.log('Элемент был нажат!');
});

// Стрелочная функция
element.addEventListener('click', (event) => {
    console.log('Клик!', event);
});

// Свойство элемента
element.onclick = function(event) {
    console.log('Клик через свойство');
};
```

### Удаление обработчиков:

```javascript
function handleClick(event) {
    console.log('Клик!');
    if(){}
    return
}

element.addEventListener('click', handleClick);
element.removeEventListener('click', handleClick);
```

### Объект события (Event):

```javascript
element.addEventListener('click', function(event) {
    event.preventDefault();    // отменить действие по умолчанию
    event.stopPropagation();   // остановить всплытие
    
    console.log(event.target);      // элемент, на котором произошло событие
    console.log(event.currentTarget); // элемент, к которому привязан обработчик
    console.log(event.type);        // тип события
    console.log(event.clientX);     // координата X курсора
    console.log(event.clientY);     // координата Y курсора
});
```

### Основные типы событий:

#### События мыши:

```javascript
element.addEventListener('click', handler);
element.addEventListener('dblclick', handler);
element.addEventListener('mousedown', handler);
element.addEventListener('mouseup', handler);
element.addEventListener('mouseover', handler);
element.addEventListener('mouseout', handler);
element.addEventListener('mouseenter', handler);
element.addEventListener('mouseleave', handler);
element.addEventListener('mousemove', handler);
```

#### События клавиатуры:

```javascript
element.addEventListener('keydown', handler);
element.addEventListener('keyup', handler);
element.addEventListener('keypress', handler); // устарел
```

#### События формы:

```javascript
form.addEventListener('submit', handler);
input.addEventListener('input', handler);
input.addEventListener('change', handler);
input.addEventListener('focus', handler);
input.addEventListener('blur', handler);
```

#### События загрузки:

```javascript
window.addEventListener('load', handler);
window.addEventListener('DOMContentLoaded', handler);
window.addEventListener('beforeunload', handler);
```

---

## Навигация по DOM

### Родительские элементы:

```javascript
element.parentNode;        // родительский узел
element.parentElement;     // родительский элемент
element.closest('selector'); // ближайший родитель по селектору
```

### Дочерние элементы:

```javascript
element.childNodes;        // все дочерние узлы (включая текстовые)
element.children;          // только дочерние элементы
element.firstChild;        // первый дочерний узел
element.firstElementChild; // первый дочерний элемент
element.lastChild;         // последний дочерний узел
element.lastElementChild;  // последний дочерний элемент
```

### Соседние элементы:

```javascript
element.nextSibling;           // следующий узел
element.nextElementSibling;    // следующий элемент
element.previousSibling;       // предыдущий узел
element.previousElementSibling; // предыдущий элемент
```

---

## Стилизация через JavaScript

### Прямое изменение стилей:

```javascript
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.fontSize = '16px';
element.style.display = 'none';

// Множественные стили
Object.assign(element.style, {
    color: 'red',
    backgroundColor: 'blue',
    fontSize: '16px'
});
```

### Получение вычисленных стилей:

```javascript
const styles = getComputedStyle(element);
console.log(styles.color);
console.log(styles.fontSize);
```

### Работа с CSS-классами:

```javascript
element.className = 'class1 class2 class3';
element.classList.add('newClass');
element.classList.remove('oldClass');
element.classList.toggle('activeClass');
```

---

## Работа с формами

### Доступ к элементам формы:

```javascript
const form = document.forms['myForm'];
const input = form.elements['inputName'];

// Или через селекторы
const form = document.querySelector('#myForm');
const input = document.querySelector('#myInput');
```

### Получение и установка значений:

```javascript
// Текстовые поля
input.value = 'новое значение';
console.log(input.value);

// Чекбоксы и радиокнопки
checkbox.checked = true;
console.log(checkbox.checked);

// Выпадающие списки
select.value = 'option2';
console.log(select.selectedIndex);
console.log(select.options[select.selectedIndex].text);
```

### Валидация форм:

```javascript
form.addEventListener('submit', function(event) {
    if (!input.value.trim()) {
        event.preventDefault();
        alert('Поле не может быть пустым!');
    }
});

// HTML5 валидация
console.log(input.validity.valid);
console.log(input.validationMessage);
```

---

## Современные методы DOM

### Intersection Observer:

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Элемент виден!');
        }
    });
});

observer.observe(element);
```

### Mutation Observer:

```javascript
const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        console.log('DOM изменился:', mutation);
    });
});

observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: true
});
```

### ResizeObserver:

```javascript
const observer = new ResizeObserver((entries) => {
    entries.forEach(entry => {
        console.log('Размер изменился:', entry.contentRect);
    });
});

observer.observe(element);
```

---

## Производительность

### Оптимизация DOM-операций:

#### Минимизация reflow и repaint:

```javascript
// Плохо - множественные изменения
element.style.left = '10px';
element.style.top = '10px';
element.style.width = '100px';

// Хорошо - одно изменение
element.style.cssText = 'left: 10px; top: 10px; width: 100px;';

// Или через класс
element.className = 'positioned';
```

#### DocumentFragment для множественных вставок:

```javascript
const fragment = document.createDocumentFragment();

for (let i = 0; i < 10000; i++) {
    const div = document.createElement('div');
    div.textContent = `Элемент ${i}`;
    fragment.appendChild(div);
}

container.appendChild(fragment); // одна операция вместо 1000
```

#### Кеширование элементов:

```javascript
// Плохо
for (let i = 0; i < 1000; i++) {
    document.getElementById('myElement').innerHTML += 'текст';
}

// Хорошо
const element = document.getElementById('myElement');
let html = '';
for (let i = 0; i < 1000; i++) {
    html += 'текст';
}
element.innerHTML = html;
```

---

## Практические примеры

### Пример 1: Динамический список задач

```javascript
class TodoList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tasks = [];
        this.init();
    }
    
    init() {
        this.createForm();
        this.createTaskList();
    }
    
    createForm() {
        const form = document.createElement('form');
        const input = document.createElement('input');
        const button = document.createElement('button');
        
        input.type = 'text';
        input.placeholder = 'Введите задачу...';
        button.textContent = 'Добавить';
        
        form.appendChild(input);
        form.appendChild(button);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask(input.value);
            input.value = '';
        });
        
        this.container.appendChild(form);
    }
    
    createTaskList() {
        this.taskList = document.createElement('ul');
        this.container.appendChild(this.taskList);
    }
    
    addTask(text) {
        if (!text.trim()) return;
        
        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };
        
        this.tasks.push(task);
        this.renderTask(task);
    }
    
    renderTask(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        
        const span = document.createElement('span');
        span.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            li.classList.toggle('completed', task.completed);
        });
        
        deleteBtn.addEventListener('click', () => {
            this.deleteTask(task.id);
        });
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        this.taskList.appendChild(li);
    }
    
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        const li = this.taskList.querySelector(`[data-id="${id}"]`);
        li.remove();
    }
}

// Использование
const todoList = new TodoList('todo-container');
```

### Пример 2: Модальное окно

```javascript
class Modal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
    }
    
    create() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => this.close());
        
        const content = document.createElement('div');
        content.className = 'modal-content';
        
        modal.appendChild(closeBtn);
        modal.appendChild(content);
        overlay.appendChild(modal);
        
        // Закрытие по клику на overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        this.modal = overlay;
        this.content = content;
        
        return this;
    }
    
    setContent(html) {
        if (this.content) {
            this.content.innerHTML = html;
        }
        return this;
    }
    
    open() {
        if (!this.modal) {
            this.create();
        }
        
        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        
        // Анимация появления
        setTimeout(() => {
            this.modal.classList.add('active');
        }, 10);
        
        return this;
    }
    
    close() {
        if (this.modal && this.isOpen) {
            this.modal.classList.remove('active');
            
            setTimeout(() => {
                if (this.modal && this.modal.parentNode) {
                    this.modal.parentNode.removeChild(this.modal);
                }
                document.body.style.overflow = '';
                this.isOpen = false;
            }, 300);
        }
        
        return this;
    }
}

// Использование
const modal = new Modal();
modal.setContent('<h2>Заголовок</h2><p>Содержимое модального окна</p>').open();
```

### Пример 3: Слайдер изображений

```javascript
class ImageSlider {
    constructor(containerId, images) {
        this.container = document.getElementById(containerId);
        this.images = images;
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        this.createSlider();
        this.createControls();
        this.createIndicators();
        this.showSlide(0);
    }
    
    createSlider() {
        this.slider = document.createElement('div');
        this.slider.className = 'slider';
        
        this.track = document.createElement('div');
        this.track.className = 'slider-track';
        
        this.images.forEach(src => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Slide image';
            
            slide.appendChild(img);
            this.track.appendChild(slide);
        });
        
        this.slider.appendChild(this.track);
        this.container.appendChild(this.slider);
    }
    
    createControls() {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-btn prev';
        prevBtn.innerHTML = '&#8249;';
        prevBtn.addEventListener('click', () => this.prevSlide());
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-btn next';
        nextBtn.innerHTML = '&#8250;';
        nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.slider.appendChild(prevBtn);
        this.slider.appendChild(nextBtn);
    }
    
    createIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'slider-indicators';
        
        this.images.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.showSlide(index));
            indicators.appendChild(indicator);
        });
        
        this.indicators = indicators.querySelectorAll('.indicator');
        this.container.appendChild(indicators);
    }
    
    showSlide(index) {
        this.currentIndex = index;
        
        const translateX = -index * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Обновление индикаторов
        this.indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showSlide(prevIndex);
    }
    
    // Автоматическое переключение
    startAutoplay(interval = 3000) {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, interval);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

// Использование
const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg'
];

const slider = new ImageSlider('slider-container', images);
slider.startAutoplay();
```

---

## Полезные советы и лучшие практики

### 1. Всегда проверяйте существование элементов:

```javascript
const element = document.getElementById('myElement');
if (element) {
    // безопасные операции с элементом
    element.innerHTML = 'новое содержимое';
}
```

### 2. Используйте делегирование событий:

```javascript
// Вместо привязки события к каждому элементу
document.querySelector('.container').addEventListener('click', function(e) {
    if (e.target.classList.contains('button')) {
        // обработка клика по кнопке
    }
});
```

### 3. Избегайте частых DOM-запросов:

```javascript
// Плохо
for (let i = 0; i < items.length; i++) {
    document.querySelector('.container').appendChild(items[i]);
}

// Хорошо
const container = document.querySelector('.container');
for (let i = 0; i < items.length; i++) {
    container.appendChild(items[i]);
}
```

### 4. Используйте современные методы:

```javascript
// Старый способ
const elements = document.querySelectorAll('.item');
for (let i = 0; i < elements.length; i++) {
    elements[i].classList.add('active');
}

// Современный способ
document.querySelectorAll('.item').forEach(el => {
    el.classList.add('active');
});
```

---
