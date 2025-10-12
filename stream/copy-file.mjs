import fs from 'fs'
import path from 'path'

if (!process.argv[2]) {
  console.log("File name and copied filen name must be supplied as arguments");
  process.exit(0);
}

const fileName = `./files/${process.argv[2]}`
const copyFile = `${process.argv[2]} - copy`

if(!fs.existsSync(fileName)){
    console.warn(`Source file ${fileName} doesn't exist`);
    process.exit(0)
}

const readStream = fs.createReadStream(fileName)
const writeStream = fs.createWriteStream(path.join('./files', copyFile))

readStream.pipe(writeStream)

readStream.on('end', ()=>{console.log('Read stream ended')})
writeStream.on('close', ()=>{console.log('File was copied')})
writeStream.on('finish', ()=>{console.log('Write stream ended')})