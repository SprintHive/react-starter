const {setOffset, getOffset, quit} = require('../cqrs/manageOffset');

// setOffset('');
getOffset.subscribe(console.log, console.error);

setTimeout(() => quit(), 1000);