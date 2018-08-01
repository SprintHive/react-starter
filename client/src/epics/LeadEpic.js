import {Observable} from 'rxjs';
import axios from 'axios';
import {printError} from '../lib/axiosUtils';

const leadServiceEndpoint = process.env.leadEndpoint || 'http://localhost:8080';

export function attemptToCreateALead(action$, store, {socket}) {
  return action$.ofType("CREATE_LEAD_ATTEMPTED")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      return Observable.fromPromise(
        axios.post(`${leadServiceEndpoint}/v1/lead`))
        .mergeMap(({data}) => {
          const {leadId, creationDate, version} = data;
          return Observable.of({type: "LEAD_CREATED", payload: {leadId, creationDate, version}});
        })
        .catch((e) => {
          printError({e, message: "Something went wrong trying to create a lead"});
          return Observable.of({type: "CREATE_LEAD_FAILED", message: "Something went wrong trying to create a lead"});
        });
    });
}

export function dateOfBirthCaptured(action$) {
  return action$.ofType("DATE_OF_BIRTH_CAPTURED")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      const {leadId, dateOfBirth} = action.payload;
      return Observable.fromPromise(
        axios.post(`${leadServiceEndpoint}/v1/lead/${leadId}/dateOfBirth`, {dateOfBirth}))
        .mergeMap(() => Observable.empty())
        .catch((e) => {
          const message = "Something went wrong trying to updated the date of birth";
          printError({e, message});
          return Observable.of({type: "DATE_OF_BIRTH_CAPTURED_FAILED", message});
        });
    })
}