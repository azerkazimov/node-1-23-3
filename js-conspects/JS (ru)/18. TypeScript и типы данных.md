
### Что такое TypeScript?

**TypeScript** — это строго типизированный язык программирования, созданный Microsoft в 2012 году, который является надмножеством JavaScript. TypeScript компилируется в обычный JavaScript и может выполняться везде, где выполняется JavaScript.

### Основные преимущества TypeScript:

**Статическая типизация** — позволяет выявлять ошибки на этапе компиляции, а не во время выполнения **Лучшая поддержка IDE** — автодополнение, рефакторинг, навигация по коду **Современные возможности JavaScript** — поддержка последних стандартов ES **Совместимость с JavaScript** — любой валидный JS код является валидным TS кодом **Большие проекты** — упрощает разработку и поддержку крупных приложений

### Установка и настройка TypeScript:

```bash
# Глобальная установка
npm install -g typescript

# Локальная установка в проект
npm install --save-dev typescript

# Создание конфигурационного файла
tsc --init

# Компиляция TypeScript файла
tsc filename.ts

# Автоматическая компиляция при изменениях
tsc --watch
```

### Базовая структура tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 2. Примитивные типы данных

### 2.1 Boolean (логический тип)

Представляет логические значения `true` или `false`.

```typescript
let isActive: boolean = true;
let isCompleted: boolean = false;

// Автоматическое определение типа
let autoBoolean = true; // TypeScript автоматически определит тип как boolean

// Использование в функциях
function checkStatus(status: boolean): string {
  return status ? "Активен" : "Неактивен";
}

console.log(checkStatus(isActive)); // "Активен"

// Boolean как результат выражения
let isAdult: boolean = age >= 18;
let hasPermission: boolean = user.role === 'admin';
```

### 2.2 Number (числовой тип)

Все числа в TypeScript являются числами с плавающей точкой или BigInteger.

```typescript
// Десятичные числа
let decimal: number = 42;
let price: number = 19.99;

// Шестнадцатеричные числа
let hex: number = 0xf00d;

// Двоичные числа
let binary: number = 0b1010;

// Восьмеричные числа
let octal: number = 0o744;

// Большие числа (ES2020)
let bigNumber: bigint = 100n;

// Специальные числовые значения
let notANumber: number = NaN;
let infinity: number = Infinity;
let negativeInfinity: number = -Infinity;

// Математические операции
function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}

// Проверка типов чисел
function isValidNumber(value: number): boolean {
  return !isNaN(value) && isFinite(value);
}
```

### 2.3 String (строковый тип)

Представляет текстовые данные.

```typescript
// Обычные строки
let firstName: string = "Иван";
let lastName: string = 'Петров';

// Шаблонные строки (template literals)
let fullName: string = `${firstName} ${lastName}`;
let greeting: string = `Привет, ${fullName}!`;

// Многострочные строки
let multilineString: string = `
  Это многострочная
  строка в TypeScript
`;

// Строковые методы
let message: string = "Hello World";
let upperMessage: string = message.toUpperCase();
let messageLength: number = message.length;

// Функции работы со строками
function formatMessage(name: string, age: number): string {
  return `Пользователь ${name}, возраст: ${age} лет`;
}

// Проверка строк
function isEmptyString(str: string): boolean {
  return str.trim().length === 0;
}
```

## 3. Специальные типы

### 3.1 Any (любой тип)

Отключает проверку типов для переменной.

```typescript
// Базовое использование any
let dynamicValue: any = 42;
dynamicValue = "строка";
dynamicValue = true;
dynamicValue = { name: "Объект" };

// Any в массивах
let mixedArray: any[] = [1, "текст", true, { key: "value" }];

// Функции с any
function processData(data: any): any {
  return data;
}

// Проблемы с any
let userInput: any = "123";
let result: number = userInput * 2; // Ошибка во время выполнения, но TypeScript не предупредит

// Когда использовать any (с осторожностью):
// 1. Миграция с JavaScript
// 2. Работа с динамическим контентом
// 3. Библиотеки без типов

// Лучше избегать any и использовать unknown
let betterApproach: unknown = getData();
if (typeof betterApproach === 'string') {
  console.log(betterApproach.toUpperCase());
}
```

### 3.2 Unknown (неизвестный тип)

Более безопасная альтернатива `any`.

```typescript
// Базовое использование unknown
let userInput: unknown;

userInput = 5;
userInput = "hello";
userInput = true;

// Нужна проверка типа перед использованием
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // Безопасно
}

if (typeof userInput === "number") {
  console.log(userInput * 2); // Безопасно
}

// Функции с unknown
function processUnknownData(data: unknown): string {
  if (typeof data === "string") {
    return data.toUpperCase();
  }
  if (typeof data === "number") {
    return data.toString();
  }
  if (typeof data === "boolean") {
    return data ? "да" : "нет";
  }
  return "неизвестный тип";
}

// Type guards с unknown
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function handleUnknown(value: unknown) {
  if (isString(value)) {
    // TypeScript знает, что value это string
    console.log(value.charAt(0));
  }
}
```

### 3.3 Void (пустой тип)

Указывает на отсутствие значения, обычно используется для функций.

```typescript
// Функции без возвращаемого значения
function logMessage(message: string): void {
  console.log(message);
}

function showAlert(): void {
  alert("Уведомление!");
}

// Переменные типа void (редко используется)
let voidValue: void = undefined;
// let anotherVoid: void = null; // Только при --strictNullChecks false

// Функции высшего порядка с void
function executeCallback(callback: () => void): void {
  callback();
}

executeCallback(() => {
  console.log("Колбэк выполнен");
});

// Void в стрелочных функциях
const onClick: () => void = () => {
  console.log("Кнопка нажата");
};

// Методы класса с void
class Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
  
  error(message: string): void {
    console.error(`[ERROR]: ${message}`);
  }
}
```

### 3.4 Never (никогда)

Представляет тип значений, которые никогда не возникают.

```typescript
// Функции, которые никогда не завершаются
function infiniteLoop(): never {
  while (true) {
    console.log("Бесконечный цикл");
  }
}

function throwError(message: string): never {
  throw new Error(message);
}

// Never в switch exhaustiveness checking
type Shape = 'circle' | 'square' | 'triangle';

function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return Math.PI * 10 * 10;
    case 'square':
      return 10 * 10;
    case 'triangle':
      return 0.5 * 10 * 10;
    default:
      // Этот код никогда не должен выполниться
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
  }
}

// Never в условных типах
type NonNullable<T> = T extends null | undefined ? never : T;

// Функция с условной логикой never
function processValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  if (typeof value === "number") {
    return value.toString();
  }
  // TypeScript понимает, что этот код недостижим
  const impossible: never = value;
  return impossible;
}
```

### 3.5 Null и Undefined

Представляют отсутствие значения.

