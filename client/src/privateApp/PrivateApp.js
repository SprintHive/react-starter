import React from 'react'
import {compose, renderNothing, setDisplayName} from 'recompose'
import {nonOptimalStates} from "../hoc/nonOptimalStates";
import {withLoggedInUser, noUserIsLoggedIn} from "../hoc/withLoggedInUser";
import FlexBox from "../components/FlexBox";
import LeadList from "./LeadList";

const enhance = compose(
  setDisplayName('PrivateApp'),
  withLoggedInUser,
  nonOptimalStates([{when: noUserIsLoggedIn, render: renderNothing}])
);

export const PrivateApp = (props) => {
  return (
    <FlexBox centered>
      <FlexBox column flexGrow centered>
        <h1>In progress</h1>
        <LeadList/>
      </FlexBox>
      <FlexBox column flexGrow centered>
        <h1>Accepted</h1>
        <LeadList/>
      </FlexBox>
      <FlexBox column flexGrow centered>
        <h1>Rejected</h1>
        <LeadList/>
      </FlexBox>
    </FlexBox>
  )
};

export default enhance(PrivateApp);