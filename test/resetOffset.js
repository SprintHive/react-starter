const {setOffset, quit} = require('../cqrs/manageOffset');

setOffset('');

setTimeout(() => quit(), 1000);