// common js
// const module = require('./module')

// ESM
// import module from './module.js'

// console.log(module)

const { myName, myHobbies, myFavoriteNumber } = require("./multiple-export.js");
const { greet } = require("./greeting.js");

// const {myName, myHobbies, myFavoriteNumber} = multipleExport
console.log(myName);
console.log(myHobbies);
console.log(myFavoriteNumber);

myHobbies.push('Drink')
console.log(myHobbies);


greet(myName);