```typescript
// Строгий режим (--strictNullChecks)
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// Union types с null и undefined
let optionalString: string | null = null;
let maybeNumber: number | undefined = undefined;

// Опциональные свойства
interface User {
  name: string;
  email?: string; // Эквивалентно string | undefined
  phone: string | null;
}

const user: User = {
  name: "Иван",
  phone: null
  // email необязательно
};

// Проверка на null/undefined
function processName(name: string | null | undefined): string {
  if (name === null) {
    return "Имя не указано (null)";
  }
  if (name === undefined) {
    return "Имя не указано (undefined)";
  }
  return name.toUpperCase();
}

// Оператор Optional chaining (?.)
const userEmail = user.email?.toLowerCase();

// Оператор Nullish coalescing (??)
const displayName = user.name ?? "Гость";

// Non-null assertion operator (!)
function getName(): string | undefined {
  return "Иван";
}

const definitelyHasName: string = getName()!; // Говорим TS, что значение точно не null/undefined
```

## 4. Составные типы

### 4.1 Arrays (массивы)

Представляют упорядоченные коллекции элементов одного типа.

```typescript
// Способы объявления массивов
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<stri> = ["a", "b", "c"];

// Пустые массивы
let emptyNumbers: number[] = [];
let emptyStrings: Array<string> = [];

// Многомерные массивы
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Массивы разных типов (Union)
let mixedArray: (string | number)[] = [1, "hello", 2, "world"];

// Массивы с объектами
interface Person {
  name: string;
  age: number;
}

let people: Person[] = [
  { name: "Иван", age: 30 },
  { name: "Мария", age: 25 }
];

// Методы массивов
let fruits: string[] = ["яблоко", "банан", "вишня"];

// Добавление элементов
fruits.push("апельсин");
fruits.unshift("груша");

// Удаление элементов
let lastFruit: string | undefined = fruits.pop();
let firstFruit: string | undefined = fruits.shift();

// Поиск и фильтрация
let longFruits: string[] = fruits.filter(fruit => fruit.length > 5);
let appleIndex: number = fruits.findIndex(fruit => fruit === "яблоко");

// Преобразование массивов
let upperCaseFruits: string[] = fruits.map(fruit => fruit.toUpperCase());
let totalLength: number = fruits.reduce((sum, fruit) => sum + fruit.length, 0);

// Readonly массивы
let readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // Ошибка: push не существует в readonly массиве

// Tuple-подобные массивы фиксированной длины
let fixedArray: [string, number, boolean] = ["test", 42, true];
```

### 4.2 Tuples (кортежи)

Массивы фиксированной длины с известными типами элементов.

```typescript
// Базовые tuples
let person: [string, number] = ["Иван", 30];
let coordinates: [number, number] = [10.5, 20.3];

// Доступ к элементам
let name: string = person[0];
let age: number = person[1];

// Деструктуризация tuples
let [personName, personAge] = person;
let [x, y] = coordinates;

// Tuples с опциональными элементами
let optionalTuple: [string, number?] = ["hello"];
optionalTuple = ["hello", 42];

// Rest элементы в tuples
let restTuple: [string, ...number[]] = ["первый", 1, 2, 3, 4];

// Именованные tuples (TypeScript 4.0+)
let namedTuple: [name: string, age: number, isActive: boolean] = ["Иван", 30, true];

// Readonly tuples
let readonlyTuple: readonly [string, number] = ["неизменный", 42];
// readonlyTuple[0] = "новое"; // Ошибка

// Функции, возвращающие tuples
function getNameAndAge(): [string, number] {
  return ["Иван", 30];
}

function useState<T>(initial: T): [T, (value: T) => void] {
  let state = initial;
  return [
    state,
    (newValue: T) => { state = newValue; }
  ];
}

// Использование tuples в качестве параметров
function formatCoordinates([x, y]: [number, number]): string {
  return `(${x}, ${y})`;
}

// Tuples как тип ключей объекта
type RGB = [number, number, number];
type RGBA = [number, number, number, number];

const colors: { [key: string]: RGB | RGBA } = {
  red: [255, 0, 0],
  blue: [0, 0, 255],
  transparentGreen: [0, 255, 0, 0.5]
};
```

### 4.3 Objects (объекты)

Представляют сложные структуры данных.

```typescript
// Базовые объекты
let user: { name: string; age: number } = {
  name: "Иван",
  age: 30
};

// Объекты с опциональными свойствами
let product: { name: string; price: number; description?: string } = {
  name: "Ноутбук",
  price: 50000
};

// Объекты с readonly свойствами
let config: { readonly apiUrl: string; timeout: number } = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};

// config.apiUrl = "новый URL"; // Ошибка: свойство только для чтения

// Индексные сигнатуры
let dictionary: { [key: string]: string } = {
  hello: "привет",
  goodbye: "до свидания"
  
};

let numberMap: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3
};

// Вложенные объекты
let employee: {
  personal: {
    name: string;
    age: number;
  };
  work: {
    position: string;
    salary: number;
  };
} = {
  personal: {
    name: "Мария",
    age: 28
  },
  work: {
    position: "Разработчик",
    salary: 8000
  }
};

// Методы в объектах
let calculator: {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
} = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// Объекты как параметры функций
function processUser(user: { name: string; email?: string }): void {
  console.log(`Обработка пользователя: ${user.name}`);
  if (user.email) {
    console.log(`Email: ${user.email}`);
  }
}

// Деструктуризация объектов
function greetUser({ name, age }: { name: string; age: number }): string {
  return `Привет, ${name}! Тебе ${age} лет.`;
}

// Spread оператор с объектами
let baseUser = { name: "Иван", age: 30 };
let extendedUser = { ...baseUser, email: "ivan@example.com", isActive: true };
```

## 5. Перечисления (Enums)

Позволяют определить именованные константы.

### 5.1 Числовые Enums

```typescript
// Базовый числовой enum
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

let userDirection: Direction = Direction.Up;

// Enum с инициализацией
enum Status {
  Pending = 1,
  Approved = 2,
  Rejected = 3
}

// Автоинкремент после инициализации
enum ResponseCode {
  Success = 200,
  NotFound, // 201
  ServerError // 202
}

// Вычисляемые значения
enum FileAccess {
  None = 0,
  Read = 1 << 1,    // 2
  Write = 1 << 2,   // 4
  ReadWrite = Read | Write // 6
}

// Использование enums
function move(direction: Direction): void {
  switch (direction) {
    case Direction.Up:
      console.log("Движение вверх");
      break;
    case Direction.Down:
      console.log("Движение вниз");
      break;
    case Direction.Left:
      console.log("Движение влево");
      break;
    case Direction.Right:
      console.log("Движение вправо");
      break;
  }
}

// Обратное отображение (reverse mapping)
console.log(Direction[0]); // "Up"
console.log(Direction["Up"]); // 0
```

### 5.2 Строковые Enums

