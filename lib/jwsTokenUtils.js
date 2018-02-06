const {Observable} = require('rxjs');
const jwebtoken = require('jsonwebtoken');

const secret = "shhhhh-its-a-secret";

function sign(user) {
  return jwebtoken.sign(user, secret, { expiresIn: 86400 * 14 }); /* expires in 14 days*/
}

function verifyToken(token) {
  return Observable.create(function (observer) {
    jwebtoken.verify(token, secret, function (err, decoded) {
      if (err) {
        console.log(err);
        observer.onError({success: false, message: 'Failed to authenticate token.'});
      } else {
        // if everything is good, save to request for use in other routes
        observer.next(decoded);
        observer.complete();
      }
    });
  });
}

module.exports = {sign, verifyToken};