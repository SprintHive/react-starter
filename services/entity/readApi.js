module.exports = ({store, app}) => {

  app.get('/ping', function (req, res) {
    res.send("OK")
  });

  app.get('/hack', function (req, res) {
    const state = store.getState();
    res.send(state)
  });

  app.get('/cqrs/read/v1/fact/:entityKey', function (req, res) {
    const {entityKey} = req.params;
    const state = store.getState();
    const entity = state[entityKey];
    entity
      ? res.send(entity)
      : res.status(404).send({message: `Resource not found entityKey: ${entityKey}`})
  });

  app.get('/cqrs/read/v1/fact/:entityKey/:entityId', function (req, res) {
    const {entityKey, entityId} = req.params;
    const state = store.getState();
    const entity = state[entityKey][entityId];
    entity
      ? res.send(entity)
      : res.status(404).send({message: `Resource not found entityKey: ${entityKey} entityId ${entityId}`})
  });
};


