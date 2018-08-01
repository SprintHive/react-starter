import React from 'react'
import {compose, setDisplayName} from 'recompose'
import FlexBox from "../components/FlexBox";

const cardStyle = {
  container: {marginBottom: 5}
};

const enhance = compose(
  setDisplayName('LeadCard')
);

export const LeadCard = (props) => {
  return (
    <FlexBox style={cardStyle.container} item column>
      <FlexBox><span>2a93-343ld9-3434339... (5m ago)</span></FlexBox>
    </FlexBox>
  )
};

export default enhance(LeadCard);