```typescript
// Строковый enum
enum Theme {
  Light = "light",
  Dark = "dark",
  Auto = "auto"
}

enum LogLevel {
  Error = "ERROR",
  Warning = "WARN",
  Info = "INFO",
  Debug = "DEBUG"
}

// Использование строковых enums
function setTheme(theme: Theme): void {
  document.body.className = theme;
}

function log(level: LogLevel, message: string): void {
  console.log(`[${level}] ${message}`);
}

log(LogLevel.Error, "Произошла ошибка");
setTheme(Theme.Dark);

// Смешанные enums (не рекомендуется)
enum Mixed {
  No = 0,
  Yes = "YES"
}
```

### 5.3 Const Enums

Полностью удаляются во время компиляции для оптимизации.

```typescript
// Const enum
const enum Colors {
  Red = "red",
  Green = "green",
  Blue = "blue"
}

// Использование
let favoriteColor = Colors.Red; // Компилируется в: let favoriteColor = "red";

// Обычный enum vs const enum
enum RegularEnum {
  A = 1
}

const enum ConstEnum {
  A = 1
}

// RegularEnum.A создает объект во время выполнения
// ConstEnum.A заменяется на 1 во время компиляции
```

## 6. Интерфейсы (Interfaces)

Определяют контракты для объектов, классов и функций.

### 6.1 Базовые интерфейсы

```typescript
// Простой интерфейс
interface User {
  name: string;
  age: number;
  email: string;
}

// Использование интерфейса
const user: User = {
  name: "Иван",
  age: 30,
  email: "ivan@example.com"
};

// Опциональные свойства
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string; // Опциональное свойство
  tags?: string[];
}

const product: Product = {
  id: 1,
  name: "Ноутбук",
  price: 50000
  // description и tags необязательны
};

// Readonly свойства
interface Config {
  readonly apiUrl: string;
  readonly version: string;
  timeout: number;
}

const config: Config = {
  apiUrl: "https://api.example.com",
  version: "1.0.0",
  timeout: 5000
};

// config.apiUrl = "новый URL"; // Ошибка: только для чтения
```

### 6.2 Расширение интерфейсов

```typescript
// Базовый интерфейс
interface Animal {
  name: string;
  age: number;
}

// Расширение интерфейса
interface Dog extends Animal {
  breed: string;
  bark(): void;
}

interface Cat extends Animal {
  meow(): void;
  isIndoor: boolean;
}

// Использование расширенных интерфейсов
const myDog: Dog = {
  name: "Бобик",
  age: 3,
  breed: "Лабрадор",
  bark() {
    console.log("Гав-гав!");
  }
};

// Множественное наследование
interface Flyable {
  fly(): void;
  altitude: number;
}

interface Bird extends Animal, Flyable {
  wingspan: number;
}

const eagle: Bird = {
  name: "Орел",
  age: 5,
  wingspan: 200,
  altitude: 1000,
  fly() {
    console.log("Летит высоко в небе");
  }
};
```

### 6.3 Интерфейсы функций

```typescript
// Интерфейс для функции
interface Calculator {
  (a: number, b: number): number;
}

const add: Calculator = (x, y) => x + y;
const multiply: Calculator = (x, y) => x * y;

// Интерфейс с несколькими сигнатурами
interface Converter {
  (value: string): number;
  (value: number): string;
  (value: boolean): string;
}

// Реализация перегруженной функции
const convert: Converter = (value: any): any => {
  if (typeof value === "string") return parseInt(value);
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "true" : "false";
};

// Интерфейс для конструктора
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}

const createClock = (ctor: ClockConstructor, hour: number, minute: number) => {
  return new ctor(hour, minute);
};
```

### 6.4 Индексные сигнатуры в интерфейсах

```typescript
// Строковые индексы
interface StringDictionary {
  [key: string]: string;
}

const translations: StringDictionary = {
  hello: "привет",
  goodbye: "до свидания",
  yes: "да"
};

// Числовые индексы
interface NumberDictionary {
  [index: number]: string;
}

const weekdays: NumberDictionary = {
  0: "Воскресенье",
  1: "Понедельник",
  2: "Вторник"
};

// Смешанные индексы
interface MixedDictionary {
  [key: string]: string | number;
  [key: number]: string;
  // Числовой индекс должен быть подтипом строкового
}

// Комбинирование с обычными свойствами
interface UserDatabase {
  [userId: string]: User;
  currentUser: User;
  adminUser: User;
}
```

## 7. Типы объединения и пересечения

### 7.1 Union Types (Типы объединения)

```typescript
// Базовые union types
let value: string | number;
value = "hello";
value = 42;
// value = true; // Ошибка

// Union с несколькими типами
let id: string | number | boolean;

// Union с null и undefined
let optionalValue: string | null | undefined;

// Функции с union параметрами
function formatId(id: string | number): string {
  if (typeof id === "string") {
      return id.toString().toUpperCase();
  }
  if (typeof id === "number") {
      return id.Math.ceil();
  }

}

// Union типы объектов
interface Bird {
  type: "bird";
  flyingSpeed: number;
}

interface Horse {
  type: "horse";
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  switch (animal.type) {
    case "bird":
      console.log(`Летит со скоростью ${animal.flyingSpeed} км/ч`);
      break;
    case "horse":
      console.log(`Бежит со скоростью ${animal.runningSpeed} км/ч`);
      break;
  }
}

// Discriminated unions
interface LoadingState {
  state: "loading";
}

interface SuccessState {
  state: "success";
  data: any;
}

interface ErrorState {
  state: "error";
  error: string;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

function handleState(state: AsyncState) {
  switch (state.state) {
    case "loading":
      console.log("Загрузка...");
      break;
    case "success":
      console.log("Данные:", state.data);
      break;
    case "error":
      console.log("Ошибка:", state.error);
      break;
  }
}
```

### 7.2 Intersection Types (Типы пересечения)

```typescript
// Базовые intersection types
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: number;
  department: string;
}

type PersonEmployee = Person & Employee;

const worker: PersonEmployee = {
  name: "Иван",
  age: 30,
  employeeId: 12345,
  department: "IT"
};

// Пересечение с дополнительными свойствами
interface Timestamped {
  timestamp: Date;
}

interface Tagged {
  tag: string;
}

type TimestampedTagged = Timestamped & Tagged;

const logEntry: TimestampedTagged = {
  timestamp: new Date(),
  tag: "info"
};

// Функции с intersection типами
function createEmployeeRecord(person: Person, employee: Employee): Person & Employee {
  return { ...person, ...employee };
}

// Сложные intersection типы
interface Serializable {
  serialize(): string;
}

interface Loggable {
  log(): void;
}

class DataProcessor implements Serializable & Loggable {
  private data: any;

  serialize(): string {
    return JSON.stringify(this.data);
  }

  log(): void {
    console.log(this.serialize());
  }
}

// Intersection с union типами
type StringOrNumber = string | number;
type Serializable2 = { serialize(): string };

type SerializableStringOrNumber = StringOrNumber & Serializable2;
// Это невозможный тип, так как примитивы не могут иметь методы
```

