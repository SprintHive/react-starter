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
      {name: "Dane", url: "/avatars/db-avatar.png"},
      {name: "Dirk", url: "/avatars/dlr-avatar.png"},
      {name: "Dale", url: "/avatars/dt-avatar.png"},
      {name: "Greg", url: "/avatars/gk-avatar.png"},
      {name: "Jon", url: "/avatars/jll-avatar.png"},
      {name: "Sam", url: "/avatars/sl-avatar.png"},
      {name: "JZ", url: "/avatars/jz-avatar.png"},
      {name: "Trevor", url: "/avatars/tj-avatar.png"},
      {name: "Marco", url: "/avatars/mt-avatar.png"},
      {name: "Nic", url: "/avatars/ne-avatar.png"}
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