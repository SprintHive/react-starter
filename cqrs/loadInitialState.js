const {Observable} = require('rxjs');

const userMap = {
  dale: {userId: 1, name: "Dale", url: "/avatars/DT-Avatar.png"},
  dirk: {userId: 2, name: "Dirk", url: "/avatars/DLR-Avatar.png"},
  greg: {userId: 3, name: "Greg", url: "/avatars/GK-Avatar.png"},
  jon: {userId: 4, name: "Jon", url: "/avatars/JLL-Avatar.png"},
  dane: {userId: 5, name: "Dane", url: "/avatars/DB-Avatar.png"},
  sam: {userId: 6, name: "Sam", url: "/avatars/SL-Avatar.png"},
  jz: {userId: 7, name: "JZ", url: "/avatars/JZ-Avatar.png"},
  trevor: {userId: 8, name: "Trevor", url: "/avatars/TJ-Avatar.png"},
  nic: {userId: 9, name: "Nic", url: "/avatars/NE-Avatar.png"},
  marco: {userId: 10, name: "Marco", url: "/avatars/MT-Avatar.png"}
};


function createAction(type, entityKey, entityId, payload) {
  return {type, entityKey, entityId, payload};
}

function createNameUpdatedAction(user) {
  return createAction("NAME_CAPTURED", "person", user.userId, {name: user.name});
}

function createAvatarUrlUpdatedAction(user) {
  return createAction("AVATAR_URL_CAPTURED", "person", user.userId, {avatarUrl: user.url});
}

module.exports = () => {
  const initialStateStream = Observable.from(Object.keys(userMap).map(k => userMap[k]));
  const nameUpdated =  initialStateStream.map(createNameUpdatedAction);
  const avatarUpdated =  initialStateStream.map(createAvatarUrlUpdatedAction);

  const stream = Observable.merge(
    nameUpdated,
    avatarUpdated
  );

  // stream.subscribe(a => console.log(a), err => console.error(err));

  const brokers = 'kafka://127.0.0.1:9092';
  const opts = {brokers};
  const KafkaObservable = require('kafka-observable')(opts);
  const producer = KafkaObservable.toTopic('event-stream', stream);
  producer.subscribe(message => console.info(message), err => console.error(err));
};