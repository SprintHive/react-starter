const userMap = {
  dale: {userId: 1, name: "Dale", url: "/avatars/dt-avatar.png"},
  dirk: {userId: 2, name: "Dirk", url: "/avatars/dlr-avatar.png"},
  greg: {userId: 3, name: "Greg", url: "/avatars/gk-avatar.png"},
  jon: {userId: 4, name: "Jon", url: "/avatars/jll-avatar.png"},
  dane: {userId: 5, name: "Dane", url: "/avatars/db-avatar.png"},
  sam: {userId: 6, name: "Sam", url: "/avatars/sl-avatar.png"},
  jz: {userId: 7, name: "JZ", url: "/avatars/jz-avatar.png"},
  trevor: {userId: 8, name: "Trevor", url: "/avatars/tj-avatar.png"},
  nic: {userId: 9, name: "Nic", url: "/avatars/ne-avatar.png"},
  marco: {userId: 10, name: "Marco", url: "/avatars/mt-avatar.png"}
};

module.exports.lookupUser = (username) => {
  return userMap[username.toLowerCase()];
};