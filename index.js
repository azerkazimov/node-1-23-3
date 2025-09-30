// const myPromise = new Promise((res, rej) => {
//   if (!rej) {
//     console.log("result");
//   } else {
//     console.log("error");
//   }
// });
// console.log(myPromise.then());

// const random = Math.random()
// console.log(random);

// const fetchData = new Promise((resolve, reject) => {
//   setTimeout(() => {

//     const success = random > 0.5;
//     if (success) {
//       resolve("Данные получены успешно!");
//     } else {
//       reject("Ошибка при получении данных");
//     }
//   }, 2000);
// });

// fetchData.then((res) => console.log(res)).catch((err) => console.log(err));

// const str = ['hello']

// str.push('world')

// console.log(str)

// Глобальный объект  - это объект, который доступен в любом месте программы

// console.log(global);  // Глобальный объект
// console.log(process); // Объект процесса Node.js

// console.log(Buffer); // Конструктор Buffer для работы с бинарными данными

// Файловая система
// const fs = require('fs')
// console.log(fs);

// console.log('file reading started');

// const data = fs.readFile('./data.txt', ()=>{
//   console.log('file reading finished');
// });

// console.log('continue...');

// HTTP сервер

// const http = require('http')
// // console.log(http);

// const server = http.createServer((req, res) => {

//   res.writeHead(200, {'Content-Type': 'text/plain'});

//   res.end('Hello World! how are you my dear 1-23-3 guys');

//   });

//   server.listen(3000, () => {

//   console.log('Server running on port 3000');

//   });

// Путь к файлам
// const path = require('path');
// console.log(path);

// Операционная система
// const os = require('os')
// // console.log(os);

// console.log(os.platform())
// console.log(os.cpus().length)
// console.log(os.cpus())
// console.log(os.freemem())
// console.log(os.totalmem())
// console.log(os.homedir())
// console.log(os.tmpdir())
// console.log(os.hostname())
// console.log(os.networkInterfaces())
// console.log(os.type())
// console.log(os.version())

// Криптография
// const crypto = require('crypto')
// // console.log(crypto);

// const hash = crypto.createHash('sha256')
// hash.update('Hello World!')
// console.log(hash.digest('hex'))

// express

// const express = require("express");
// const app = express();
// // console.log(app);

// const port = 3000;

// // Middleware для парсинга JSON

// app.use(express.json());

// // Базовый маршрут

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // POST маршрут

// app.post("/users", (req, res) => {
//   const user = req.body;

//   res.json({ message: "User created", user });
// });

// // Запуск сервера

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


// const fs = require('fs');

// process.env.UV_THREADPOOL_SIZE = 4;

// // // 10 одновременных операций чтения
// for (let i = 0; i < 10; i++) {
//     fs.readFile(`file${i}.txt`, (err, data) => {
//         console.log(`Файл ${i} прочитан`);
//     });
// }

// process.nextTick(()=>{console.log('nexttick -1');
// })


// console.log('1. Start'); // sync

// setTimeout(() => {
//     console.log('4. setTimeout');  // macrotask
// }, 0);

// Promise.resolve().then(()=>console.log('5. promise'))  // fullfilled (success) // microtask

// process.nextTick(() => {
//     console.log('2. nextTick'); // nextTick
// });

// console.log('3. End');  // sync

function timestamp(){
  return performance.now().toFixed(2)
}

// console.log('1: Sync start', timestamp());

// setTimeout(() => {
//     console.log('6: setTimeout', timestamp());
    
//     process.nextTick(() => {
//         console.log('7: nextTick in setTimeout', timestamp());
//     });
    
//     Promise.resolve().then(() => {
//         console.log('8: Promise in setTimeout', timestamp());
//     });
// }, 0);

// setImmediate(() => {
//     console.log('9: setImmediate', timestamp());
// });

// Promise.resolve()
//     .then(() => {
//         console.log('3: Promise 1', timestamp());
//         return Promise.resolve();
//     })
//     .then(() => {
//         console.log('4: Promise 2', timestamp());
//     });

// process.nextTick(() => {
//     console.log('2: nextTick 1', timestamp());
    
//     process.nextTick(() => {
//         console.log('5: nextTick nested', timestamp());
//     });
// });

// setImmediate(() => {
//     console.log('Immediate 1', timestamp());
    
//     setImmediate(() => {
//         console.log('Immediate 3 (next iteration)', timestamp());
//     });
// });

// setImmediate(() => {
//     console.log('Immediate 2', timestamp());
// });
// setImmediate(() => {
//     console.log('Immediate 4', timestamp());
// });
// setImmediate(() => {
//     console.log('Immediate 6', timestamp());
// });

// console.log('10: Sync end', timestamp());


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