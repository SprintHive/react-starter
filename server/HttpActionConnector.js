/*
 * Expose an http post endpoint to receive actions and publishes them to the connected clients.
*/
const {Observable} = require('rxjs');

const httpActionConnector = ({io}) => (req, res) => {
  console.log("Dispatcher received a request", JSON.stringify(req.body, null, 2));
  const {socketIds, socketId, action} = req.body;
  action.meta = {fromServer: true};

  let sockets = [];
  if (socketIds && Array.isArray(socketIds)) {
    sockets = sockets.concat(socketIds)
  }

  socketId && sockets.push(socketId);

  if (sockets.length === 0) {
    res.status(404).send({message: "Bad Request no socketId"})
  } else {
    Observable.from(sockets)
      .do(s => io.to(s).emit('actions', action))
      .reduce((acc, s) => {
        acc.push(s);
        return acc;
      }, [])
      .subscribe(
        ans => res.status(201).send({message: `Dispatched message to socket`}),
        err => res.status(400).send({message: "Could not send "}),
        () => console.log("Complete"));
  }
};

module.exports = httpActionConnector;

