function calcKey(entityKey, entityId) {
  let key = entityKey;
  if (entityId) key = `${entityKey}_${entityId}`;
  return key;
}

module.exports = calcKey;