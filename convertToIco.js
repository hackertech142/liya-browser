const fs = require('fs');
const pngToIco = require('png-to-ico');

pngToIco('icons/icon256.png')
  .then(buf => {
    fs.writeFileSync('icons/icon256.ico', buf);
    console.log('Icon converted successfully!');
  })
  .catch(console.error);
