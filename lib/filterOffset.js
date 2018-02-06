function filterOffset(actionOffset, offset) {
  offset = offset || -1;
  const skipping = actionOffset > offset;
  if (!skipping) {
    console.log(`Skipping due to offset ${actionOffset} > ${offset}`);
  }
  return skipping;
}


module.exports = filterOffset;