## 8. Типы-псевдонимы (Type Aliases)

``` typescript
// Простые псевдонимы
type UserID = string;
type Score = number;
type IsActive = boolean;

// Использование псевдонимов
let currentUserId: UserID = "user_123";
let playerScore: Score = 1500;
let accountStatus: IsActive = true;

// Псевдонимы для сложных типов
type Point = {
  x: number;
  y: number;
};

type User = {
  id: UserID;
  name: string;
  email: string;
  isActive: IsActive;
};

// Псевдонимы для union типов
type Status = "pending" | "approved" | "rejected";
type Theme = "light" | "dark" | "auto";
type Size = "small" | "medium" | "large";

// Псевдонимы для функций
type EventHandler = (event: Event) => void;
type Calculator = (a: number, b: number) => number;
type Predicate<T> = (item: T) => boolean;

// Использование функциональных псевдонимов
const onClick: EventHandler = (event) => {
  console.log("Клик:", event.target);
};

const add: Calculator = (x, y) => x + y;
const isPositive: Predicate<number> = (num) => num > 0;

// Обобщенные (Generic) псевдонимы
type Container<T> = {
  value: T;
  getValue(): T;
  setValue(value: T): void;
};

type Pair<T, U> = {
  first: T;
  second: U;
};

// Использование обобщенных псевдонимов
const stringContainer: Container<string> = {
  value: "hello",
  getValue() { return this.value; },
  setValue(value) { this.value = value; }
};

const coordinates: Pair<number, number> = {
  first: 10,
  second: 20
};

// Условные типы
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// Псевдонимы vs Интерфейсы
// Type alias - нельзя расширить
type Animal = {
  name: string;
};

// type Animal = {  // Ошибка: дублирование
//   age: number;
// };

// Interface - можно расширить
interface Plant {
  name: string;
}

interface Plant {  // OK: слияние деклараций
  height: number;
}

// Рекурсивные типы
type JSONValue = 
  | string 
  | number 
  | boolean 
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const jsonData: JSONValue = {
  name: "Иван",
  age: 30,
  isActive: true,
  
  hobbies: ["чтение", "спорт"],
  address: {
    city: "Москва",
    country: "Россия"
  }
};


## 9. Обобщения (Generics)

Generics позволяют создавать переиспользуемые компоненты, работающие с различными типами.

### 9.1 Базовые Generics


// Простая обобщенная функция
function identity<T>(arg: T): T {
  return arg;
}

// Использование с явным указанием типа
let output1 = identity<string>("hello");
let output2 = identity<number>(42);

// Автоматический вывод типа
let output3 = identity("world"); // TypeScript выведет string
let output4 = identity(123);     // TypeScript выведет number

// Обобщенная функция с массивом
function getFirstElement<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

const firstNumber = getFirstElement([1, 2, 3]); // number | undefined
const firstString = getFirstElement(["a", "b"]); // string | undefined

// Множественные параметры типа
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const stringNumberPair = pair("hello", 42); // [string, number]
const booleanArrayPair = pair(true, [1, 2, 3]); // [boolean, number[]]
```

### 9.2 Обобщенные интерфейсы

```typescript
// Обобщенный интерфейс
interface Container<T> {
  value: T;
  setValue(value: T): void;
  getValue(): T;
}

// Реализация обобщенного интерфейса
class Box<T> implements Container<T> {
  constructor(public value: T) {}

  setValue(value: T): void {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

const stringBox = new Box<string>("hello");
const numberBox = new Box<number>(42);

// Обобщенный интерфейс с несколькими параметрами
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

const userAge: KeyValuePair<string, number> = {
  key: "Иван",
  value: 30
};

// Обобщенный интерфейс функции
interface Comparable<T> {
  compareTo(other: T): number;
}

class Version implements Comparable<Version> {
  constructor(private version: string) {}

  compareTo(other: Version): number {
    return this.version.localeCompare(other.version);
  }
}
```

### 9.3 Обобщенные классы

```typescript
// Обобщенный класс
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 2

const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");

// Обобщенный класс с ограничениями
interface Lengthwise {
  length: number;
}

class LengthChecker<T extends Lengthwise> {
  constructor(private item: T) {}

  getLength(): number {
    return this.item.length;
  }

  compareLength(other: T): number {
    return this.item.length - other.length;
  }
}

const stringChecker = new LengthChecker("hello");
const arrayChecker = new LengthChecker([1, 2, 3, 4]);
// const numberChecker = new LengthChecker(42); // Ошибка: number не имеет свойства length
```

### 9.4 Ограничения типов (Type Constraints)

```typescript
// Ограничение extends
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Иван", age: 30, city: "Москва" };
const name = getProperty(person, "name"); // string
const age = getProperty(person, "age");   // number
// const invalid = getProperty(person, "height"); // Ошибка

// Ограничение типа объектом
interface HasId {
  id: number;
}

function updateEntity<T extends HasId>(entity: T, updates: Partial<T>): T {
  return { ...entity, ...updates };
}

const user = { id: 1, name: "Иван", email: "ivan@example.com" };
const updatedUser = updateEntity(user, { name: "Петр" });

// Условные ограничения
type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<number>;   // false

// Ограничение функцией
function callFunction<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  return fn(...args);
}

function add(a: number, b: number): number {
  return a + b;
}

const result = callFunction(add, 5, 3); // number
```

## 10. Утилитарные типы (Utility Types)

TypeScript предоставляет множество встроенных утилитарных типов.

### 10.1 Partial и Required

```typescript
// Partial - делает все свойства опциональными
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;
// Эквивалентно:
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
// }

function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}

const user: User = { id: 1, name: "Иван", email: "ivan@example.com", age: 30 };
const updatedUser = updateUser(user, { age: 31 });

// Required - делает все свойства обязательными
interface OptionalConfig {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<OptionalConfig>;
// Эквивалентно:
// {
//   apiUrl: string;
//   timeout: number;
//   retries: number;
// }

function initializeApp(config: Required<OptionalConfig>): void {
  // Все свойства гарантированно присутствуют
  console.log(`API: ${config.apiUrl}, Timeout: ${config.timeout}`);
}
```

### 10.2 Pick и Omit

```typescript
// Pick - выбирает определенные свойства
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  startDate: Date;
}

type PublicEmployee = Pick<Employee, 'id' | 'name' | 'department'>;
// Эквивалентно:
// {
//   id: number;
//   name: string;
//   department: string;
// }

// Omit - исключает определенные свойства
type EmployeeWithoutSalary = Omit<Employee, 'salary' | 'startDate'>;
// Эквивалентно:
// {
//   id: number;
//   name: string;
//   email: string;
//   department: string;
// }

// Практическое использование
function createPublicProfile(employee: Employee): PublicEmployee {
  return {
    id: employee.id,
    name: employee.name,
    department: employee.department
  };
}

function updateEmployeeInfo(
  employee: Employee,
  updates: Omit<Employee, 'id'>
): Employee {
  return { ...employee, ...updates };
}
```

