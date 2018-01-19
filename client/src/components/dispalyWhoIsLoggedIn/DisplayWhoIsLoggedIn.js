import React from 'react';
import {compose, renderNothing, setDisplayName} from 'recompose';
import {connect} from "react-redux";
import {nonOptimalStates} from "../../hoc/nonOptimalStates";
import FlexBox from "../FlexBox";

const style = {
  container: {
    position: 'absolute',
    top: 10,
    left: 10
  },
  avatarContainer: {
    borderRadius: '50%',
    background: "#b3b3b3"
  },
  img: {
    height: 50
  },
  nameContainer: {
    fontSize: 25,
    marginLeft: 10
  }
};

const mapStateToProps = (state) => {
  return {loggedInUser: state.auth.user}
};

const noOneIsLoggedIn = ({loggedInUser}) => !loggedInUser;

const enhance = compose(
  setDisplayName('DisplayWhoIsLoggedIn'),
  connect(mapStateToProps),
  nonOptimalStates([
    {when: noOneIsLoggedIn, render: renderNothing()}
  ])
);

const Avatar = ({url}) => <img style={style.img} src={url} alt="Profile Pic"/>

export const DisplayWhoIsLoggedIn = ({loggedInUser}) => {

  return (
    <FlexBox style={style.container}>
      <FlexBox style={style.avatarContainer} item>
        <Avatar url={loggedInUser.url}/>
      </FlexBox>
      <FlexBox style={style.nameContainer} centered item>
        <span>{loggedInUser.name}</span>
      </FlexBox>
    </FlexBox>
  )
};

export default enhance(DisplayWhoIsLoggedIn);