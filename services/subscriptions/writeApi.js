
module.exports = ({store, app, sendMessage}) => {

  app.post('/subscriptions/v1/fact/:action', (req, res) => {
    // todo need to validate the actions which are being received
    console.log("subscriptions-write-api: received a fact to write", req.params);
    sendMessage(req.body);
    res.send({message: "Fact has been recorded"})
  });
};

