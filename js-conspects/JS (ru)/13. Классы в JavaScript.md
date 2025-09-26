
---

## 🔹 Введение и основные понятия

### Что такое класс?

Класс — это шаблон для создания объектов. В нём определяются свойства (property) и поведение (методы) объектов.

### До ES6 и после

**ES5 (функция-конструктор):**

```javascript
function Avtomobil(marka, model, year) {
  this.marka = marka;
  this.model = model;
  this.year = year;
}

Avtomobil.prototype.drive = function() {
  console.log(this.marka + " " + this.model + " едет");
};

var car = new Avtomobil("BMW", "X5", 2020);
```

**ES6 (class):**

```javascript
class Avtomobil {
  constructor(marka, model, year) {
    this.marka = marka;
    this.model = model;
    this.year = year;
  }

  drive() {
    console.log(`${this.marka} ${this.model} едет`);
  }
}

const car = new Avtomobil("BMW", "X5", 2020);
```

---

## 🔹 Синтаксис ES6 Classes

### Основная структура

```javascript
class ИмяКласса {
  // Constructor — вызывается при создании объекта
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  // Методы экземпляра
  методИмя() {
    // код метода
  }

  // Геттер
  get свойство() {
    return this._privateProp;
  }

  // Сеттер
  set свойство(value) {
    this._privateProp = value;
  }

  // Статический метод
  static staticMethod() {
    // код статического метода
  }
}
```

### Пример: Класс «Студент»

```javascript
class Student {
  constructor(name, surname, age, faculty) {
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.faculty = faculty;
    this.grades = [];
    this.registeredAt = new Date();
  }

  fullName() {
    return `${this.name} ${this.surname}`;
  }

  addGrade(subject, grade) {
    this.grades.push({ subject, grade, date: new Date() });
  }

  calcAverage() {
    if (this.grades.length === 0) return 0;
    const sum = this.grades.reduce((s, item) => s + item.grade, 0);
    return Math.round((sum / this.grades.length) * 100) / 100;
  }

  showInfo() {
    return {
      fullName: this.fullName(),
      age: this.age,
      faculty: this.faculty,
      average: this.calcAverage(),
      gradesCount: this.grades.length
    };
  }
}

// Использование
const st = new Student("Али", "Мамедов", 20, "Информатика");
st.addGrade("Математика", 90);
st.addGrade("Физика", 85);
console.log(st.showInfo());
```

---

## 🔹 Constructor и экземпляры

### Особенности конструктора

```javascript
class Company {
  constructor(name, area, staffCount = 0) {
    if (!name || !area) {
      throw new Error("Имя компании и сфера деятельности обязательны");
    }
    this.name = name;
    this.area = area;
    this.staffCount = staffCount;
    this.createdAt = new Date();
    this.departments = [];
    this.init();
  }

  init() {
    console.log(`Компания ${this.name} создана`);
    this.departments.push("HR");
    this.departments.push("Финансы");
  }

  addDepartment(depName) {
    if (!this.departments.includes(depName)) {
      this.departments.push(depName);
      return true;
    }
    return false;
  }

  addStaff(count = 1) {
    this.staffCount += count;
  }

  getInfo() {
    const years = new Date().getFullYear() - this.createdAt.getFullYear();
    return {
      name: this.name,
      area: this.area,
      staffCount: this.staffCount,
      departments: this.departments,
      years: years
    };
  }
}

const cmp = new Company("TechAz", "Технологии", 50);
cmp.addDepartment("Разработка");
cmp.addStaff(10);
console.log(cmp.getInfo());
```

---

## 🔹 Методы и свойства

### Методы экземпляра

