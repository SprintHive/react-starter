const {Subject} = require('rxjs');

const connectStreamsToRedux = (action$, store, deps) => {
  const subject = new Subject();
  const {authTopicStream, entityTopicStream} = deps;
  entityTopicStream
    .filter(action => action.type)
    .subscribe(action => subject.next(action));
  authTopicStream.delay(1000)
    .filter(action => action.type)
    .subscribe(action => subject.next(action));
  return subject;
};

module.exports = {connectStreamsToRedux};