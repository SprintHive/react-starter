import React from 'react'
import {compose, setDisplayName} from 'recompose'
import FlexBox from "../FlexBox";
import moment from "moment";

const style = {
  container: {
    maxWidth: 300
  },
  img: {
    height: 50
  }
};

const enhance = compose(
  setDisplayName('DisplayPerson')
);

const Avatar = ({url}) => <img style={style.img} src={url} alt="Profile Pic"/>;


export const DisplayPerson = ({userId, age, name, dateOfBirth, avatarUrl}) => {
  const dob = dateOfBirth
    ? moment(dateOfBirth).format('DD/MM/YYYY')
    : "Not set yet";

  return (
    <FlexBox style={style.container} column centered item>
      <FlexBox item>{userId}</FlexBox>
      <FlexBox item>{name}</FlexBox>
      <FlexBox item>{dob}</FlexBox>
      <FlexBox item>{age}</FlexBox>
      <FlexBox item><Avatar url={avatarUrl}/></FlexBox>
    </FlexBox>
  )
};

export default enhance(DisplayPerson);