### 10.3 Record и Readonly

```typescript
// Record - создает объект с ключами определенного типа
type UserRole = 'admin' | 'user' | 'guest';
type RolePermissions = Record<UserRole, string[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};

// Record с более сложными типами
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint = Record<HttpMethod, {
  url: string;
  requiresAuth: boolean;
}>;

const userApi: ApiEndpoint = {
  GET: { url: '/users', requiresAuth: false },
  POST: { url: '/users', requiresAuth: true },
  PUT: { url: '/users/:id', requiresAuth: true },
  DELETE: { url: '/users/:id', requiresAuth: true }
};

// Readonly - делает все свойства только для чтения
interface MutableConfig {
  apiUrl: string;
  timeout: number;
  features: string[];
}

type ImmutableConfig = Readonly<MutableConfig>;
// Эквивалентно:
// {
//   readonly apiUrl: string;
//   readonly timeout: number;
//   readonly features: readonly string[];
// }

const config: ImmutableConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  features: ['feature1', 'feature2']
};

// config.apiUrl = 'новый URL'; // Ошибка: только для чтения
```

### 10.4 ReturnType и Parameters

```typescript
// ReturnType - извлекает тип возвращаемого значения функции
function getUser(id: number): { name: string; email: string } {
  return { name: "Иван", email: "ivan@example.com" };
}

type UserReturnType = ReturnType<typeof getUser>;
// Эквивалентно: { name: string; email: string }

// Parameters - извлекает типы параметров функции
function createUser(name: string, age: number, isActive: boolean): User {
  return { id: 1, name, email: "", age };
}

type CreateUserParams = Parameters<typeof createUser>;
// Эквивалентно: [string, number, boolean]

// Практическое использование
function logFunctionCall<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  console.log(`Вызов функции ${fn.name} с аргументами:`, args);
  const result = fn(...args);
  console.log(`Результат:`, result);
  return result;
}

const result = logFunctionCall(createUser, "Петр", 25, true);

// ConstructorParameters - для конструкторов
class DatabaseConnection {
  constructor(
    public host: string,
    public port: number,
    public database: string
  ) {}
}

type DbConstructorParams = ConstructorParameters<typeof DatabaseConnection>;
// Эквивалентно: [string, number, string]

// InstanceType - тип экземпляра класса
type DbInstance = InstanceType<typeof DatabaseConnection>;
// Эквивалентно: DatabaseConnection
```

### 10.5 Exclude и Extract

```typescript
// Exclude - исключает типы из union
type AllColors = 'red' | 'green' | 'blue' | 'yellow' | 'purple';
type PrimaryColors = Exclude<AllColors, 'yellow' | 'purple'>;
// Эквивалентно: 'red' | 'green' | 'blue'

// Extract - извлекает типы из union
type StringOrNumber = string | number | boolean;
type OnlyStringOrNumber = Extract<StringOrNumber, string | number>;
// Эквивалентно: string | number

// Практические примеры
type ApiResponse = 
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; error: string };

type SuccessResponse = Extract<ApiResponse, { status: 'success' }>;
// Эквивалентно: { status: 'success'; data: any }

type NonLoadingResponse = Exclude<ApiResponse, { status: 'loading' }>;
// Эквивалентно: { status: 'success'; data: any } | { status: 'error'; error: string }

// NonNullable - исключает null и undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// Эквивалентно: string

function processValue(value: string | null | undefined): NonNullable<typeof value> | null {
  if (value === null || value === undefined) {
    return null;
  }
  return value.toUpperCase();
}
```

## 11. Дополнительные конструкции типов

### 11.1 Mapped Types (Отображаемые типы)

```typescript
// Базовый mapped type
type Optional<T> = {
  [K in keyof T]?: T[K];
};

interface Person {
  name: string;
  age: number;
  email: string;
}

type OptionalPerson = Optional<Person>;
// Эквивалентно:
// {
//   name?: string;
//   age?: number;
//   email?: string;
// }

// Mapped type с преобразованием ключей
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PersonGetters = Getters<Person>;
// Эквивалентно:
// {
//   getName: () => string;
//   getAge: () => number;
//   getEmail: () => string;
// }

// Условные mapped types
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullablePerson = Nullable<Person>;
// Эквивалентно:
// {
//   name: string | null;
//   age: number | null;
//   email: string | null;
// }

// Фильтрация свойств по типу
type StringProperties<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type PersonStringProps = StringProperties<Person>;
// Эквивалентно: "name" | "email"

// Создание объекта только со строковыми свойствами
type StringOnly<T> = Pick<T, StringProperties<T>>;
type PersonStrings = StringOnly<Person>;
// Эквивалентно:
// {
//   name: string;
//   email: string;
// }
```

### 11.2 Conditional Types (Условные типы)

```typescript
// Базовый условный тип
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// Условные типы с infer
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type StringArrayElement = ArrayElement<string[]>; // string
type NumberArrayElement = ArrayElement<number[]>; // number
type NotArrayElement = ArrayElement<string>; // never

// Извлечение типа промиса
type PromiseType<T> = T extends Promise<infer U> ? U : never;

type StringPromise = PromiseType<Promise<string>>; // string
type NumberPromise = PromiseType<Promise<number>>; // number

// Вложенные условные типы
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface NestedObject {
  name: string;
  address: {
    street: string;
    city: string;
  };
  hobbies: string[];
}

type ReadonlyNested = DeepReadonly<NestedObject>;
// Все вложенные объекты также становятся readonly

// Распределенные условные типы
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// Эквивалентно: string[] | number[]
```

### 11.3 Template Literal Types

```typescript
// Базовые template literal types
type Greeting = `Hello ${string}`;

const greeting1: Greeting = "Hello World"; // OK
const greeting2: Greeting = "Hello TypeScript"; // OK
// const greeting3: Greeting = "Hi there"; // Ошибка

// Комбинирование литералов
type HttpMethod = 'GET' | 'POST';
type ApiVersion = 'v1' | 'v2';
type ApiEndpoint = `/${ApiVersion}/${HttpMethod}`;

// Эквивалентно: "/v1/GET" | "/v1/POST" | "/v2/GET" | "/v2/POST"

// Манипуляции со строками
type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<string & K>]: T[K];
};

interface User {
  name: string;
  age: number;
}

type UppercaseUser = UppercaseKeys<User>;
// Эквивалентно:
// {
//   NAME: string;
//   AGE: number;
// }

// Создание event handlers
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type UserEventHandlers = EventHandlers<User>;
// Эквивалентно:
// {
//   onName: (value: string) => void;
//   onAge: (value: number) => void;
// }

// CSS свойства
type CSSSize = 'small' | 'medium' | 'large';
type CSSProperty = `margin-${'top' | 'right' | 'bottom' | 'left'}`;
type CSSClass = `.${string}-${CSSSize}`;

const cssClass: CSSClass = ".button-large"; // OK
const cssProperty: CSSProperty = "margin-top"; // OK
```

