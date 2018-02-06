
const connectStreamsToRedux = (action$, store, deps) => {
  const {entityTopicStream} = deps;
  return entityTopicStream
    .filter(action => action.type);
};

module.exports = {connectStreamsToRedux};