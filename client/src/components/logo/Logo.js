import React from 'react'
import {compose, setDisplayName} from 'recompose'
import logo from './sprinthive-logo-white.png';
import FlexBox from "../FlexBox";

const style = {
  container: {
    background: '#191A1A'
    
  }
};

const enhance = compose(
  setDisplayName('Logo')
);

export const Logo = (props) => {
  return (
    <FlexBox centered style={style.container}>
      <img src={logo} alt="logo"/>
    </FlexBox>
  )
};

export default enhance(Logo);