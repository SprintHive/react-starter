const {Observable} = require('rxjs');
const createProducer = require('../lib/createProducer');
const {sendMessage} = createProducer({streamOptions: {topic: "test-stream"}});

const testProducer = () => {
  Observable.interval(100)
    .take(10)
    .map(i => ({entityKey: "test-message", entityId: i, key: `key-${i}`, message: `Hello ${i}`}))
    .map(sendMessage)
    .subscribe(console.log, console.error, () => {
      sendMessage({message: "hello with no entity key"})
    });
};

testProducer();