```javascript
class Calculator {
  constructor() {
    this.result = 0;
    this.history = [];
  }

  add(num) {
    this.log('add', num);
    this.result += num;
    return this;
  }

  sub(num) {
    this.log('sub', num);
    this.result -= num;
    return this;
  }

  mul(num) {
    this.log('mul', num);
    this.result *= num;
    return this;
  }

  div(num) {
    if (num === 0) throw new Error("Делить на ноль нельзя");
    this.log('div', num);
    this.result /= num;
    return this;
  }

  pow(power) {
    this.log('pow', power);
    this.result = Math.pow(this.result, power);
    return this;
  }

  sqrt() {
    if (this.result < 0) throw new Error("Корень из отрицательного числа");
    this.log('sqrt', null);
    this.result = Math.sqrt(this.result);
    return this;
  }

  log(op, val) {
    this.history.push({ op, val, prev: this.result, date: new Date() });
  }

  clear() {
    this.result = 0;
    this.history = [];
    return this;
  }

  getResult() {
    return this.result;
  }

  getHistory() {
    return this.history;
  }

  lastOp() {
    return this.history[this.history.length - 1];
  }
}

// Method Chaining пример
const calc = new Calculator();
const res = calc
  .add(10)
  .mul(2)
  .sub(5)
  .div(3)
  .getResult();

console.log(res); // 5
console.log(calc.getHistory());
```

---

## 🔹 Геттеры и сеттеры

### Основное использование

```javascript
class User {
  constructor(name, email, birthday) {
    this._name = name;
    this._email = email;
    this._birthday = new Date(birthday);
    this._avatar = null;
    this._status = "активен";
  }

  get name() {
    return this._name;
  }
  set name(value) {
    if (typeof value !== 'string' || value.length < 2) {
      throw new Error("Имя должно содержать минимум 2 символа");
    }
    this._name = value.trim();
  }

  get email() {
    return this._email;
  }
  set email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      throw new Error("Введите корректный email");
    }
    this._email = value.toLowerCase();
  }

  get age() {
    const today = new Date();
    let age = today.getFullYear() - this._birthday.getFullYear();
    const m = today.getMonth() - this._birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this._birthday.getDate())) {
      age--;
    }
    return age;
  }

  get status() {
    return this._status;
  }
  set status(value) {
    const allowed = ["активен", "неактивен", "ожидание", "заблокирован"];
    if (!allowed.includes(value)) {
      throw new Error(`Статус должен быть: ${allowed.join(", ")}`);
    }
    this._status = value;
  }

  get info() {
    return {
      name: this._name,
      email: this._email,
      age: this.age,
      status: this._status,
      hasAvatar: this._avatar !== null
    };
  }

  set avatar(url) {
    if (url && typeof url === 'string') {
      try {
        new URL(url);
        this._avatar = url;
      } catch {
        throw new Error("Введите корректный URL");
      }
    } else {
      this._avatar = null;
    }
  }

  get avatar() {
    return this._avatar || "https://via.placeholder.com/150";
  }
}

// Пример использования
const user = new User("Али Мамедов", "ali@example.com", "1990-05-15");
console.log(user.age); // Возраст
console.log(user.info);

user.name = "Вели Гасанов";
user.status = "неактивен";
user.avatar = "https://example.com/avatar.jpg";
```

---

## 🔹 Static методы и свойства

### Static методы

