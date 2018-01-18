import React from 'react'
import {compose, setDisplayName, withHandlers, withProps} from 'recompose'
import FlexBox from "../FlexBox";
import AvatarCard from "./AvatarCard";
import {connect} from "react-redux";

const dispatchLoginAttempted = user => (
  {
    type: "LOGIN_ATTEMPTED",
    meta: {remote: true},
    payload: user
  }
);

const enhance = compose(
  setDisplayName('TeamGallery'),
  connect(null, {dispatchLoginAttempted}),
  withProps({
    userList: [
      {name: "Dane", url: "/avatars/DB-Avatar.png"},
      {name: "Dirk", url: "/avatars/DLR-Avatar.png"},
      {name: "Dale", url: "/avatars/DT-Avatar.png"},
      {name: "Greg", url: "/avatars/GK-Avatar.png"},
      {name: "Jon", url: "/avatars/JLL-Avatar.png"},
      {name: "Sam", url: "/avatars/SL-Avatar.png"},
      {name: "JZ", url: "/avatars/JZ-Avatar.png"},
      {name: "Trevor", url: "/avatars/TJ-Avatar.png"},
      {name: "Marco", url: "/avatars/MT-Avatar.png"},
      {name: "Nic", url: "/avatars/NE-Avatar.png"}
    ]
  }),
  withHandlers({
    userSelected: ({dispatchLoginAttempted}) => user => {
      dispatchLoginAttempted(user);
    }
  })
);

export const TeamGallery = ({userList, userSelected}) => {
  const avatarList = userList.map((user) =>
    <AvatarCard key={user.name} {...{user, userSelected}}
                onClick={() => userSelected(user)}/>
  );

  return (
    <FlexBox wrap centered>
      {avatarList}
    </FlexBox>
  )
};

export default enhance(TeamGallery)