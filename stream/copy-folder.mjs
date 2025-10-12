import fs from "fs";
import path from "path";

if (!process.argv[2]) {
  console.log("Folder name must be supplied as arguments");
  process.exit(0);
}
const source = process.argv[2];
const destination = `copied-${source}`;

if (!fs.existsSync(source)) {
  console.warn(`Source folder ${source} doesn't exist`);
  console.log("Exiting");
  process.exit(0);
}

if (fs.existsSync(destination)) {
  fs.rmdirSync(destination, { recursive: true, force: true });
  console.log("Folder is exist");
}

fs.mkdirSync(destination);

fs.readdir(source, (err, files) => {
  if (err) {
    console.log("File not exist");
    process.exit(1);
  }

  //   console.log(files);
  files.forEach((file, index) => {
    const sourceFilePath = path.join(source, file);
    const destinationFilePath = path.join(destination, `${index + 1}. ${file}`);

    const readFileStream = fs.createReadStream(sourceFilePath);
    const writeFileStream = fs.createWriteStream(destinationFilePath);

    readFileStream.pipe(writeFileStream);

    writeFileStream.on("finish", () => {
      console.log(`File ${file} was copied successfully!`);
    });
  });
});