```javascript
class MathUtils {
  static PI = 3.14159265359;
  static E = 2.71828182846;

  static add(a, b) {
    return a + b;
  }

  static sub(a, b) {
    return a - b;
  }

  static mul(a, b) {
    return a * b;
  }

  static div(a, b) {
    if (b === 0) throw new Error("Делить на ноль нельзя");
    return a / b;
  }

  static pow(num, power) {
    return Math.pow(num, power);
  }

  static sqrt(num, degree = 2) {
    if (num < 0 && degree % 2 === 0) throw new Error("Отрицательное число для четной степени");
    return Math.pow(num, 1 / degree);
  }

  static factorial(n) {
    if (n < 0) throw new Error("Факториал для отрицательных чисел не определен");
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  static fibonacci(n) {
    if (n < 0) throw new Error("Фибоначчи не определён для отрицательных");
    if (n === 0) return 0;
    if (n === 1) return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
  }

  static isEven(num) {
    return num % 2 === 0 ? "четное" : "нечетное";
  }

  static digitSum(num) {
    return Math.abs(num).toString().split("").reduce((s, d) => s + parseInt(d), 0);
  }

  static isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  }

  static circleArea(radius) {
    return this.PI * radius * radius;
  }

  static circlePerimeter(radius) {
    return 2 * this.PI * radius;
  }

  static triangleArea(a, b, c) {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  static average(nums) {
    if (!Array.isArray(nums) || nums.length === 0) throw new Error("Передайте непустой массив");
    return nums.reduce((s, n) => s + n, 0) / nums.length;
  }

  static median(nums) {
    if (!Array.isArray(nums) || nums.length === 0) throw new Error("Передайте непустой массив");
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
    return sorted[mid];
  }

  static minMax(nums) {
    if (!Array.isArray(nums) || nums.length === 0) throw new Error("Передайте непустой массив");
    return { min: Math.min(...nums), max: Math.max(...nums) };
  }
}

// Примеры использования
console.log(MathUtils.factorial(5)); // 120
console.log(MathUtils.fibonacci(10)); // 55
console.log(MathUtils.isPrime(17)); // true
console.log(MathUtils.circleArea(5)); // 78.54
console.log(MathUtils.average([1,2,3,4,5])); // 3
console.log(MathUtils.median([1,2,3,4,5])); // 3
```

### Static Factory Pattern

```javascript
class Avtomobil {
  constructor(marka, model, year, engine) {
    this.marka = marka;
    this.model = model;
    this.year = year;
    this.engine = engine;
    this.createdAt = new Date();
  }

  static bmw(model, year) {
    return new Avtomobil("BMW", model, year, "бензин");
  }

  static tesla(model, year) {
    return new Avtomobil("Tesla", model, year, "электро");
  }

  static toyota(model, year) {
    return new Avtomobil("Toyota", model, year, "гибрид");
  }

  static fromObject(obj) {
    return new Avtomobil(obj.marka, obj.model, obj.year, obj.engine);
  }

  info() {
    return `${this.marka} ${this.model} (${this.year}) - ${this.engine}`;
  }
}

const bmw = Avtomobil.bmw("X5", 2023);
const tesla = Avtomobil.tesla("Model 3", 2023);
const toyota = Avtomobil.toyota("Prius", 2023);

console.log(bmw.info());
console.log(tesla.info());
console.log(toyota.info());
```

---

## 🔹 Наследование

### Пример наследования

```javascript
class Animal {
  constructor(name, age, type) {
    this.name = name;
    this.age = age;
    this.type = type;
    this.health = 100;
    this.energy = 100;
  }

  makeSound() {
    console.log(`${this.name} издает звук`);
    this.energy -= 5;
  }

  eat() {
    console.log(`${this.name} ест`);
    this.energy += 20;
    this.health += 5;
    if (this.energy > 100) this.energy = 100;
    if (this.health > 100) this.health = 100;
  }

  sleep() {
    console.log(`${this.name} спит`);
    this.energy += 50;
    if (this.energy > 100) this.energy = 100;
  }

  status() {
    return {
      name: this.name,
      age: this.age,
      type: this.type,
      health: this.health,
      energy: this.energy
    };
  }
}

class Dog extends Animal {
  constructor(name, age, breed, owner) {
    super(name, age, "Собака");
    this.breed = breed;
    this.owner = owner;
    this.loyalty = 100;
    this.training = 0;
  }

  makeSound() {
    console.log(`${this.name}: Гав-гав!`);
    this.energy -= 5;
  }

  play() {
    console.log(`${this.name} играет с мячом`);
    this.energy -= 15;
    this.loyalty += 5;
    if (this.energy < 0) this.energy = 0;
    if (this.loyalty > 100) this.loyalty = 100;
  }

  train() {
    if (this.energy < 20) {
      console.log(`${this.name} слишком устал для тренировки`);
      return false;
    }
    console.log(`${this.name} тренируется`);
    this.training += 10;
    this.energy -= 20;
    this.health += 10;
    if (this.training > 100) this.training = 100;
    if (this.health > 100) this.health = 100;
    return true;
  }

  knowOwner() {
    console.log(`${this.name} узнает своего хозяина — ${this.owner}`);
    this.loyalty += 10;
    if (this.loyalty > 100) this.loyalty = 100;
  }

  status() {
   
```

