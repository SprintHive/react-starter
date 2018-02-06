import React from 'react'
import {compose, renderNothing, setDisplayName, withHandlers, withProps} from 'recompose'
import DateOfBirthInput from "../../components/dateOfBirthInput/DateOfBirthInput";
import FlexBox from "../../components/FlexBox";
import DisplayAge from "../../components/DisplayAge";
import moment from "moment";
import {dateOfBirthCaptured} from "../../components/dateOfBirthInput/DateOfBirthActions";
import {DisplayPerson} from "../../components/displayPerson/DisplayPerson";
import {nonOptimalStates} from "../../hoc/nonOptimalStates";
import {withEntity} from "../../hoc/withEntity";

const style = {
  container: {
    maxWidth: 300
  }
};

const enhance = compose(
  setDisplayName('Example1'),
  withEntity({entityKey: "user", entityId: 2, actions: {dateOfBirthCaptured}}),
  withProps(props => {
    let defaultDateOfBirth = "";
    if (props.entity.payload && props.entity.payload.dateOfBirth) {
      defaultDateOfBirth = moment(props.entity.payload.dateOfBirth).format('DD/MM/YYYY');
    }
    return {defaultDateOfBirth}
  }),
  withHandlers({
    done: ({dateOfBirthCaptured, entity}) => ({dateOfBirth}) => {
      const {entityKey, entityId} = entity;
      dateOfBirthCaptured(entityKey, entityId, {dateOfBirth})
    }
  })
);

const loadingEntity = ({loading}) => loading;
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