
module.exports = ({store, app, sendMessage}) => {
  const state = store.getState();
  const {socketMap} = state;

  function cleanUpSubscriptions(socketId, subscriptionMap) {
    Object.keys(subscriptionMap)
      .map(k => subscriptionMap[k])
      .forEach(array => remove(socketId, array));
  }

  app.post('/auth/v1/fact/:action', (req, res) => {
    // todo need to validate the actions which are being received
    console.log("write-api: received a fact to write", req.params);
    sendMessage(req.body);
    res.send({message: "Fact has been recorded"})
  });

  app.post('/auth/v1/signout', (req, res) => {
    console.log('write-api: sign out:', req.body);
    const {socketId} = req.body;
    sendMessage({type: "SIGN_OUT_SUCCESSFUL", payload: {socketId}});

    const username = socketMap[socketId]
      && socketMap[socketId].user
      && socketMap[socketId].user.name
      || socketId;
    res.send({message: `${username} has been signed out`});
  });
};