const parent = super.status();  
return {  
...parent,  
breed: this.breed,  
owner: this.owner,  
loyalty: this.loyalty,  
training: this.training  
};  
}  
}

class Cat extends Animal {  
constructor(name, age, breed) {  
super(name, age, "Кот");  
this.breed = breed;  
this.independence = 80;  
this.playfulness = 90;  
}

makeSound() {  
console.log(`${this.name}: Мяу-мяу!`);  
this.energy -= 3;  
}

scratch() {  
console.log(`${this.name} точит когти`);  
this.energy -= 5;  
this.independence += 5;  
if (this.independence > 100) this.independence = 100;  
}

purr() {  
console.log(`${this.name} мурлычет (счастлив)`);  
this.health += 5;  
this.energy += 10;  
if (this.health > 100) this.health = 100;  
if (this.energy > 100) this.energy = 100;  
}

hunt() {  
if (this.energy < 30) {  
console.log(`${this.name} слишком устал для охоты`);  
return false;  
}  
console.log(`${this.name} охотится на мышь`);  
this.energy -= 30;  
this.playfulness += 10;  
this.independence += 5;  
if (this.playfulness > 100) this.playfulness = 100;  
if (this.independence > 100) this.independence = 100;  
return true;  
}

status() {  
const parent = super.status();  
return {  
...parent,  
breed: this.breed,  
independence: this.independence,  
playfulness: this.playfulness  
};  
}  
}

// Пример использования  
const dog = new Dog("Рекс", 3, "Немецкая овчарка", "Али");  
const cat = new Cat("Местан", 2, "Персидский");

dog.makeSound();  
dog.play();  
dog.train();  
dog.knowOwner();

cat.makeSound();  
cat.scratch();  
cat.hunt();  
cat.purr();

console.log("Статус собаки:", dog.status());  
console.log("Статус кота:", cat.status());

---

## 🔹 Многоуровневое наследование


```javascript
class Organism {
  constructor(name) {
    this.name = name;
    this.isAlive = true;
  }

  breathe() {
    console.log(`${this.name} дышит`);
  }
}

class Animal extends Organism {
  constructor(name, age) {
    super(name);
    this.age = age;
    this.type = "Животное";
  }

  move() {
    console.log(`${this.name} двигается`);
  }
}

class Bird extends Animal {
  constructor(name, age, wingLength) {
    super(name, age);
    this.type = "Птица";
    this.wingLength = wingLength;
  }

  fly() {
    console.log(`${this.name} летит!`);
  }
}

class Parrot extends Bird {
  constructor(name, age, wingLength, color) {
    super(name, age, wingLength);
    this.color = color;
  }

  speak(word) {
    console.log(`${this.name} говорит: ${word}`);
  }
}

const lora = new Parrot("Лора", 2, 30, "зелёный");
lora.breathe();
lora.move();
lora.fly();
lora.speak("Привет!");
````

---

## 🔹 Абстрактные классы и new.target

**Абстрактный класс** — это класс, который предназначен только для наследования и не должен создавать собственные экземпляры напрямую.  
Он служит "шаблоном" для других классов, чтобы они реализовывали определённые методы или поведение.

В JavaScript нет отдельного синтаксиса для абстрактных классов (в отличие от TypeScript, Java, C#), но можно реализовать их поведение вручную с помощью проверки внутри конструктора.

```javascript
class Transport {
  constructor() {
    if (new.target === Transport) {
      throw new Error("Нельзя создать экземпляр абстрактного класса Transport");
    }
    this.type = "Транспорт";
  }

  move() {
    throw new Error("Метод должен быть реализован в подклассе");
  }
}

