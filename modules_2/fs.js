// // 1 append file 
// const fs = require("fs");

// console.log(require);



// function log(message) {
//   const timestamp = new Date().toISOString();
//   const logMessage = `[${timestamp}] ${message}\n`;
//   fs.appendFile(
//     require("path").join(__dirname, "../app.log"),
//     logMessage,
//     (err) => {
//       if (err) console.error("Ошибка логирования:", err);
//     }
//   );

//   //   fs.appendFile('app.log', logMessage, (err) => {
//   //     if (err) console.error('Ошибка логирования:', err);
//   //   });
// }

// log("Приложение запущено");
// log("Пользователь вошел в систему");
// log("Пользователь не смотрит урок");


// 2 copy file

const fs = require('fs').promises;

async function copyFile(source, destination) {
  try {
    const data = await fs.readFile(source);
    await fs.writeFile(destination, data);
    console.log('Файл скопирован успешно');
  } catch (err) {
    console.error('Ошибка копирования:', err);
  }
}

copyFile('app.log', 'destination.txt');