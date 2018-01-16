console.log("Loading the async-example endpoint browse to http://localhost:3006/async-example");

module.exports = function (req, res) {
  console.log("Processing async-example");
  res.json({name: "Joey"});
};