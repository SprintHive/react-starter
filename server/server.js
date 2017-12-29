#!/usr/bin/env node

const express = require("express");
const app = express();
const path = require('path');

const port = process.env.PORT || 3701;

const heathCheck = require("./healthCheck");

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.resolve(__dirname, '../client/build');
  console.log(`Serving up static content form ${clientPath}`);
  app.use(express.static(clientPath));
}

app.get('/ping', heathCheck);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const server = app.listen(port, () => {
  const port = server.address().port;
  console.log(`Http server listening at http://localhost:${port}`);
});
