const {Subject} = require('rxjs');

const connectStreamsToRedux = (action$, store, deps) => {
  const subject = new Subject();
  const {subscriptionTopicStream, entityTopicStream, authTopicStream} = deps;
  subscriptionTopicStream
    .filter(action => action.type)
    .subscribe(action => subject.next(action));

  authTopicStream
    .filter(action => action.type === "SOCKET_DISCONNECT")
    .subscribe(action => subject.next(action));

  entityTopicStream
    .filter(action => action.type === "DATE_OF_BIRTH_CAPTURED"
      || action.type === "AGE_CALCULATED")
    .subscribe(action => subject.next(action));

  return subject;
};

module.exports = {connectStreamsToRedux};