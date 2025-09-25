// const myPromise = new Promise((res, rej) => {
//   if (!rej) {
//     console.log("result");
//   } else {
//     console.log("error");
//   }
// });
// console.log(myPromise.then());

const random = Math.random()
console.log(random);

const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    
    const success = random > 0.5;
    if (success) {
      resolve("Данные получены успешно!");
    } else {
      reject("Ошибка при получении данных");
    }
  }, 2000);
});

fetchData.then((res) => console.log(res)).catch((err) => console.log(err));
