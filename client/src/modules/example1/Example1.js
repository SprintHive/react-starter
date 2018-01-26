import React from 'react'
import {compose, lifecycle, renderNothing, setDisplayName, withHandlers} from 'recompose'
import DateOfBirthInput from "../../components/dateOfBirthInput/DateOfBirthInput";
import FlexBox from "../../components/FlexBox";
import DisplayAge from "../../components/DisplayAge";
import {connect} from "react-redux";
import moment from "moment";
import {dateOfBirthCaptured} from "../../components/dateOfBirthInput/DateOfBirthActions";
import {DisplayPerson} from "../../components/displayPerson/DisplayPerson";
import {nonOptimalStates} from "../../hoc/nonOptimalStates";

const style = {
  container: {
    maxWidth: 300
  }
};

const dispatchSubscribeToEntity = ({entityKey, entityId}) => (
  {
    type: "SUBSCRIBE_TO_ENTITY",
    meta: {remote: true},
    payload: {entityKey, entityId}
  }
);

const dispatchUnSubscribeToEntity = ({entityKey, entityId}) => (
  {
    type: "UNSUBSCRIBE_FROM_ENTITY",
    meta: {remote: true},
    payload: {entityKey, entityId}
  }
);

const entityConnector = ({entityKey, entityId}) => {
  return compose(connect(state => {
      const props = {defaultDateOfBirth: ""};
      if (state.user.dateOfBirth) props.defaultDateOfBirth = moment(state.user.dateOfBirth).format('DD/MM/YYYY');
      props.entity = {entityKey, entityId, payload: state[`${entityKey}_${entityId}`] || {loading: true}};
      return props;
    }, {dateOfBirthCaptured, dispatchSubscribeToEntity, dispatchUnSubscribeToEntity})
  )
};

const withEntitySubscription = compose(
  lifecycle({
    componentWillMount() {
      const {entity, dispatchSubscribeToEntity} = this.props;
      const {entityKey, entityId} = entity;
      dispatchSubscribeToEntity({entityKey, entityId})
    },
    componentWillUnmount() {
      const {entity, dispatchUnSubscribeToEntity} = this.props;
      const {entityKey, entityId} = entity;
      dispatchUnSubscribeToEntity({entityKey, entityId});
    }
  })
);

const enhance = compose(
  setDisplayName('Example1'),
  entityConnector({entityKey: 'person', entityId: 2}),
  withEntitySubscription,
  withHandlers({
    done: ({dateOfBirthCaptured, entity}) => ({dateOfBirth}) => {
      const {entityId} = entity;
      dateOfBirthCaptured({dateOfBirth, entityId})
    }
  })
);

const loadingEntity = (props) => {
  return props.payload.loading;
};
const enhanceDisplayEntity = compose(
  setDisplayName('DisplayEntity'),
  nonOptimalStates([
    {when: loadingEntity, render: renderNothing()}
  ])
);
const DisplayEntity = enhanceDisplayEntity((props) => {
  return <DisplayPerson {...props.payload}/>
});

export const Example1 = ({defaultDateOfBirth, done, entity}) => {
  return (
    <FlexBox centered>
      <DisplayEntity {...entity}/>
      <FlexBox style={style.container} column item>
        <DateOfBirthInput {...{done, defaultDateOfBirth}}/>
        <DisplayAge age={entity.payload.age}/>
      </FlexBox>
    </FlexBox>
  )
};

export default enhance(Example1)