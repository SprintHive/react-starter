import {combineEpics} from 'redux-observable';
import {socketStatus, sendRemoteActionsToServer} from './ReduxSocketEpic';

export const rootEpic = combineEpics(
  socketStatus,
  sendRemoteActionsToServer
);