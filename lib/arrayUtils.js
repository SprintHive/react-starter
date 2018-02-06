module.exports = {
  remove: function remove(value, array) {
    const i = array.indexOf(value);
    i > -1 && array.splice(i, 1);
  }
};