const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { pathToFileURL } = require('url');

function createFolder(pathToFolder) {
  fs.access(pathToFolder, (error) => {
    if (error) {
      fsPromises.mkdir(pathToFolder);
    }
  });
}

function mergeStyle() {
  const pathToStyle = path.resolve(__dirname, './styles');
  const pathToBundle = path.resolve(__dirname, './project-dist/style.css');
  fs.readdir(pathToStyle, (error, files) => {
    if (error) {
      return error;
    }
    const writeStyleStream = fs.createWriteStream(pathToBundle);
    files.forEach((file) => {
      if (path.extname(pathToStyle + file) === '.css') {
        fs.readFile(path.resolve(pathToStyle, file), (error, style) => {
          if (error) throw error;
          writeStyleStream.write(style);
        });
      }
    });
  });
}


function runBuild() {
  createFolder(path.resolve(__dirname, './project-dist'));
  mergeStyle();
}

