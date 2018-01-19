import React from 'react'
import {compose, lifecycle, setDisplayName, withHandlers} from 'recompose'
import TeamGallery from "../../components/teamGallery/TeamGallery";
import {connect} from "react-redux";
import {nonOptimalStates} from "../../hoc/nonOptimalStates";

const dispatchLoginAttempted = user => (
  {
    type: "LOGIN_ATTEMPTED",
    meta: {remote: true},
    payload: user
  }
);

const dispatchTeamGalleryWillMount = () => (
  {
    type: "TEAM_GALLERY_WILL_MOUNT",
    meta: {remote: true}
  }
);

const loading = (props) => props.loading;
const showLoadingMessage = () => <h1>Loading...</h1>;

const mapStateToProps = (state) => {
  return {
    loading: state.teamGallery.loading,
    userList: state.teamGallery.userList
  }
};

const enhance = compose(
  setDisplayName('TeamGalleryContainer'),
  connect(mapStateToProps, {dispatchTeamGalleryWillMount, dispatchLoginAttempted}),
  lifecycle({
    componentWillMount() {
      this.props.dispatchTeamGalleryWillMount();
    }
  }),
  withHandlers({
    userSelected: ({dispatchLoginAttempted}) => user => {
      dispatchLoginAttempted(user);
    }
  }),
  nonOptimalStates([
    {when: loading, render: showLoadingMessage}
  ])
);

export const TeamGalleryContainer = (props) => <TeamGallery {...props}/>;

export default enhance(TeamGalleryContainer);