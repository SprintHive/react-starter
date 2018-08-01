import {compose, withProps} from "recompose";

const userMap = {
  dale: {userId: 1, name: "Dale", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/DT-Avatar.png"},
  dirk: {userId: 2, name: "Dirk", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/DLR-Avatar.png"},
  greg: {userId: 3, name: "Greg", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/GK-Avatar.png"},
  jon: {userId: 4, name: "Jon", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/JLL-Avatar.png"},
  dane: {userId: 5, name: "Dane", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/DB-Avatar.png"},
  sam: {userId: 6, name: "Sam", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/SL-Avatar.png"},
  jz: {userId: 7, name: "JZ", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/JZ-Avatar.png"},
  trevor: {userId: 8, name: "Trevor", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/TJ-Avatar.png"},
  nic: {userId: 9, name: "Nic", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/NE-Avatar.png"},
  marco: {userId: 10, name: "Marco", passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje", avatarUrl: "/avatars/MT-Avatar.png"}
};

export const withUsers = withProps(() => ({userList: Object.keys(userMap).map(k => userMap[k])}));