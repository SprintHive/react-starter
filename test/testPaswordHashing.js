const bcrypt = require('bcrypt');
const {Observable} = require('rxjs');

const hash = Observable.bindNodeCallback(bcrypt.hash);
const compare = Observable.bindNodeCallback(bcrypt.compare);

const user = {username: 'jon', password: 'password$123'};

Observable.of(user)
  .mergeMap(user => hash(user.password, 10)
    .map(hashedPassword => user.hashedPassword = hashedPassword)
    .map(() => user))
  .mergeMap(user => compare(user.password, user.hashedPassword)
    .map(matched => user.matched = matched)
    .map(() => user))
  .subscribe(ans => {
    console.log(ans);
    console.log(ans.matched
      ? "Test has passed"
      : "Test has failed");
  });


