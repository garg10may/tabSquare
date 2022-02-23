const fs = require('fs');

const main = (filePath) => {
  return new Promise((resolve, reject) => {
    if (fs.lstatSync(filePath).isDirectory()) {
      reject(new Error('Path is a directory'));
    } else {
      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        try {
          var data = JSON.parse(file);
          resolve(data);
        } catch (err) {
          reject(new Error('JSON Invalid'));
        }

      } else {
        reject(new Error('File Does Not Exist'));
      }
    }
  });
};

main('./data.json').then(data => {
  console.log(data);
})
  .catch(err => {
    console.error(err);
  })

module.exports = main;
