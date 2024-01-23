const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const pathToOrig = path.resolve(__dirname, './files');
const pathToCopy = path.resolve(__dirname, './files-copy');

function copyDir() {
  fs.access(pathToCopy, (error) => {
    if (error) {
      fsPromises.mkdir(path.resolve(pathToCopy));
    }
  });
  let originalFiles;
  fs.readdir(pathToOrig, (error, files) => {
    if (error) return error;
    files.forEach((file) => {
      fsPromises.copyFile(pathToOrig + `/${file}`, pathToCopy + `/${file}`);
    });
    originalFiles = files;
    fs.readdir(pathToCopy, (error, files) => {
      if (error) return error;
      files.forEach((file) => {
        if (!originalFiles.includes(file)) {
          fs.unlink(pathToCopy + `/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
}
copyDir();
