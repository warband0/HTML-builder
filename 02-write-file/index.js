const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const { stdin: input, stdout: output } = require('process');
const writeStream = fs.createWriteStream(path.resolve(__dirname, './text.txt'));
const readlineInterface = readline.createInterface({ input, output });

process.on('exit', () => {
  console.log('\n Goodbye');
});

function setText() {
  readlineInterface.question('Input text: ', (text) => {
    if (text === 'exit') {
      readlineInterface.close('Goodbye!');
    } else {
      writeStream.write(text);
      setText();
    }
  });
}

setText();
