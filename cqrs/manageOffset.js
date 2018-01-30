const {Observable} = require('rxjs');
const redis = require('redis');
const client = redis.createClient();

client.on('error', console.error);

const offsetKey = "cqrs::offset";

function setOffset(offset) {
  client.set(offsetKey, `${offset}`);

}

module.exports = {setOffset};

module.exports.getOffset = Observable.create(observer => {
  client.get(offsetKey, (err, result) => {
    if (err) {
      observer.error(err);
    } else {
      observer.next(result);
      observer.complete();
    }
  });
});

module.exports.manageOffset = (eventStream) => {
  eventStream
    .debounceTime(200)
    .do(({offset}) => setOffset(offset))
    .subscribe((message) => {
      console.log(message.offset);
    })
};

module.exports.quit = () => {
  client.quit();
};

