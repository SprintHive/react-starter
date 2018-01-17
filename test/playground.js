#!/usr/bin/env node

const {Observable} = require("rxjs");
const axios = require("axios");

const params = {
  username: "jon",
  password: "password"
};

Observable.fromPromise(axios.post("http://localhost:3007/login", params))
  .subscribe(ans => console.log(ans.data));
