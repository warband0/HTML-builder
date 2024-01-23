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
  const readTemplate = await fsPromises.readFile(
    path.resolve(__dirname, './template.html'),
    'utf-8',
  );
  let HTMLdist = readTemplate;
  const readComponent = await fsPromises.readdir(
    path.resolve(__dirname, './components'),
  );
  componentsForEach(readComponent, HTMLdist);
}

function copyAssets() {
  const pathToOrig = path.resolve(__dirname, './assets');
  const pathToCopy = path.resolve(__dirname, './project-dist/assets/');
  createFolder(pathToCopy);

  fs.readdir(pathToOrig, { withFileTypes: true }, (error, assets) => {
    if (error) return error;
    assets.forEach((asset) => {
      if (asset.isDirectory()) {
        createFolder(path.resolve(pathToCopy, asset.name));
        copyDir(path.resolve(pathToOrig, asset.name), pathToCopy, asset.name);
      }
    });
  });

  function copyDir(pathToAsset, pathToCopy, assetName) {
    let originalFiles;
    fs.readdir(pathToAsset, (error, files) => {
      if (error) return error;
      files.forEach((file) => {
        fsPromises.copyFile(
          pathToAsset + `/${file}`,
          `${pathToCopy}/${assetName}/${file}`,
        );
      });
      originalFiles = files;
      fs.readdir(`${pathToCopy}/${assetName}`, (error, files) => {
        if (error) return error;
        files.forEach((file) => {
          if (!originalFiles.includes(file)) {
            fs.unlink(`${pathToCopy}/${assetName}/${file}`, (err) => {
              if (err) throw err;
            });
          }
        });
      });
    });
  }
}

function runBuild() {
  createFolder(path.resolve(__dirname, './project-dist'));
  mergeStyle();
  createIndexHTML();
  copyAssets();
}

runBuild();
