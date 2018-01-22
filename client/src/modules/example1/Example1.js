import React from 'react'
import {compose, setDisplayName} from 'recompose'
import DateOfBirthInput from "../../components/dateOfBirthInput/DateOfBirthInput";
import FlexBox from "../../components/FlexBox";
import DisplayAge from "../../components/DisplayAge";
import {connect} from "react-redux";
import moment from "moment";
import {dateOfBirthCaptured} from "../../components/dateOfBirthInput/DateOfBirthActions";

const mapStateToProps = (state) => {
  const props = {age: state.user.age, defaultDateOfBirth: undefined};
  if (state.user.dateOfBirth) props.defaultDateOfBirth = moment(state.user.dateOfBirth).format('DD/MM/YYYY');
  return props;
};

const enhance = compose(
  setDisplayName('Example1'),
  connect(mapStateToProps, {dateOfBirthCaptured})
);

export const Example1 = ({dateOfBirthCaptured, defaultDateOfBirth, age}) => {
  return (
    <FlexBox column>
      <DateOfBirthInput {...{dateOfBirthCaptured, defaultDateOfBirth}}/>
      <DisplayAge {...{age}}/>
    </FlexBox>
  )
};

export default enhance(Example1)