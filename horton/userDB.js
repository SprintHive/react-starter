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

module.exports.lookupUser = (username) => {
  return userMap[username.toLowerCase()];
};

module.exports.listUsers = () => {
  return Object.keys(userMap).map(k => userMap[k]);
};