const chai = require('chai');
const app = require('../index');
const Promise = require('bluebird');
const should = chai.should();
const path = require('path');
const utils = require('./utils');
const ROOT_DIR = path.resolve('./');
let mockFileSystem, testCounter = 0;
const TEST_DATA_STORE = ROOT_DIR + '/test/data-store';


describe('file_system_read_basics', () => {
    before((done) => {
        utils.resolveFinalData([
            {
                path: ROOT_DIR + '/data.json',
            },
            {
                generateFile: true,
                contents: '{"TEST" : "VALUE"}',
                directory: TEST_DATA_STORE
            },
            {
                path: `${TEST_DATA_STORE}/invalid.json`,
                jsonInvalid: true,
                error : true
            },
            {
                path: `${TEST_DATA_STORE}/test.json`,
                missingFile: true,
                error : true
            },
            {
                path: ROOT_DIR + '/test',
                isDirectory: true,
                error : true
            }
        ])
            .then(value => {
                mockFileSystem = value;
                done();
            })
    });

    after((done) => {
        utils.cleanUp(mockFileSystem)
            .then(() => {
                done()
            })
    });

    it('should read the file and return a JSON from the file system', done => {
        const currentTestCtx = mockFileSystem[0];
        app(currentTestCtx.path)
            .then((result) => {
                result.should.eql(currentTestCtx.value);
                done()
            });
    });

    it('should read the random generated file from the FS', done => {
        const currentTestCtx = mockFileSystem[1];
        app(currentTestCtx.path)
            .then((result) => {
                result.should.eql(currentTestCtx.value);
                done()
            });
    });

    it('should return a JSON invalid error message', done => {
        const currentTestCtx = mockFileSystem[2];
        app(currentTestCtx.path)
            .catch((err) => {
                err.message.should.eql(currentTestCtx.value);
                done()
            });
    });

    it('should return a File Missing error message', done => {
        const currentTestCtx = mockFileSystem[3];
        app(currentTestCtx.path)
            .catch((err) => {
                err.message.should.eql(currentTestCtx.value);
                done()
            });
    });

    it('should return a Path is a Directory message', done => {
        const currentTestCtx = mockFileSystem[4];
        app(currentTestCtx.path)
            .catch((err) => {
                err.message.should.eql(currentTestCtx.value);
                done()
            });
    });
});
