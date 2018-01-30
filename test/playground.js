#!/usr/bin/env node

// const {Observable} = require("rxjs");
// const axios = require("axios");

/*
const {Observable} = require("rxjs");
const axios = require("axios");

const params = {
  username: "jon",
  password: "password"
};

Observable.fromPromise(axios.post("http://localhost:3007/login", params))
  .subscribe(ans => console.log(ans.data));
*/

// const moment = require('moment');
// console.log(moment().format("DD/MM/YYYY"));


/*
function readDateOfBirth() {
  Observable.fromPromise(axios.get("http://localhost:7002/cqrs/read/dob/v1/person/2"))
    .subscribe(ans => console.log(JSON.stringify(ans.data, null, 2)));
}
*/

// readDateOfBirth();

// const load = require("../cqrs/loadInitialState");
// load();

const createProducer = require('../lib/createProducer');
const {sendMessage} = createProducer();
sendMessage({
  type: "SIGN_IN_ATTEMPTED",
  entityKey: 'signIn',
  entityId: '1h6nSjZCnuaTnD3LAAAB',
  payload: {
    username: 'jon',
    password: 'password'
  }
});
// console.log();
