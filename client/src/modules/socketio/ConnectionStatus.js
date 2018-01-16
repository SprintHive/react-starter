import React from 'react'
import {connect} from 'react-redux';
import {compose, setDisplayName} from 'recompose';
import Radium from 'radium'

const style = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  margin: 10,
  padding: 5,
  fontSize: 12,
  zIndex: 1
};


const mapToProps = (state) => {
  return {...state.connection}
};

const enhance = compose(
  setDisplayName('ConnectionStatus'),
  connect(mapToProps),
  Radium
);

export const ConnectionStatus = ({status}) => {
  const color = status === 'Connected' ? '#529464' : '#b40615';
  return (
    <div style={[style, {color}]}>{status}</div>
  )
};

export default enhance(ConnectionStatus)