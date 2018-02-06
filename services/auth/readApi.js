module.exports = ({store, app}) => {

  app.get('/ping', function (req, res) {
    res.send("OK")
  });

  app.get('/hack', function (req, res) {
    const state = store.getState();
    res.send(state)
  });
};


