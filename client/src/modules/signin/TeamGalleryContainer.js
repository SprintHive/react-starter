import React from 'react'
import {compose, mapProps, setDisplayName, withHandlers, withProps} from 'recompose'
import TeamGallery from "../../components/teamGallery/TeamGallery";
import {nonOptimalStates} from "../../hoc/nonOptimalStates";
import {withEntity} from "../../hoc/withEntity";
import {Redirect} from "react-router-dom";
import {withLoggedInUser, someOneIsLoggedIn} from "../../hoc/withLoggedInUser";
import {connect} from "react-redux";
import {withUsers} from "./FakeUsers";

const dispatchLoginAttempted = user => (
  {
    type: "SIGN_IN_ATTEMPTED",
    payload: user
  }
);

const loading = (props) => props.loading;
const showLoadingMessage = () => <h1>Loading...</h1>;

const redirectToHome = () => {
  return <Redirect to="/"/>
};

const enhance = compose(
  setDisplayName('TeamGalleryContainer'),
  // withProps({entityKey: "user"}),
  // withEntity(),
  connect(null, {dispatchLoginAttempted}),
  withUsers,
  withLoggedInUser,
  nonOptimalStates([
    // {when: loading, render: showLoadingMessage},
    {when: someOneIsLoggedIn, render: redirectToHome}
  ]),
  withHandlers({
    userSelected: ({dispatchLoginAttempted}) => user => {
      user.password = 'password$123'; // fake the password
      dispatchLoginAttempted({user});
    }
  }),
/*
  mapProps((ownerProps) => {
    const {userSelected, entity} = ownerProps;
    // const {payload} = entity;
    const userList = Object.keys(payload).map(k => payload[k]);
    return {userList, userSelected};
  })
*/
);

export const TeamGalleryContainer = (props) => {
  console.log('**********', props)
  return <TeamGallery {...props}/>
};
export default enhance(TeamGalleryContainer);