## 12. Практические примеры и паттерны

### 12.1 Создание типобезопасного API клиента

```typescript
// Определение структуры API
interface ApiRoutes {
  '/users': {
    GET: { response: User[] };
    POST: { body: Omit<User, 'id'>; response: User };
  };
  '/users/:id': {
    GET: { response: User };
    PUT: { body: Partial<User>; response: User };
    DELETE: { response: void };
  };
  '/posts': {
    GET: { response: Post[] };
    POST: { body: Omit<Post, 'id'>; response: Post };
  };
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

// Типобезопасный HTTP клиент
class ApiClient {
  async request<
    Route extends keyof ApiRoutes,
    Method extends keyof ApiRoutes[Route]
  >(
    route: Route,
    method: Method,
    options?: ApiRoutes[Route][Method] extends { body: infer Body }
      ? { body: Body }
      : never
  ): Promise<
    ApiRoutes[Route][Method] extends { response: infer Response }
      ? Response
      : never
  > {
    // Реализация HTTP запроса
    const response = await fetch(route as string, {
      method: method as string,
      body: options ? JSON.stringify(options.body) : undefined,
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }
}

// Использование
const client = new ApiClient();

// TypeScript знает типы параметров и возвращаемых значений
const users = await client.request('/users', 'GET'); // User[]
const newUser = await client.request('/users', 'POST', {
  body: { name: 'Иван', email: 'ivan@example.com', age: 30 }
}); // User
```

### 12.2 Система событий с типами

```typescript
// Определение событий приложения
interface AppEvents {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string };
  'order:created': { orderId: string; amount: number };
  'payment:completed': { orderId: string; paymentId: string };
}

// Типобезопасный Event Emitter
class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners: {
    [K in keyof Events]?: Array<(data: Events[K]) => void>;
  } = {};

  on<K extends keyof Events>(
    event: K,
    listener: (data: Events[K]) => void
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  off<K extends keyof Events>(
    event: K,
    listener: (data: Events[K]) => void
  ): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
}

// Использование
const eventEmitter = new TypedEventEmitter<AppEvents>();

// TypeScript проверяет типы событий и данных
eventEmitter.on('user:login', (data) => {
  console.log(`Пользователь ${data.userId} вошел в ${data.timestamp}`);
});

eventEmitter.on('order:created', (data) => {
  console.log(`Заказ ${data.orderId} на сумму ${data.amount}`);
});

// Генерация событий с проверкой типов
eventEmitter.emit('user:login', {
  userId: 'user123',
  timestamp: new Date()
});

// eventEmitter.emit('user:login', { invalid: 'data' }); // Ошибка типа
```

### 12.3 Валидация данных с типами

```typescript
// Схема валидации
interface ValidationSchema<T> {
  [K in keyof T]: (value: any) => value is T[K];
}

// Функции валидации
const isString = (value: any): value is string => typeof value === 'string';
const isNumber = (value: any): value is number => typeof value === 'number' && !isNaN(value);
const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
const isDate = (value: any): value is Date => value instanceof Date;

// Пример схемы для User
const userSchema: ValidationSchema<User> = {
  id: isNumber,
  name: isString,
  email: isString,
  age: isNumber
};

// Валидатор
function validateObject<T>(
  obj: any,
  schema: ValidationSchema<T>
): obj is T {
  return Object.keys(schema).every(key => {
    const validator = schema[key as keyof T];
    return validator(obj[key]);
  });
}

// Типобезопасная функция парсинга
function parseUser(data: unknown): User | null {
  if (validateObject(data, userSchema)) {
    return data; // TypeScript знает, что data имеет тип User
  }
  return null;
}

// Использование
const userData = JSON.parse('{"id": 1, "name": "Иван", "email": "ivan@example.com", "age": 30}');
const user = parseUser(userData);

if (user) {
  // TypeScript знает, что user имеет тип User
  console.log(user.name.toUpperCase());
}
```

## 13. Заключение и лучшие практики

### Основные принципы работы с типами в TypeScript:

**1. Начинайте с простых типов**

- Используйте примитивные типы для простых значений
- Постепенно переходите к более сложным конструкциям

**2. Предпочитайте явность неявности**

- Явно указывайте типы там, где это улучшает читаемость
- Используйте автовывод типов для очевидных случаев

**3. Используйте строгие настройки**

- Включайте `strict: true` в tsconfig.json
- Избегайте `any` типа без крайней необходимости

**4. Композиция типов**

- Создавайте сложные типы из простых
- Используйте union и intersection типы для гибкости

**5. Переиспользование типов**

- Выносите общие типы в отдельные файлы
- Используйте утилитарные типы для трансформаций

### Рекомендации по производительности:

- Избегайте слишком глубокой вложенности типов
- Используйте `const assertions` для литеральных типов
- Предпочитайте `interface` для объектных типов
- Используйте `type` для union типов и алиасов

### Инструменты для работы с TypeScript:

**Компиляторы:**

- tsc (официальный компилятор)
- esbuild (быстрая сборка)
- swc (альтернативный компилятор)

**IDE и расширения:**

- VS Code с TypeScript расширением
- WebStorm с встроенной поддержкой
- TypeScript Language Server

**Утилиты:**

- ts-node для выполнения TypeScript в Node.js
- type-coverage для проверки покрытия типами
- typescript-eslint для линтинга

## 14. Продвинутые паттерны и техники

### 14.1 Декораторы типов

```typescript
// Экспериментальная поддержка декораторов
// Требует включения "experimentalDecorators": true в tsconfig.json

// Декоратор для логирования методов
function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.log(`Вызов метода ${propertyName} с аргументами:`, args);
    const result = method.apply(this, args);
    console.log(`Результат:`, result);
    return result;
  };
}

// Декоратор для валидации
function validate(target: any, propertyName: string) {
  let value: any;
  
  const getter = () => value;
  const setter = (newValue: any) => {
    if (typeof newValue !== 'string' || newValue.length < 2) {
      throw new Error(`${propertyName} должно быть строкой длиной более 2 символов`);
    }
    value = newValue;
  };
  
  Object.defineProperty(target, propertyName, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

// Использование декораторов
class UserService {
  @validate
  private _name: string = '';
  
  get name() { return this._name; }
  set name(value: string) { this._name = value; }
  
  @log
  createUser(name: string, email: string): User {
    return { id: Date.now(), name, email, age: 0 };
  }
}
```

### 14.2 Паттерн Builder с типами

