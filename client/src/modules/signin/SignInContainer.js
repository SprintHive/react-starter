import React from 'react'
import {compose, setDisplayName} from 'recompose'
import FlexBox from "../../components/FlexBox";
import TeamGalleryContainer from "./TeamGalleryContainer";

const enhance = compose(
  setDisplayName('SignInContainer')
);

export const SignInContainer = (props) => {
  return (
    <FlexBox centered>
      <TeamGalleryContainer/>
    </FlexBox>
  )
};

export default enhance(SignInContainer);