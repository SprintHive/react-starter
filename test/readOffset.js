const {getOffset, quit} = require('../cqrs/manageOffset');

getOffset.subscribe(console.log, console.error);

setTimeout(() => quit(), 1000);