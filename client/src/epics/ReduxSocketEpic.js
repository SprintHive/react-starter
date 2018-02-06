import {Subject, Observable} from "rxjs";
import {socketConnectionStatusChanged} from "../modules/socketio/actions";
import ls from 'local-storage';

const dispatchSignInAttempted = payload => (
  {
    type: "SIGN_IN_ATTEMPTED",
    meta: {remote: true},
    payload
  }
);

export function socketStatus(action$, store, {socket}) {
  const subject = new Subject();

  socket.on('connect', () => {
    const socketId = socket.id;
    subject.next(socketConnectionStatusChanged({status: 'Connected', socketId}));

    const token = ls.get('buzz-token');
    if (token) subject.next(dispatchSignInAttempted({token, socketId}));
  });

  socket.on('disconnect', () => {
    subject.next(socketConnectionStatusChanged({status: 'Disconnected', socketId: undefined}));
  });

  socket.on('reconnecting', () => {
    subject.next(socketConnectionStatusChanged({status: 'Reconnecting', socketId: undefined}));
  });

  socket.on('actions', action => {
    subject.next(action);
  });
  return subject;
}

export function sendRemoteActionsToServer(action$, store, {socket}) {
  return action$.filter(action => action.meta && action.meta.remote)
    .switchMap(action => {
      socket.emit("actions", action);
      return Observable.empty();
    });
}