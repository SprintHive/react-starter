import React from 'react'
import {compose, setDisplayName} from 'recompose'
import CreateLeadButton from '../../publicApp/leads/CreateLeadButton';
import {connect} from "react-redux";

const enhance = compose(
  setDisplayName('Example2'),
  connect((state) => {

  })
);

export const Example2 = (props) => {

  return (
    <CreateLeadButton/>
  )
};

export default enhance(Example2);