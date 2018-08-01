import {combineEpics} from 'redux-observable';
import {socketStatus, sendRemoteActionsToServer} from './ReduxSocketEpic';
import {attemptToCreateALead, dateOfBirthCaptured} from './LeadEpic';
import {signIn, signOut} from './AuthEpic';

export const rootEpic = combineEpics(
  socketStatus,
  sendRemoteActionsToServer,
  signIn,
  signOut,
  attemptToCreateALead,
  dateOfBirthCaptured
);