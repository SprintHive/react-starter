import React from 'react'
import {compose, mapProps, setDisplayName, withHandlers} from 'recompose'
import TeamGallery from "../../components/teamGallery/TeamGallery";
import {nonOptimalStates} from "../../hoc/nonOptimalStates";
import {withEntity} from "../../hoc/withEntity";
import {Redirect} from "react-router-dom";
import {withLoggedInUser} from "../../hoc/withLoggedInUser";

const dispatchLoginAttempted = user => (
  {
    type: "SIGN_IN_ATTEMPTED",
    meta: {remote: true},
    payload: user
  }
);

const loading = (props) => props.entity.loading;
const showLoadingMessage = () => <h1>Loading...</h1>;

const someOneIsLoggedIn = (props) => props.loggedInUser;
const redirectToHome = () => {
  console.log("************************** redirecting");
  return <Redirect to="/"/>
};

const enhance = compose(
  setDisplayName('TeamGalleryContainer'),
  withEntity({entityKey: "user", actions: {dispatchLoginAttempted}}),
  withLoggedInUser,
  nonOptimalStates([
    {when: loading, render: showLoadingMessage},
    {when: someOneIsLoggedIn, render: redirectToHome}
  ]),
  withHandlers({
    userSelected: ({dispatchLoginAttempted}) => user => {
      user.password = 'password$123'; // fake the password
      dispatchLoginAttempted({user});
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