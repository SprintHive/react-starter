import React from 'react';
import {connect} from "react-redux";
import Button from "../../components/button/Button";
import {setDisplayName, withHandlers} from "recompose";
import compose from "redux/es/compose";
import FlexBox from "../../components/FlexBox";

export const CREATE_LEAD_ATTEMPTED = "CREATE_LEAD_ATTEMPTED";
const createLead = () => ({type: CREATE_LEAD_ATTEMPTED, entityKey: "lead"});

const style = {
  container: {
    width: 190,
    height: 40,
    cursor: 'pointer'
  }
};

const enhance = compose(
  setDisplayName('CreateLeadButton'),
  connect(null, {createLead}),
  withHandlers({
    onClick: ({createLead}) => e => {
      createLead();
    }
  })
);

export const CreateLeadButton = (props) => {
  return (
    <FlexBox item>
      <Button style={style.container} onClick={props.onClick}>Create a new Lead</Button>
    </FlexBox>
  )
};

export default enhance(CreateLeadButton);