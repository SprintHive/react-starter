import React from 'react'
import {compose, setDisplayName, withHandlers} from 'recompose'
import {connect} from "react-redux";
import CreateLeadButton from "./CreateLeadButton";
import {nonOptimalStates} from "../../hoc/nonOptimalStates";
import FlexBox from "../../components/FlexBox";
import DateOfBirthInput from "../../components/dateOfBirthInput/DateOfBirthInput";
// import DisplayLead from "./DisplayLead";
import moment from 'moment';
import DisplayLead from "./DisplayLead";

function dateOfBirthCaptured(payload) {
  return {
    type: "DATE_OF_BIRTH_CAPTURED",
    payload
  }
}

const noLeadCreated = (props) => {
  return props.lead === null || props.lead === undefined;
};

const showCreateLeadButton = (props) => {
  return <CreateLeadButton/>
};

const enhance = compose(
  setDisplayName('CaptureLead'),
  connect((state) => {
    return {...state.captureLead};
  }, {dateOfBirthCaptured}),
  nonOptimalStates([
    {when: noLeadCreated, render: showCreateLeadButton}
  ]),
  withHandlers({
    done: ({dateOfBirthCaptured, lead}) => ({dateOfBirth}) => {
      console.log("Done", dateOfBirth, lead);
      const {leadId} = lead;
      if (leadId) {
        dateOfBirthCaptured({leadId, dateOfBirth});
      }
    }
  })
);

export const CaptureLead = (props) => {
  const dob = props.lead.dateOfBirth;
  const defaultDateOfBirth = (dob && moment(dob, 'YYYY-MM-DD')) || "";
  const age = props.lead.age || 0;
  const {done, lead} = props;
  const {leadId, dateOfBirth, leadEvaluation} = lead;
  return (
    <FlexBox column>
      <DateOfBirthInput {...{done, defaultDateOfBirth}}/>
      <DisplayLead {...{leadId, dateOfBirth, age, leadEvaluation}} style={{marginTop: 20}}/>
    </FlexBox>
  )
};

export default enhance(CaptureLead);