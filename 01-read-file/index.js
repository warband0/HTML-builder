const fs = require('fs');
const readStream = fs.createReadStream('01-read-file/text.txt');
readStream.on('data', text => console.log(text.toString()));