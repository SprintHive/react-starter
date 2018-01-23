import React from 'react'
import {compose, setDisplayName} from 'recompose'
import FlexBox from "../FlexBox";
import {withFadeIn} from "../../hoc/withFadeIn";

const messageStyle = {
  height: '100%',
  color: '#c1c1c1'
};

const containerStyle = {
  height: '100vh'
};

const styles = {
  subTitle: {
    fontSize: 18,
    color: '#db7400',
    marginBottom: 10
  }
};

const enhance = compose(
  setDisplayName('DisplayMessage'),
  withFadeIn()
);

export const DisplayMessage = ({fadeIn, message}) => {
  return (
    <FlexBox style={[containerStyle, fadeIn]} column centered>
      <FlexBox item centered>
        <FlexBox item column>
          <div style={styles.subTitle}>{message.subTitle}</div>
          <span style={messageStyle}>{message.message}</span>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

export default enhance(DisplayMessage);