```typescript
// Типобезопасный Builder паттерн
interface UserData {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Вспомогательные типы для Builder
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

class UserBuilder {
  private userData: Partial<UserData> = {};

  setName(name: string): UserBuilder & { userData: { name: string } } {
    this.userData.name = name;
    return this as any;
  }

  setEmail(email: string): UserBuilder & { userData: { email: string } } {
    this.userData.email = email;
    return this as any;
  }

  setAge(age: number): UserBuilder & { userData: { age: number } } {
    this.userData.age = age;
    return this as any;
  }

  setActive(isActive: boolean): UserBuilder & { userData: { isActive: boolean } } {
    this.userData.isActive = isActive;
    return this as any;
  }

  // Метод build доступен только когда все обязательные поля заполнены
  build(this: UserBuilder & { 
    userData: Required<Pick<UserData, 'name' | 'email' | 'age' | 'isActive'>>
  }): UserData {
    return { ...this.userData } as UserData;
  }
}

// Использование с проверкой на этапе компиляции
const user = new UserBuilder()
  .setName("Иван")
  .setEmail("ivan@example.com")
  .setAge(30)
  .setActive(true)
  .build(); // OK

// const incompleteUser = new UserBuilder()
//   .setName("Иван")
//   .build(); // Ошибка: отсутствуют обязательные поля
```

### 14.3 Система плагинов с типами

```typescript
// Базовая система плагинов
interface Plugin<TOptions = {}> {
  name: string;
  version: string;
  install(app: Application, options?: TOptions): void;
}

interface Application {
  plugins: Map<string, Plugin>;
  use<T extends Plugin>(plugin: T, options?: T extends Plugin<infer U> ? U : never): this;
  getPlugin<T extends Plugin>(name: string): T | undefined;
}

// Конкретные плагины
interface LoggerOptions {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: string;
}

class LoggerPlugin implements Plugin<LoggerOptions> {
  name = 'logger';
  version = '1.0.0';

  install(app: Application, options: LoggerOptions = { level: 'info', format: 'json' }) {
    // Установка логгера
    console.log(`Установлен логгер с уровнем ${options.level}`);
  }
}

interface DatabaseOptions {
  connectionString: string;
  poolSize: number;
}

class DatabasePlugin implements Plugin<DatabaseOptions> {
  name = 'database';
  version = '2.0.0';

  install(app: Application, options: DatabaseOptions) {
    console.log(`Подключение к БД: ${options.connectionString}`);
  }
}

// Реализация Application
class App implements Application {
  plugins = new Map<string, Plugin>();

  use<T extends Plugin>(
    plugin: T, 
    options?: T extends Plugin<infer U> ? U : never
  ): this {
    plugin.install(this, options);
    this.plugins.set(plugin.name, plugin);
    return this;
  }

  getPlugin<T extends Plugin>(name: string): T | undefined {
    return this.plugins.get(name) as T | undefined;
  }
}

// Использование с автоматической типизацией опций
const app = new App()
  .use(new LoggerPlugin(), { level: 'debug', format: 'text' })
  .use(new DatabasePlugin(), { connectionString: 'mongodb://localhost', poolSize: 10 });
```

### 14.4 Функциональное программирование с типами

```typescript
// Монада Maybe для безопасной работы с nullable значениями
abstract class Maybe<T> {
  abstract map<U>(fn: (value: T) => U): Maybe<U>;
  abstract flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U>;
  abstract filter(predicate: (value: T) => boolean): Maybe<T>;
  abstract getOrElse(defaultValue: T): T;
  abstract isSome(): boolean;
  abstract isNone(): boolean;

  static some<T>(value: T): Maybe<T> {
    return new Some(value);
  }

  static none<T>(): Maybe<T> {
    return new None<T>();
  }

  static fromNullable<T>(value: T | null | undefined): Maybe<T> {
    return value != null ? Maybe.some(value) : Maybe.none<T>();
  }
}

class Some<T> extends Maybe<T> {
  constructor(private value: T) {
    super();
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    return Maybe.some(fn(this.value));
  }

  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return fn(this.value);
  }

  filter(predicate: (value: T) => boolean): Maybe<T> {
    return predicate(this.value) ? this : Maybe.none<T>();
  }

  getOrElse(_defaultValue: T): T {
    return this.value;
  }

  isSome(): boolean {
    return true;
  }

  isNone(): boolean {
    return false;
  }
}

class None<T> extends Maybe<T> {
  map<U>(_fn: (value: T) => U): Maybe<U> {
    return Maybe.none<U>();
  }

  flatMap<U>(_fn: (value: T) => Maybe<U>): Maybe<U> {
    return Maybe.none<U>();
  }

  filter(_predicate: (value: T) => boolean): Maybe<T> {
    return this;
  }

  getOrElse(defaultValue: T): T {
    return defaultValue;
  }

  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }
}

// Использование Maybe
function findUser(id: number): Maybe<User> {
  const users: User[] = [
    { id: 1, name: "Иван", email: "ivan@example.com", age: 30 }
  ];
  const user = users.find(u => u.id === id);
  return Maybe.fromNullable(user);
}

const result = findUser(1)
  .filter(user => user.age >= 18)
  .map(user => user.name.toUpperCase())
  .getOrElse("Пользователь не найден");

console.log(result); // "ИВАН"

// Композиция функций с типами
type Fn<A, B> = (a: A) => B;

function compose<A, B, C>(f: Fn<B, C>, g: Fn<A, B>): Fn<A, C> {
  return (a: A) => f(g(a));
}

function pipe<A, B>(value: A, fn: Fn<A, B>): B;
function pipe<A, B, C>(value: A, fn1: Fn<A, B>, fn2: Fn<B, C>): C;
function pipe<A, B, C, D>(value: A, fn1: Fn<A, B>, fn2: Fn<B, C>, fn3: Fn<C, D>): D;
function pipe(value: any, ...fns: Fn<any, any>[]): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}

// Использование композиции
const addOne = (x: number) => x + 1;
const multiplyByTwo = (x: number) => x * 2;
const toString = (x: number) => x.toString();

const processNumber = compose(
  compose(toString, multiplyByTwo),
  addOne
);

const result2 = pipe(5, addOne, multiplyByTwo, toString); // "12"
```

## 15. Интеграция с популярными библиотеками

### 15.1 React с TypeScript

```typescript
// Типизация компонентов React
import React, { useState, useEffect, PropsWithChildren } from 'react';

// Пропсы компонента
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Функциональный компонент с типами
const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  variant,
  size = 'medium',
  disabled = false,
  onClick,
  children
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Хуки с типами
interface User {
  id: number;
  name: string;
  email: string;
}

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        const userData: User[] = await response.json();
        setUsers(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return { users, loading, error };
}

// Context с типами
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
}
```

### 15.2 Express.js с TypeScript

