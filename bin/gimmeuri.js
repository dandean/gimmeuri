#!/usr/bin/env node

// TODO: use xcopy if pbcopy isn't available

var program = require('commander');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

// Read in the version of the program so that `gimmeuri -V` works.
var packagePath = path.join(__dirname, '..', 'package.json');
var packageContent = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8');
var packageVersion = JSON.parse(packageContent).version;

// Tell the program what it's name is, for --help purposes.
program.name = 'gimmeuri';

program
  .version(packageVersion)
  .usage('[options] <file>')
  .option('-m, --max [bytes]', 'maximum file size to process (1048576)', function(value) {
    return parseInt(value, 10);
  })
  .option('-s, --save-path [path]', 'path to save the daturi')
  .parse(process.argv);

var source = program.args[0];
var max = program.max || 1048576;
var stats;
var uri = '';

function main() {
  if (!source) exit('<file> file is required. See `gimmeuri --help`.');
  exists();
}

function exists() {
  path.exists(source, function(exists) {
    if (!exists) {
      return exit('File "' + source + '" does not exist.');
    }
    checkIsFile();
  });
}

function checkIsFile() {
  fs.stat(source, function(e, fileStats) {
    if (e) return exit(e.message);
    
    stats = fileStats;
    
    if (!stats.isFile()) return exit('File "' + source + '" is not a file.');

    checkMaxSize();
  });
}

function checkMaxSize() {
  if (stats.size > max) {
    var message = 'File "' + source + '" is too large (File is '
    + stats.size + ' bytes, max is ' + max + ' bytes).\n'
    + 'See `gimmeuri --help`';
    return exit(message);
  }
  
  ensureNoOverwrite();
}

function ensureNoOverwrite() {
  var savePath = program.savePath;

  if (savePath) {
    path.exists(savePath, function(exists) {
      if (exists) return exit('File "' + savePath + '" would be overwritten.');
      inspect();
    });

  } else inspect();
}

function inspect() {
  uri += 'data:' + mime.lookup(source);

  var encoding = mime.charsets.lookup(source);
  if (encoding) uri += ';charset=' + encoding;
  
  uri += ';base64,';
  
  write();
}

function write() {
  var writer;
  var result;

  if (program.savePath) {
    writer = fs.createWriteStream(program.savePath, { encoding: 'utf8' });
    result = 'saved to "' + program.savePath + '"';
  
  } else {
    writer = require('child_process').spawn('pbcopy').stdin;
    result = 'copied to your clipboard';
  }

  writer.write(uri);
  fs.createReadStream(source, { encoding: 'base64' }).pipe(writer);
  process.stderr.write('The datauri for "' + source + '" has been ' + result + '.\n');
}

function exit(message) {
  process.stderr.write('ERROR: ' + message + '\n');
  process.exit(1);
}

main();
