require('dotenv');
const {Observable} = require('rxjs');

const userMap = {
  dale: {userId: 1, name: "Dale", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/DT-Avatar.png"},
  dirk: {userId: 2, name: "Dirk", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/DLR-Avatar.png"},
  greg: {userId: 3, name: "Greg", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/GK-Avatar.png"},
  jon: {userId: 4, name: "Jon", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/JLL-Avatar.png"},
  dane: {userId: 5, name: "Dane", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/DB-Avatar.png"},
  sam: {userId: 6, name: "Sam", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/SL-Avatar.png"},
  jz: {userId: 7, name: "JZ", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/JZ-Avatar.png"},
  trevor: {userId: 8, name: "Trevor", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/TJ-Avatar.png"},
  nic: {userId: 9, name: "Nic", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/NE-Avatar.png"},
  marco: {userId: 10, name: "Marco", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", url: "/avatars/MT-Avatar.png"}
};


function createAction(type, entityKey, entityId, payload) {
  return {type, entityKey, entityId, payload};
}

function createNameUpdatedAction(user) {
  return createAction("NAME_CAPTURED", "user", user.userId, {name: user.name});
}

function createAvatarUrlUpdatedAction(user) {
  return createAction("AVATAR_URL_CAPTURED", "user", user.userId, {avatarUrl: user.url});
}

function createPasswordUpdatedAction(user) {
  return createAction("PASSWORD_CAPTURED", "user", user.userId, {passwordHashed: user.passwordHashed});
}

const start = () => {
  const initialStateStream = Observable.from(Object.keys(userMap).map(k => userMap[k]));
  const nameUpdated =  initialStateStream.map(createNameUpdatedAction);
  const avatarUpdated =  initialStateStream.map(createAvatarUrlUpdatedAction);
  const passwordUpdated =  initialStateStream.map(createPasswordUpdatedAction);

  const stream = Observable.merge(
    nameUpdated,
    avatarUpdated,
    passwordUpdated
  );

  const createProducer = require('../../lib/createProducer');
  const {sendMessage} = createProducer({streamOptions: {topic: process.env.entityTopic}});

  setTimeout(() => {
    stream.subscribe(sendMessage, err => console.error(err));
  }, 100);
};

start();