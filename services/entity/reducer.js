
const initialState = {};

function entityCreated(state, action) {
  const ans = {...state};
  const {entityKey, entityId, payload} = action;

  // ensure entity exists on the state object
  if (!ans[entityKey]) ans[entityKey] = {};

  ans[entityKey][entityId] = payload || {};

  return ans;
}

function updateEntity(state, action) {
  const ans = {...state};
  const {entityKey, entityId, payload} = action;

  // ensure entity exists on the state object
  if (!ans[entityKey]) ans[entityKey] = {};

  let found = ans[entityKey][entityId];
  if (found) {
    ans[entityKey][entityId] = {...found, ...payload}
  } else {
    ans[entityKey][entityId] = payload;
  }
  return ans;
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case "ENTITY_CREATED":
      return entityCreated(state, action);

    case "NAME_CAPTURED":
    case "PASSWORD_CAPTURED":
    case "AVATAR_URL_CAPTURED":
    case "DATE_OF_BIRTH_CAPTURED":
    case "AGE_CALCULATED":
      return updateEntity(state, action);

    default:
      return state;
  }
};

module.exports = reducer;