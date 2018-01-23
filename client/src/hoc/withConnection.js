import {compose, setDisplayName, withState} from "recompose";
import {connect} from "react-redux";
import {nonOptimalStates} from "./nonOptimalStates";
import Splash from "../modules/splash/Splash";

const connecting = ({timeConnected, timeMounted}) => {
  const min = Math.min(timeConnected, timeMounted);
  const max = Math.max(timeConnected, timeMounted);
  const duration = max - min;
  return isNaN(duration) || duration <= 2000;
};

const mapToProps = (state) => {
  return {
    status: state.connection.status,
    timeConnected: state.connection.timeConnected,
  }
};

export const withConnection = compose(
  setDisplayName("withConnection"),
  connect(mapToProps),
  withState("timeMounted", "updateTimeMounted", undefined),
  nonOptimalStates([
    {when: connecting, render: Splash}
  ])
);