import React from 'react';
import {connect} from "react-redux";
import Button from "../../components/button/Button";
import {setDisplayName, withHandlers} from "recompose";
import compose from "redux/es/compose";
import FlexBox from "../../components/FlexBox";

export const CREATE_ENTITY_ATTEMPTED = "CREATE_ENTITY_ATTEMPTED";
const createLead = () => ({type: CREATE_ENTITY_ATTEMPTED, entityKey: "lead", meta: {remote: true}});

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