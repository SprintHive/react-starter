/*
 * Expose an http post endpoint to receive actions and publishes them to the connected clients.
*/

const httpActionConnector = ({io, socketMap, userMap}) => (req, res) => {
  console.log("Processing age calculated", JSON.stringify(req.body, null, 2));
  const {userId, action} = req.body;
  action.meta = {fromServer: true};

  const socketId = userMap[userId];
  if (socketId) {
    io.to(`${socketId}`).emit('actions', action);
    res.json({message: "OK"});
  } else {
    res.status(404).json({message: `Could not find a socketId for user ${userId}`});
  }

};

module.exports = httpActionConnector;

