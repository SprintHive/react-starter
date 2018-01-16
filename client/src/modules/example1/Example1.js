import React from 'react'
import {compose, setDisplayName} from 'recompose'
import DateOfBirthInput from "../../components/dateOfBirthInput/DateOfBirthInput";
import FlexBox from "../../components/FlexBox";
import DisplayAge from "../../components/DisplayAge";

const enhance = compose(
  setDisplayName('Example2')
);

export const Example2 = () => {
  return (
    <FlexBox column>
      <DateOfBirthInput/>
      <DisplayAge/>
    </FlexBox>
  )
};

export default enhance(Example2)