import React from 'react'
import {compose, setDisplayName} from 'recompose'

const enhance = compose(
  setDisplayName('PrivateApp')
);

export const PrivateApp = (props) => {
  return (
    <h1>PrivateApp</h1>
  )
};

export default enhance(PrivateApp);