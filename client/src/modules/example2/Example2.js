import React from 'react'
import {compose, setDisplayName} from 'recompose'

const enhance = compose(
  setDisplayName('Example2')
);

export const Example2 = (props) => {
  return (
    <h1>Example2</h1>
  )
};

export default enhance(Example2);