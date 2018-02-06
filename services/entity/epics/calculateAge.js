const {Observable} = require('rxjs');
const moment = require('moment');

const calculateAge = (action$, store, deps) => {
  const {sendMessage} = deps;

  return action$.ofType("DATE_OF_BIRTH_CAPTURED")
    .map(action => {
      const {entityKey, entityId, payload} = action;
      const {dateOfBirth} = payload;
      const mDob = moment(dateOfBirth);
      const mNow = moment();
      const age = mNow.diff(mDob, 'years');

      sendMessage({type: "AGE_CALCULATED", entityKey, entityId, payload: {age}, source: {action}})
    })
    .mergeMap(() => Observable.empty())
};

module.exports = calculateAge;