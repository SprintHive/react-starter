import React from 'react'
import {compose, lifecycle, setDisplayName} from 'recompose'
import FlexBox from "../../components/FlexBox";
import {connect} from "react-redux";
import {dispatchSubscribeToEntity, dispatchUnSubscribeToEntity} from '../../hoc/withEntity';


const styles = {
  rightColumn: {
    // minWith: 330,
    marginLeft: 20
  }
};

const enhance = compose(
  setDisplayName('DisplayLead'),
  connect(),
  lifecycle({
    componentWillMount() {
      const {leadId, dispatch} = this.props;
      dispatch(dispatchSubscribeToEntity({entityKey: 'lead', entityId: leadId}));
    },
    componentWillUnmount() {
      const {leadId, dispatch} = this.props;
      dispatch(dispatchUnSubscribeToEntity({entityKey: 'lead', entityId: leadId}));
    }
  })
);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const DisplayLead = (props) => {
  const {style, leadId, dateOfBirth, age, leadEvaluation} = props;

  const status = (leadEvaluation && leadEvaluation.evaluationCode) || "in progress";

  return (
    <FlexBox style={style} column>
      <FlexBox item>

        {/*Left Column*/}
        <FlexBox item column>
          <FlexBox item>Reference Number</FlexBox>
          <FlexBox item>Date of birth</FlexBox>
          <FlexBox item>Age</FlexBox>
          <FlexBox item>Evaluation status</FlexBox>
        </FlexBox>

        {/*Right Column*/}
        <FlexBox style={styles.rightColumn} column item>
          <FlexBox item><span style={{whiteSpace: 'nowrap'}}>{leadId}</span></FlexBox>
          <FlexBox item>{dateOfBirth}</FlexBox>
          <FlexBox item>{age}</FlexBox>
          <FlexBox item>{capitalizeFirstLetter(status)}</FlexBox>
        </FlexBox>
      </FlexBox>

    </FlexBox>
  )
};

export default enhance(DisplayLead);