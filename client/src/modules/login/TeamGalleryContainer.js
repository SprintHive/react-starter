import React from 'react'
import {compose, mapProps, setDisplayName, withHandlers} from 'recompose'
import TeamGallery from "../../components/teamGallery/TeamGallery";
import {nonOptimalStates} from "../../hoc/nonOptimalStates";
import {withEntity} from "../../hoc/withEntity";

const dispatchLoginAttempted = user => (
  {
    type: "LOGIN_ATTEMPTED",
    meta: {remote: true},
    payload: user
  }
);

const loading = (props) => props.entity.loading;
const showLoadingMessage = () => <h1>Loading...</h1>;

const enhance = compose(
  setDisplayName('TeamGalleryContainer'),
  withEntity({entityKey: "user", actions: {dispatchLoginAttempted}}),
  nonOptimalStates([
    {when: loading, render: showLoadingMessage}
  ]),
  withHandlers({
    userSelected: ({dispatchLoginAttempted}) => user => {
      dispatchLoginAttempted(user);
    }
  }),
  mapProps((ownerProps) => {
    const {userSelected, entity} = ownerProps;
    const {payload} = entity;
    const userList = Object.keys(payload).map(k => payload[k]);
    return {userList, userSelected};
  })
);

export const TeamGalleryContainer = (props) => <TeamGallery {...props}/>;

export default enhance(TeamGalleryContainer);