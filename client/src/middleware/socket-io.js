import {socketConnectionStatusChanged} from "../modules/socketio/actions";

const socketMiddleware = (socket, channelName = 'actions') => store => {
  socket.on('connect', () => {
    store.dispatch(socketConnectionStatusChanged({status: 'Connected'}));
  });

  socket.on('disconnect', () => {
    store.dispatch(socketConnectionStatusChanged({status: 'Disconnected'}));
  });

  socket.on('reconnecting', () => {
    store.dispatch(socketConnectionStatusChanged({status: 'Reconnecting'}));
  });

  socket.on(channelName, store.dispatch);

  return next => action => {
    if (action.meta && action.meta.remote) {
      socket.emit(channelName, action);
    }
    return next(action);
  }
};

export default socketMiddleware;