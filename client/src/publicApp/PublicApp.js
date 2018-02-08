import React from 'react'
import {compose, setDisplayName} from 'recompose'
import FlexBox from "../components/FlexBox";
import CreateLeadButton from "./leads/CreateLeadButton";

const styles = {
  containerStyle: {
    height: 'calc(100vh-500px)'
  }
};

const enhance = compose(
  setDisplayName('PublicApp')
);

export const PublicApp = () => {
  return (
    <FlexBox style={[styles.containerStyle]} column centered>
      <CreateLeadButton/>
    </FlexBox>
  )
};

export default enhance(PublicApp);