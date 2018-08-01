import React from 'react'
import {compose, setDisplayName} from 'recompose'
import FlexBox from "../components/FlexBox";
import LeadCard from "./LeadCard";


const enhance = compose(
  setDisplayName('LeadList')
);

export const LeadList = (props) => {
  return (
    <FlexBox column item>
      <LeadCard/>
      <LeadCard/>
      <LeadCard/>
      <LeadCard/>
      <LeadCard/>
    </FlexBox>
  )
};

export default enhance(LeadList);