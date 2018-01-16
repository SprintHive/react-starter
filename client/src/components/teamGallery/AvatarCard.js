import React from 'react'
import {compose, setDisplayName} from 'recompose'
import FlexBox from "../FlexBox";

const styles = {
  card: {
    cursor: 'pointer',
    maxWidth: 300,
    maxHeight: 300
  }
};

const enhance = compose(
  setDisplayName('AvatarCard')
);

export const AvatarCard = ({user, onClick}) => {
  return (
    <FlexBox style={styles.card} column center item>
      <img src={user.url} alt="" onClick={onClick}/>
    </FlexBox>
  )
};

export default enhance(AvatarCard);