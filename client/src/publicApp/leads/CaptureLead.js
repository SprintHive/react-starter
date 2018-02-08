import React from 'react'
import {compose, setDisplayName} from 'recompose'

const enhance = compose(
  setDisplayName('CaptureLead')
);

export const CaptureLead = (props) => {
  return (
    <h1>CaptureLead</h1>
  )
};

export default enhance(CaptureLead);