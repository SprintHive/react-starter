import React from 'react';
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

const enhance = compose(
  setDisplayName("DisplayAge"),
);

export default enhance(({age}) =>
  <FlexBox centered item>
    <div style={ageStyle}>
      Age: {age ? age : 0}
    </div>
  </FlexBox>
);
