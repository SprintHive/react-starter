const Kafka = require('node-rdkafka');

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': 'localhost:9092',
}, {});

consumer.connect();

consumer
  .on('ready', function() {

    const timeout = 5000, partition = 0;
    consumer.queryWatermarkOffsets('test-stream', partition, timeout, function(err, offsets) {
      const high = offsets.highOffest;
      const low = offsets.lowOffset;
      console.log(high, low);
    });


    consumer.subscribe(['test-stream']);

    // Consume from the librdtesting-01 topic. This is what determines
    // the mode we are running in. By not specifying a callback (or specifying
    // only a callback) we get messages as soon as they are available.
    consumer.consume();

  })
  .on('data', function(data) {
    // Output the actual message contents
    console.log(data.value.toString());
  });