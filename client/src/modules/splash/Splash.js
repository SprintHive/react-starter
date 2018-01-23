import React from 'react'
import {compose, lifecycle, setDisplayName, setPropTypes, withProps} from 'recompose'
import {Observable} from "rxjs";
import DisplayMessage from "../../components/displayMessage/DisplayMessage";
import PropTypes from "prop-types";

let dispose = undefined;

const potentialFunFacts = [
  {subTitle: "Did you know:", message: "Koala bears have 2 thumbs..."},
];

const showForAtLeastOneSecond = compose(
  lifecycle({
    componentDidMount() {
      const {updateTimeMounted} = this.props;
      dispose = Observable.interval(1000)
        .subscribe(() => {
          updateTimeMounted(Date.now());
        })
    },
    componentWillUnmount() {
      dispose && dispose.unsubscribe();
    }
  })
);

const enhance = compose(
  setDisplayName('Splash'),
  setPropTypes({
    updateTimeMounted: PropTypes.func.isRequired
  }),
  showForAtLeastOneSecond,
  withProps({funFact: potentialFunFacts[Math.floor(Math.random() * potentialFunFacts.length)]})
);

export const Splash = (props) => {
  return (
    <DisplayMessage message={props.funFact}/>
  )
};

export default enhance(Splash);