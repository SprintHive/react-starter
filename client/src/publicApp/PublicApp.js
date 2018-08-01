import React from 'react'
import {compose, renderNothing, setDisplayName} from 'recompose'
import FlexBox from "../components/FlexBox";
import CaptureLead from "./leads/CaptureLead";
import {nonOptimalStates} from "../hoc/nonOptimalStates";
import {withLoggedInUser, someOneIsLoggedIn} from "../hoc/withLoggedInUser";

const styles = {
  containerStyle: {
    height: 'calc(100vh-500px)'
  }
};

const enhance = compose(
  setDisplayName('PublicApp'),
  withLoggedInUser,
  nonOptimalStates([
    {when: someOneIsLoggedIn, render: renderNothing}])
);

export const PublicApp = () => {
  return (
    <FlexBox style={[styles.containerStyle]} column centered>
      <CaptureLead/>
    </FlexBox>
  )
};

export default enhance(PublicApp);