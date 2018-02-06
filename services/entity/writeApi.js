module.exports = ({store, app, sendMessage}) => {
  app.post('/entity/write/v1/fact', (req, res) => {
    const action = req.body;
    console.log("entity write-api: Received a fact to write", action);
    sendMessage(action);
    res.send({message: "Fact has been recorded"})
  });
};

