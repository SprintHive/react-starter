const fs = require('fs');

function writeOffset(offset, path) {
  fs.writeFileSync(`${path}/offset.json`, JSON.stringify({offset}));
}

function readOffset(path) {
  try {
    const str = fs.readFileSync(`${path}/offset.json`, 'utf-8');
    if (str) {
      return JSON.parse(str).offset;
    } else {
      return -1;
    }
  } catch (err) {
    return -1
  }
}

function manageOffset(eventStream, path) {
  eventStream
    .debounceTime(200)
    .do(({meta}) => writeOffset(meta.offset, path))
    .subscribe()
}

module.exports = {manageOffset, readOffset};
