const fs = require('fs');
const path = require('path');

function readDirectory() {
  fs.readdir(
    path.resolve(__dirname, './secret-folder/'),
    { withFileTypes: true },
    (error, files) => {
      if (error) {
        return error;
      }
      files.forEach((file) => {
        const pathToFile = path.resolve(
          __dirname,
          `./secret-folder/${file.name}`,
        );
        if (!file.isDirectory()) {
          let fileExtension = path.extname(path.resolve(pathToFile));
          fs.stat(path.resolve(pathToFile), (error, fileStats) => {
            if (error) {
              return error;
            }
            const filename = file.name.replace(fileExtension, '');
            const fileext = fileExtension.replace('.', '');
            const filesize = fileStats.size / 1000 + ' kb';
            console.log(` ${filename} - ${fileext} - ${filesize}`);
          });
        }
      });
    },
  );
}
readDirectory();
