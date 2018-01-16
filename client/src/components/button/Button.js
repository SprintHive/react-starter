import React from 'react'
import {compose, setDisplayName} from 'recompose'
import Radium from 'radium'

import {addStyle} from '../../hoc/addStyle'

export const buttonStyle = {
  base: {
    backgroundColor: 'transparent',
    border: '2px solid #db7400',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    outline: 'none',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
    fontSize: '100%',
    color: '#db7400',
    ':hover': {
      color: '#ff8700',
      border: '2px solid #ff8700',
      cursor: 'pointer'

    }
  },
  tiny: {
    fontSize: 12,
  }
};

const enhance = compose(
  addStyle(buttonStyle.base),
  setDisplayName('Button'),
  Radium
);

export default enhance(({style, size, children, onClick}) => {
  return (
    <button style={[
      style,
      size && buttonStyle[size]
    ]} onClick={onClick}>{children}</button>
  )
});