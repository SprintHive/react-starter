const {Observable} = require('rxjs');
const createProducer = require('../lib/createProducer');
const {sendMessage} = createProducer({streamOptions: {topic: "test-event-stream"}});

const testProducer = () => {
  Observable.interval(100)
    .take(10)
    .map(i => ({key: `key-${i}`, message: `Hello ${i}`}))
    .map(sendMessage)
    .subscribe(console.log, console.error);
};

testProducer();
