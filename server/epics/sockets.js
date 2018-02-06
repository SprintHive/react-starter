const axios = require('axios');

const relayConnectionActivityToAuthApi = ({io}) => {
  io.on('connection', (socket) => {
    const action = {type: "SOCKET_CONNECTED", payload: {socketId: socket.id}};
    axios.post(`http://localhost:3009/auth/v1/fact/${action.type}`,action)
      .then(result => console.log(result.data))
      .catch(error => console.error(`Could not add the socket ${socket.id} to the socketMap`));

    socket.on("disconnect", () => {
      console.log("Socket disconnected", socket.id);
      const action = {type: "SOCKET_DISCONNECTED", payload: {socketId: socket.id}};
      axios.post(`http://localhost:3009/auth/v1/fact/${action.type}`,action)
        .then(result => console.log(result.data))
        .catch(error => console.error(`Could not add the socket ${socket.id} to the socketMap`));
    });
  });
};

module.exports = {relayConnectionActivityToAuthApi};