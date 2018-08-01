const {Observable, Subject} = require('rxjs');
const amqp = require('amqplib/callback_api');

const lead = {
  "leadId": "e70d1229-8751-48cc-bfd8-563aeed24781",
  "version": 2,
  "creationDate": "2018-02-14T06:40:21.553Z",
  "dateOfBirth": "1978-02-14",
  "age": 40,
  "leadEvaluation": null
};

const outputStream = new Subject();

const removeEmptyProps = (obj) =>
  Object.keys(obj)
    .filter(k => obj[k] !== null && obj[k] !== undefined)  // Remove undef. and null.
    .reduce((newObj, k) =>
        typeof obj[k] === 'object' ?
          Object.assign(newObj, {[k]: removeEmptyProps(obj[k])}) :  // Recurse.
          Object.assign(newObj, {[k]: obj[k]}),  // Copy value.
      {});

function processMessageFromRabbit(message, store, {io}) {
  console.log('Received a message from rabbit', message);
  message = removeEmptyProps(message);
  const {leadId} = message;
  const action = {type: "LEAD_UPDATED", meta: {fromServer: true}, payload: message};
  const key = `lead_${leadId}`;
  console.log(`Sending action to ${key}`, action);
  io.in(key).emit('actions', action);
}

function listForRabbitMessages(action$, store, {io}) {
  const rabbitUrl = process.env.RABBIT_URL || 'amqp://jon:password@localhost/';

  console.log(`Connecting to ${rabbitUrl}`);
  amqp.connect(rabbitUrl, function (err, conn) {
    console.log("Connected!");

    conn.createChannel(function (err, ch) {
      const q = 'subscription-notifications';

      ch.assertQueue(q, {durable: false});
      ch.consume(q, function (msg) {
        processMessageFromRabbit(JSON.parse(msg.content.toString()), store, {io});
      }, {noAck: true});
    });
  });

  return outputStream;

}

module.exports = {listForRabbitMessages};