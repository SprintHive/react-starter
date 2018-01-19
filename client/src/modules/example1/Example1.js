import React from 'react'
import {compose, setDisplayName} from 'recompose'
import DateOfBirthInput from "../../components/dateOfBirthInput/DateOfBirthInput";
import FlexBox from "../../components/FlexBox";
import DisplayAge from "../../components/DisplayAge";
import {connect} from "react-redux";
import moment from "moment";
import {dateOfBirthCaptured} from "../../components/dateOfBirthInput/DateOfBirthActions";

const mapStateToProps = (state) => {
  if (state.user.dateOfBirth) {
    return {defaultDateOfBirth: moment(state.user.dateOfBirth).format('DD/MM/YYYY')}
  } else {
    return {defaultDateOfBirth: undefined}
  }
};

const enhance = compose(
  setDisplayName('Example1'),
  connect(mapStateToProps, {dateOfBirthCaptured})
);

export const Example1 = ({dateOfBirthCaptured, defaultDateOfBirth}) => {
  return (
    <FlexBox column>
      <DateOfBirthInput {...{dateOfBirthCaptured, defaultDateOfBirth}}/>
      <DisplayAge/>
    </FlexBox>
  )
};

export default enhance(Example1)