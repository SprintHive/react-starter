function calcKey(entityKey, entityId) {
  let key = entityKey;
  if (entityId !== null && entityId !== undefined) key = `${entityKey}_${entityId}`;
  return key;
}

module.exports = calcKey;