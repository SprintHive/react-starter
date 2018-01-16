const moment = require('moment');

function lookupUser({username}) {
  return {userId: 1, username: "jon", password: 'password', picUrl: "/avatars/jll-avatar.png"}
}

function authenticateUser({username, password, socket, socketMap, userMap}) {
  // look the user in the db and check that the passwords match
  const userFromDB = lookupUser({username});
  if (userFromDB.password === "password") {   // todo remove this hardcoding
    const user = {
      token: userFromDB.userId,
      picUrl: userFromDB.picUrl
    };

    // link the user to the socket
    const socketId = socket.id;
    socketMap[socketId].userId = userFromDB.userId;

    // link the socket to the user
    userMap[userFromDB.userId] = socketId;

    socket.emit('actions', {type: "USER_LOGGED_IN", meta: {fromServer: true}, payload: {user}});
  } else {
    const message = "Invalid credentials";
    socket.emit('actions', {type: "USER_LOGIN_FAILED", meta: {fromServer: true}, payload: {message}});
  }
}

module.exports = ({io, socketMap, userMap}) => {
  io.on('connection', (socket) => {
    socket.on('actions', (action) => {
      const socketId = socket.id;
      console.info(`Received an action of type ${action.type} from socketId: ${socketId}`);

      switch (action.type) {
        case "DATE_OF_BIRTH_CAPTURED":
          const {dateOfBirth} = action.payload;
          const mDob = moment(dateOfBirth);
          const mNow = moment();
          const age = mNow.diff(mDob, 'years');
          socket.emit('actions', {type: "AGE_CALCULATED", meta: {socketId, fromServer: true}, payload: {age}});
          return;

        case "USERNAME_CAPTURED":
          const {username, password} = action.payload;
          authenticateUser({username, password, socket, socketMap, userMap});
          return;

        default:
          console.warn(`Could not process action of type ${action.type} from socketId: ${socketId}`);
          console.info(`I suspect you are missing a reducer.`);
      }
    });
  })
};

