const fs = require('fs');
const BlueBird = require('bluebird');
const uuid = require('uuid/v4');

const readFile = (path, transformJSON) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
            if (err) reject(err);
            else resolve(
                transformJSON ?
                    JSON.parse(data) :
                    data);
        })
    });
};

const generateRandomFile = (path, contents) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, contents, 'utf8', err => {
            if (err) reject(err);
            else resolve(JSON.parse(contents));
        });
    });
};

const cleanUpAutoGeneratedFiles = (mockFs) => {
    const autoFiles = mockFs.filter(f => f.generateFile);
    return BlueBird.map(autoFiles, (pathPair) => {
        return new Promise((resolve, reject) => {
            fs.unlink(pathPair.path, err => {
                if (err) reject(err);
                else resolve()
            });
        })
    });
};

const resolveFinalData = (mockFs) => {
    return BlueBird.map(mockFs, (pathPair) => {
        return new Promise((resolve, reject) => {
            if (pathPair.jsonInvalid) {
                pathPair.value = "JSON Invalid";
                resolve(pathPair);
            } else if (pathPair.missingFile) {
                pathPair.value = "File Does Not Exist";
                resolve(pathPair);
            } else if (pathPair.isDirectory) {
                pathPair.value = "Path is a directory";
                resolve(pathPair);
            } else {
                let promise, filePath;
                if (pathPair.generateFile) {
                    pathPair.path = pathPair.directory + `/${uuid()}.json`;
                    promise = generateRandomFile(pathPair.path, pathPair.contents);
                } else {
                    promise = readFile(pathPair.path, true);
                }
                promise
                    .then(data => {
                        pathPair.value = data;
                        resolve(pathPair)
                    })
                    .catch(reject)
            }
        });
    })
};

module.exports = {
    readFile,
    resolveFinalData,
    cleanUp : cleanUpAutoGeneratedFiles
};
