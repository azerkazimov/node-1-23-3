// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ...
console.log("program start");

setTimeout(() => {
  console.log("timeOut - 1");
}, 0);

// function fib(n) {
//   return new Promise((resolve, reject) => {
//     if (n === 0 || n === 1) return resolve(n);
//     setImmediate(() => {
//       Promise.all([fib(n - 1), fib(n - 2)])
//         .then(([fib1, fib2]) => resolve(fib1 + fib2))
//         .catch((err) => console.log(err));
//     });
//   });
// }

const cashe = new Map();

function fib(n) {
  return new Promise((resolve, reject) => {
    if (n === 0 || n === 1) return resolve(n);

    if (cashe.has(n)) resolve(cashe.get(n));
    setImmediate(() => {
      fib(n - 1).then((fib1) =>
        fib(n - 2).then((fib2) => {
          cashe.set(n, fib1 + fib2);
          resolve(fib1 + fib2);
        })
      );
    });
  });
}

// fib(50).then((res) => console.log(res));

function fibLin(n) {
  if (n === 0 || n === 1) return n;

  let fib1 = 0;
  let fib2 = 1;
  let sum;
  for (let i = 1; i < n; i++) {
    sum = fib1 + fib2;
    fib1 = fib2;
    fib2 = sum;
  }
  return sum;
}

console.log(fibLin(40));
console.log("program end");

setTimeout(() => {
  console.log("timeOut - 2");
}, 2000);