```typescript
// Типизация Express приложения
import express, { Request, Response, NextFunction } from 'express';

// Расширение типов Request
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'admin' | 'user';
  };
}

// Типизированные middleware
function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Токен не предоставлен' });
    return;
  }

  // Проверка токена и добавление пользователя в req
  req.user = { id: 1, email: 'user@example.com', role: 'user' };
  next();
}

// Типизированные контроллеры
interface CreateUserBody {
  name: string;
  email: string;
  age: number;
}

function createUser(req: Request<{}, User, CreateUserBody>, res: Response<User>) {
  const { name, email, age } = req.body;
  
  const newUser: User = {
    id: Date.now(),
    name,
    email,
    age
  };

  res.status(201).json(newUser);
}

// Типизированные параметры маршрута
interface UserParams {
  id: string;
}

function getUser(req: Request<UserParams>, res: Response<User | { error: string }>) {
  const userId = parseInt(req.params.id);
  
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Некорректный ID пользователя' });
    return;
  }

  // Поиск пользователя
  const user = findUserById(userId);
  
  if (!user) {
    res.status(404).json({ error: 'Пользователь не найден' });
    return;
  }

  res.json(user);
}

function findUserById(id: number): User | undefined {
  // Имитация поиска в БД
  return { id, name: 'Иван', email: 'ivan@example.com', age: 30 };
}

// Настройка маршрутов
const app = express();
app.use(express.json());

app.post('/users', createUser);
app.get('/users/:id', getUser);
app.get('/protected', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({ message: `Привет, ${req.user?.email}!` });
});
```

## 16. Тестирование TypeScript кода

### 16.1 Unit тестирование с Jest

```typescript
// Функция для тестирования
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Деление на ноль');
    }
    return a / b;
  }

  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }
}

// Тесты с типами
import { Calculator } from '../Calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it('должен корректно складывать два числа', () => {
      const result: number = calculator.add(2, 3);
      expect(result).toBe(5);
    });

    it('должен работать с отрицательными числами', () => {
      const result: number = calculator.add(-2, 3);
      expect(result).toBe(1);
    });
  });

  describe('divide', () => {
    it('должен корректно делить числа', () => {
      const result: number = calculator.divide(10, 2);
      expect(result).toBe(5);
    });

    it('должен выбрасывать ошибку при делении на ноль', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Деление на ноль');
    });
  });

  describe('fetchData', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    it('должен возвращать данные', async () => {
      const mockData = { id: 1, name: 'Test' };
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        json: () => Promise.resolve(mockData),
      } as Response);

      const result = await calculator.fetchData('https://api.test.com');
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('https://api.test.com');
    });
  });
});

// Моки с типами
interface UserService {
  getUser(id: number): Promise<User>;
  createUser(userData: Omit<User, 'id'>): Promise<User>;
}

const mockUserService: jest.Mocked<UserService> = {
  getUser: jest.fn(),
  createUser: jest.fn(),
};

// Типизированные фикстуры
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: 'Тестовый пользователь',
  email: 'test@example.com',
  age: 25,
  ...overrides,
});
```

## 17. Миграция с JavaScript на TypeScript

### 17.1 Пошаговая стратегия миграции

```typescript
// 1. Начните с tsconfig.json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "lib": ["ES2018", "DOM"],
    "allowJs": true,           // Разрешить JS файлы
    "checkJs": false,          // Не проверять JS файлы пока
    "declaration": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,           // Включить постепенно
    "noImplicitAny": false,    // Включить позже
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

// 2. Переименуйте файлы постепенно .js -> .ts
// 3. Добавляйте типы постепенно

// Было (JavaScript):
function processData(data) {
  return data.map(item => ({
    id: item.id,
    name: item.name.toUpperCase(),
    isActive: item.status === 'active'
  }));
}

// Стало (TypeScript):
interface InputItem {
  id: number;
  name: string;
  status: string;
}

interface OutputItem {
  id: number;
  name: string;
  isActive: boolean;
}

function processData(data: InputItem[]): OutputItem[] {
  return data.map(item => ({
    id: item.id,
    name: item.name.toUpperCase(),
    isActive: item.status === 'active'
  }));
}

// 4. Постепенно включайте строгие проверки
// noImplicitAny: true
// strictNullChecks: true
// strict: true
```

### 17.2 Работа с внешними библиотеками

```typescript
// Установка типов для библиотек
// npm install --save-dev @types/lodash @types/express @types/node

// Создание собственных деклараций
// types/custom.d.ts
declare module 'some-untyped-library' {
  export function someFunction(param: string): number;
  export interface SomeInterface {
    property: string;
  }
}

// Расширение глобальных типов
// types/global.d.ts
declare global {
  interface Window {
    customProperty: string;
    customMethod(): void;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}

export {}; // Важно для модульной декларации

// Использование расширенных типов
window.customProperty = 'value'; // OK
const dbUrl: string = process.env.DATABASE_URL; // Типизировано
```

## 18. Производительность и оптимизация

### 18.1 Оптимизация компиляции

```json
// tsconfig.json для быстрой компиляции
{
  "compilerOptions": {
    "incremental": true,                   // Инкрементальная компиляция
    "tsBuildInfoFile": ".tsbuildinfo",     // Файл кэша
    "skipLibCheck": true,                  // Пропуск проверки библиотек
    "skipDefaultLibCheck": true,           // Пропуск стандартных библиотек
    "declaration": false,                  // Отключить генерацию .d.ts
    "sourceMap": false,                    // Отключить source maps в продакшене
    "removeComments": true,                // Удалить комментарии
    "importsNotUsedAsValues": "remove"     // Удалить неиспользуемые импорты
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### 18.2 Оптимизация типов

```typescript
// Избегайте сложных вычислительных типов
// Плохо - медленно компилируется
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Лучше - ограничьте глубину
type DeepReadonly<T, Depth extends number = 3> = 
  Depth extends 0 
    ? T 
    : {
        readonly [P in keyof T]: T[P] extends object 
          ? DeepReadonly<T[P], [-1, 0, 1, 2][Depth]> 
          : T[P];
      };

// Используйте литеральные типы вместо enum для лучшей производительности
// Плохо
enum Status {
  Loading = "loading",
  Success = "success",
  Error = "error"
}

// Лучше
type Status = "loading" | "success" | "error";
const Status = {
  Loading: "loading" as const,
  Success: "success" as const,
  Error: "error" as const
};

// Предпочитайте interface для объектных типов
// Лучше для производительности
interface User {
  id: number;
  name: string;
}

// Хуже для производительности при сложных операциях
type User = {
  id: number;
  name: string;
};
```

TypeScript значительно улучшает разработку JavaScript приложений, предоставляя статическую типизацию, лучшую поддержку IDE и раннее обнаружение ошибок. Правильное использование системы типов TypeScript делает код более надежным, читаемым и поддерживаемым.

Этот конспект покрывает все основные аспекты работы с типами в TypeScript - от базовых примитивов до продвинутых техник и паттернов. Используйте его как справочник при изучении и работе с TypeScript.