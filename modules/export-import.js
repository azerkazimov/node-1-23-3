const {myName, myHobbies}= require('./multiple-export')

const myFriend = 'Frau Kakayato'

console.log(myHobbies);

module.exports.myName = myName
module.exports.myFriend = myFriend
module.myGreatHobbies = myHobbies