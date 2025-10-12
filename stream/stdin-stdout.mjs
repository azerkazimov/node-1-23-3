import { Transform } from "stream";
import fs from "fs";

// console.log(process);

// process.stdin.pipe(process.stdout)

// const filePath = './files/stdin-dump.txt'
// const writeStream = fs.createWriteStream(filePath)

// process.stdin.pipe(writeStream)

// const upperCaseStream = new stream.Transform()
const upperCaseStream = new Transform({
  transform: function (chunk, encoding, callback) {
    const upperCased = chunk.toString().toUpperCase()
    // console.log((upperCased));
    callback(null, upperCased)
  },
});

// transform saamaalet => telaamaas reverse 

const reverseStream = new Transform({
    transform(chunk, encoding, callback){
        const arrChars = chunk.toString().split('')
        const lastChar = arrChars.pop()
        const reverse = arrChars.reverse().concat(lastChar).join('')
        callback(null, reverse)
    }
})


process.stdin.pipe(upperCaseStream).pipe(reverseStream).pipe(process.stdout)
