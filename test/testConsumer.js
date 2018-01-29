const testConsumer = () => {
  console.log('testConsumer');
  const createConsumer = require('../lib/createConsumer');
/*
  const eventStream = createConsumer({
    consumerConfig: {replay: true},
    streamOptions: {topics: 'test-event-stream'}
  });
*/
  const eventStream = createConsumer();
  eventStream.subscribe(console.log);
};

testConsumer();

