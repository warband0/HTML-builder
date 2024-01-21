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
        if (!file.isDirectory()) {
          let fileExtension = path.extname(
            path.resolve(__dirname, `./secret-folder/${file.name}`),
          );
          fs.stat(
            path.resolve(__dirname, `./secret-folder/${file.name}`),
            (error, fileStats) => {
              if (error) {
                return error;
              }
              console.log(
                `${file.name.replace(
                  fileExtension,
                  '',
                )} - ${fileExtension.replace('.', '')} - ${
                  fileStats.size / 1000
                } kb`,
              );
            },
          );
        }
      });
    },
  );
}
readDirectory();
