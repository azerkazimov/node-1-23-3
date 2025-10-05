// // 1.generate emitter

// const EventEmitter = require('events');

// // Создание экземпляра
// const emitter = new EventEmitter();

// // Подписка на событие
// emitter.on('greeting', (name) => {
//   console.log(`Привет, ${name}!`);
// });
// emitter.on('greeting', (name) => {
//   console.log(`Hi, ${name}!`);
// });
// emitter.on('greeting', (name) => {
//   console.log(`Bye, ${name}!`);
// });

// // Генерация события
// emitter.emit('greeting', 'Сладкий котик');
// emitter.emit('greeting', 'Ugly котик');

// console.log(emitter.listenerCount('greeting'));

// emitter.on('data', (data) => {
//   console.log('Получены данные:', data);

// });

// emitter.emit('data', { id: 1, name: 'Test' });

// log user

const EventEmitter = require('events');

class Logger extends EventEmitter {
  log(message) {
    console.log(message);
    this.emit('logged', { message, timestamp: performance.now() });
  }
}

const logger = new Logger();

logger.on('logged', (data) => {
  console.log(`Залогировано в ${new Date(data.timestamp)}: ${data.message}`);
});

logger.log('Приложение запущено');