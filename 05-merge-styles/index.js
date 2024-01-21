const fs = require('fs');
const path = require('path');
const pathToStyle = path.resolve(__dirname, './styles');
const pathToBundle = path.resolve(__dirname, './project-dist/bundle.css');
fs.readdir(pathToStyle, (error, files) => {
  if (error) {
    return error;
  }
  const writeStream = fs.createWriteStream(pathToBundle);
  files.forEach((file) => {
    if (path.extname(pathToStyle + file) === '.css') {
      fs.readFile(path.resolve(pathToStyle, file), (error, style) => {
        if (error) {
          return error;
        }
        writeStream.write(style);
      });
    }
  });
});
