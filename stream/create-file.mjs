import fs from 'fs'
import path from 'path'

console.log(process.argv);

if (!process.argv[2] || !process.argv[3]) {
  console.log("File name and lines quantity must be supplied as arguments");
  process.exit(0);
}



const fileName = process.argv[2]
const lineqty = parseInt(process.argv[3])

if(isNaN(lineqty)) {
    console.log('line quantity must be a number');
    process.exit(0)
}



const writeFile= fs.createWriteStream(path.join('./files', fileName)) // ./files/test.txt

for (let i = 0; i < lineqty; i++) {

    writeFile.write(
        `This's a line number ${i} in automatically generatet stream \n`
    )
}

writeFile.end(()=>{
    console.log(`Automatically generated file ${fileName} was created!`);
    
})




