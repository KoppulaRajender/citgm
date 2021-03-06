'use strict';

const test = require('tap').test;

const spawn = require('../../lib/spawn');

const citgmPath = require.resolve('../../bin/citgm.js');

test('bin: omg-i-pass /w tap to file /w junit to file /w append', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['omg-i-pass', '--tap', '/dev/null', '--junit',
    '/dev/null', '--append']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});

test('bin: omg-i-fail /w tap /w junit /w markdown output /w nodedir',
function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['omg-i-fail', '-m', '-t', '-x', '-d',
    '/dev/null']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.equal(code, 1, 'omg-i-fail should fail and exit with a code of one');
  });
});

test('bin: omg-i-pass /w local module', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['./test/fixtures/omg-i-pass']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});

test('bin: no module /w root check', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['-s']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error');
  });
  proc.on('close', function (code) {
    t.equal(code, 0, 'we should exit with a code of 0');
  });
});

test('bin: sigterm', function (t) {
  t.plan(1);

  const proc = spawn(citgmPath, ['omg-i-pass', '-v', 'verbose']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.stdout.once('data', function () {
    proc.kill('SIGINT');
  });
  proc.on('exit', function (code) {
    t.equal(code, 1, 'omg-i-pass should fail from a sigint');
  });
});

test('bin: install from sha', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['omg-i-pass', '-t', '-c',
    '37c34bad563599782c622baf3aaf55776fbc38a8']);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-pass');
  });
  proc.on('close', function (code) {
    t.ok(code === 0, 'omg-i-pass should pass and exit with a code of zero');
  });
});

test('bin: test custom test', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['omg-i-fail', '--customTest',
    `${process.cwd()}/test/fixtures/custom test script.js`]);
  proc.on('error', function(err) {
    t.error(err);
    t.fail('we should not get an error testing omg-i-fail');
  });
  proc.on('close', function (code) {
    t.ok(code === 0, 'omg-i-fail should pass and exit with a code of zero');
  });
});

test('bin: test custom test', function (t) {
  t.plan(1);
  const proc = spawn(citgmPath, ['omg-i-fail', '--customTest',
    `${process.cwd()}/test/fixtures/no such file.js`]);
  proc.on('close', function (code) {
    t.ok(code !== 0, 'omg-i-fail should fail with a non-zero exit code');
  });
});
