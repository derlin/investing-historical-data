'use strict';

const exec = require('child_process').exec;
const path = require('path');
const expect = require('chai').expect;
//, should = require('should');


var bin = 'node ' + path.join(__dirname, '../investing.js ');

describe('history search', function () {
    const program = bin + 'h s ';
    it('should search the id for 2X DJIA Futures', function (done) {
        exec(program + '"2X DJIA Futures"', function (error, stdout, stderr) {
            expect(stderr).to.be.empty;
            const results = stdout.split("\n").filter(function (s) {
                return s.length > 0
            });
            expect(results).to.have.lengthOf(2);
            expect(results[1].split(",")[0]).to.equal("1031760");
            done();
        });
    });

    it('should return no results', function (done) {
        exec(program + 'asdferfgrtsrfdfbdfd', function (error, stdout, stderr) {
            expect(stderr).to.be.empty;
            expect(stdout).to.contain('no result');
            done();
        });
    });

});

describe('history get', function () {
    const program = bin + 'h g ';
    it('should get results for 2X DJIA Futures', function (done) {
        exec(program + '1031760', function (error, stdout, stderr) {
            expect(stderr).to.be.empty;
            const results = stdout.split("\n");
            expect(results).to.have.lengthOf.above(3);
            done();
        });
    });

    it('should get results for 2X DJIA Futures verbosely', function (done) {
        exec(program + ' -v 1031760', function (error, stdout, stderr) {
            expect(stderr).to.be.empty;
            const results = stdout.split("\n");
            expect(results).to.have.lengthOf.above(3);
            done();
        });
    });

    it('should get two dates', function (done) {
        exec(program + ' 1031760 -s "2017-10-01" -e "2017-11-01" -t "Monthly"', function (error, stdout, stderr) {
            expect(stderr).to.be.empty;
            const results = stdout.split("\n").filter(function (line) {
                return line.length > 0;
            });
            expect(results).to.have.lengthOf(3);
            done();
        });
    });

    it('should return no result', function (done) {
        exec(program + '11111111111111111', function (error, stdout, stderr) {
            expect(stderr).to.be.empty;
            expect(stdout.toLowerCase()).to.contain('no result');
            done();
        });
    });
});


