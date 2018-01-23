import {Subject, Observable} from "rxjs";
import {socketConnectionStatusChanged} from "../modules/socketio/actions";

export function socketStatus(action$, store, {socket}) {

  const subject = new Subject();
  socket.on('connect', () => {
    subject.next(socketConnectionStatusChanged({status: 'Connected'}));
  });

  socket.on('disconnect', () => {
    subject.next(socketConnectionStatusChanged({status: 'Disconnected' }));
  });

  socket.on('reconnecting', () => {
    subject.next(socketConnectionStatusChanged({status: 'Reconnecting'}));
  });

  socket.on('actions', action => {
    console.log("Action received from server", action);
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