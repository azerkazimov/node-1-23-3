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

const express = require("express");
const app = express();
// console.log(app);

const port = 3000;

// Middleware для парсинга JSON

app.use(express.json());

// Базовый маршрут

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// POST маршрут

app.post("/users", (req, res) => {
  const user = req.body;

  res.json({ message: "User created", user });
});

// Запуск сервера

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});