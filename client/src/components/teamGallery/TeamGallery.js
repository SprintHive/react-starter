import React from 'react'
import {compose, setDisplayName, setPropTypes} from 'recompose'
import FlexBox from "../FlexBox";
import AvatarCard from "./AvatarCard";
import PropTypes from "prop-types";

const enhance = compose(
  setDisplayName('TeamGallery'),
  setPropTypes({
    userSelected: PropTypes.func.isRequired,
    userList: PropTypes.array
  })
);

export const TeamGallery = ({userList = [], userSelected}) => {

  console.log(userList)
  const avatarList = userList && userList.map((user) =>
    <AvatarCard key={user.name}
                {...{user, userSelected}}
                onClick={() => userSelected(user)}/>
  );

  return (
    <FlexBox wrap centered>
      {avatarList}
    </FlexBox>
  )
};

export default enhance(TeamGallery)