class Bus extends Transport {
  constructor(brand) {
    super();
    this.brand = brand;
  }

  move() {
    console.log(`${this.brand} автобус поехал`);
  }
}

const bus = new Bus("Mercedes");
bus.move();
// const t = new Transport(); // Ошибка!
```

---

## 🔹 Class Expression

```javascript
const Construction = class {
  constructor(type, place) {
    this.type = type;
    this.place = place;
  }
  build() {
    console.log(`${this.type} строится в ${this.place}`);
  }
};

const house = new Construction("дом", "Москва");
house.build(); // дом строится в Москва
```

---

## 🔹 Прототипная цепочка и super()

```javascript
class Parent {
  greet() {
    console.log("Привет, я родитель!");
  }
}

class Child extends Parent {
  greet() {
    super.greet();
    console.log("Привет, я ребёнок!");
  }
}

const ch = new Child();
ch.greet();
// Привет, я родитель!
// Привет, я ребёнок!
```

---

## 🔹 Оператор instanceof

```javascript
class Animal {}
class Dog extends Animal {}
const rex = new Dog();

console.log(rex instanceof Dog);      // true
console.log(rex instanceof Animal);   // true
console.log(rex instanceof Object);   // true
```

---

## 🔹 Приватные поля (#privateFields)

```javascript
class BankAccount {
  #balance;

  constructor(owner, balance) {
    this.owner = owner;
    this.#balance = balance;
  }

  #showBalance() {
    return this.#balance;
  }

  checkBalance() {
    return this.#showBalance();
  }

  withdraw(amount) {
    if (amount <= this.#balance) {
      this.#balance -= amount;
      return true;
    }
    return false;
  }
}

const acc = new BankAccount("Ivan", 1000);
console.log(acc.checkBalance()); // 1000
// console.log(acc.#balance); // Ошибка!
```

---

## 🔹 Миксины

```javascript
let Flyer = {
  fly() {
    console.log(`${this.name} умеет летать`);
  }
};

let Runner = {
  run() {
    console.log(`${this.name} умеет бегать`);
  }
};

class Hero {
  constructor(name) {
    this.name = name;
  }
}

Object.assign(Hero.prototype, Flyer, Runner);

const superman = new Hero("Супермен");
superman.fly();
superman.run();
```

---

## 🔹 Дополнительные возможности классов

- **Arrow-функции в классах:** Использовать внутри классов не рекомендуется, так как у arrow-функций нет собственного `this`.
    
- **Вычисляемые имена методов:** Можно создавать методы с динамическими именами.
    
- **Static blocks:** В ES2022 добавлен статический блок, который выполняется один раз для класса.
    

```javascript
class Demo {
  static {
    console.log("Класс Demo был создан!");
  }
}
```

---

## 🔹 Сравнительная таблица

|Особенность|ES5 Constructor Function|ES6 Class|
|---|---|---|
|Синтаксис|function|class|
|Наследование|prototype|extends, super|
|Static Methods|function.staticMethod|static|
|Getter/Setter|Object.defineProperty|get/set|
|Приватные поля|_field (нет)|#field (есть)|

---

## 🔹 FAQ (часто задаваемые вопросы)

**1. Для чего нужны классы в JavaScript?**  
Для повторного использования кода, структурирования и читаемости.

**2. Может ли класс наследоваться сразу от нескольких родителей?**  
Нет, но можно использовать миксины.

**3. Зачем нужны приватные поля?**  
Для защиты данных и безопасности.

**4. Есть ли разница в производительности между ES5-функцией и классом?**  
Нет, class — это синтаксический сахар над прототипным наследованием.

---

## 🔹 Задачи для практики

1. Создайте классы Robot → CleaningRobot → SmartRobot с многоуровневым наследованием.
    
2. Реализуйте класс банковского счета с приватным балансом, методами пополнения и снятия.
    
3. С помощью mixin реализуйте объект, который умеет и бегать, и летать.
    
4. Реализуйте утилитарный класс для математических операций с использованием static методов.
    

---
