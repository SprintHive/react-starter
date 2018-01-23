import {compose, setDisplayName, withState, lifecycle} from 'recompose'

const fadeIn = {
  opacity: 0,
  transitionProperty: "opacity",
  transitionDuration: "0.5s",
  transitionTimingFunction: "ease-in"
};

/**
 * A HOC which starts a component off with opacity 0 and then a second after the component has mounted
 * the opacity is updated to 1
 *
 * @see Header.js for an example
 */
export const withFadeIn = (config) => compose(
  setDisplayName('withFadeIn'),
  withState("fadeIn", "updateFadeIn", [fadeIn]),
  lifecycle({
    componentDidMount() {
      const {updateFadeIn} = this.props;
      const delay = (config && config.delay) || 1000;
      setTimeout(() => {
        updateFadeIn([fadeIn, {opacity: 1}]);
      }, delay)
    },
  })
);
