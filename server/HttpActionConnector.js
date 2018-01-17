/*
 * Expose an http post endpoint to receive actions and publishes them to the connected clients.
*/

const httpActionConnector = ({io}) => (req, res) => {
  console.log("Processing age calculated", JSON.stringify(req.body, null, 2));
  const {socketId, action} = req.body;
  action.meta = {fromServer: true};

  if (socketId) {
    io.to(`${socketId}`).emit('actions', action);
    res.json({message: "OK"});
  } else {
    res.status(400).json({message: `Bad request, you clearly don't know what you are doing 😝`});
  }
};

module.exports = httpActionConnector;

