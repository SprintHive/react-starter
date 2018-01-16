import React from 'react';
import {connect} from 'react-redux';
import {compose, setDisplayName} from 'recompose';
import FlexBox from "./FlexBox";

const ageStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  paddingTop: 15,
  paddingBottom: 15,
  textAlign: 'center',
  minWidth: 300,
  fontSize: '200%',
  color: '#c1c1c1'
};

const mapStateToProps = (state) => {
  console.log('Mapping State to Props', state);
  return {age: state.user.age};
};

const enhance = compose(
  setDisplayName("idNumberInput"),
  connect(mapStateToProps)
);

export default enhance(({age}) =>
  <FlexBox centered item>
    <div style={ageStyle}>
      Age: {age}
    </div>
  </FlexBox>
);
