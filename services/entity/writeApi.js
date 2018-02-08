const uuid = require('../../lib/uuid');

function findUnusedEntityId(state, action) {
  const {entityKey} = action;
  const entityId = uuid();
  if (state[entityKey]) {
    if (state[entityKey] && !state[entityKey][entityId]) {
      return entityId;
    } else {
      return null;
    }
  } else {
    return entityId;
  }
}

module.exports = ({store, app, sendMessage}) => {
  app.post('/entity/write/v1/fact', (req, res) => {
    const action = req.body;
    console.log("entity write-api: Received a fact to write", action);
    sendMessage(action);
    res.send({message: "Fact has been recorded"})
  });

  app.post('/entity/create/v1/fact', (req, res) => {
    const action = req.body;
    console.log("entity write-api: Received a fact to create", action);
    const {entityKey, payload, meta} = action;
    let entityId;
    while (!entityId) {
      entityId = findUnusedEntityId(store.getState(), action);
    }
    sendMessage({type: "ENTITY_CREATED", entityKey, entityId, payload, meta});
    res.send({message: `Fact to create an entity has been recorded entityKey: ${entityKey} entityId: ${entityId}`})
  });
};

