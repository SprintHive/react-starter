import {socketConnectionStatusChagned} from "../modules/socketio/actions";

const socketMiddleware = (socket, channelName = 'actions') => store => {
  socket.on('connect', () => {
    store.dispatch(socketConnectionStatusChagned({status: 'Connected'}));
  });

  socket.on('disconnect', () => {
    store.dispatch(socketConnectionStatusChagned({status: 'Disconnected'}));
  });

  socket.on('reconnecting', () => {
    store.dispatch(socketConnectionStatusChagned({status: 'Reconnecting'}));
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