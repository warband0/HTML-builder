const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

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

async function createIndexHTML() {
  async function componentsForEach(components, template) {
    await components.forEach((component) => {
      async function replaceComponent() {
        let valueComponent = await fsPromises.readFile(
          path.resolve(__dirname, `./components/${component}`),
          'utf-8',
        );
        if (
          path.extname(path.resolve(__dirname, `./components/${component}`)) ===
          '.html'
        ) {
          let componentName = component.replace('.html', '');
          if (template.includes(`{{${componentName}}}`)) {
            template = template.replace(`{{${componentName}}}`, valueComponent);
          }
          if (components.indexOf(component) === components.length - 1) {
            let writeStream = fs.createWriteStream(
              path.resolve(__dirname, './project-dist/index.html'),
              'utf-8',
            );
            writeStream.write(template);
          }
        }
      }
      replaceComponent();
    });
  }
  const readTemplate = await fsPromises.readFile(path.resolve(__dirname, './template.html'), 'utf-8');
  let HTMLdist = readTemplate;
  const readComponent = await fsPromises.readdir(path.resolve(__dirname, './components'))
  componentsForEach(readComponent, HTMLdist);
}

async function runBuild() {
  await createFolder(path.resolve(__dirname, './project-dist'));
  mergeStyle();
  createIndexHTML();
}

runBuild();

/* fs.access(path.resolve(__dirname, './project-dist'), (error) => {
  if (error) {
    fsPromises.mkdir(path.resolve(__dirname, './project-dist'));
  }
  // style

  // assets
  fs.readdir(path.resolve(__dirname, './assets'), (error, assets) => {
    if (error) throw error;
    fs.access(path.resolve(__dirname, './project-dist/assets'), (error) => {
      if (error) {
        fsPromises.mkdir(path.resolve(__dirname, './project-dist/assets'));
      }
      assets.forEach((asset) => {
        fs.access(
          path.resolve(__dirname, `./project-dist/assets/${asset}`),
          (error) => {
            if (error) {
              fsPromises.mkdir(
                path.resolve(__dirname, `./project-dist/assets/${asset}`),
              );
            }
          },
          fs.readdir(
            path.resolve(__dirname, `./assets/${asset}`),
            (error, files) => {
              files.forEach((file) => {
                fsPromises.copyFile(
                  path.resolve(__dirname, `./assets/${asset}/${file}`),
                  path.resolve(
                    __dirname,
                    `./project-dist/assets/${asset}/${file}`,
                  ),
                );
              });
              let originalFiles = files;
              fs.readdir(
                path.resolve(__dirname, `./project-dist/assets/${asset}`),
                (error, copyfiles) => {
                  copyfiles.forEach((element) => {
                    if (!originalFiles.includes(element)) {
                      fs.unlink(
                        path.resolve(
                          __dirname,
                          `./project-dist/assets/${asset}/${element}`,
                        ),
                        (err) => {
                          if (err) throw err;
                        },
                      );
                    }
                  });
                },
              );
            },
          ),
        );
      });
    });
  });
  //html
});
*/