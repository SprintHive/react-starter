import React from 'react'
import {compose, lifecycle, setDisplayName} from 'recompose'

const enhance = compose(
  setDisplayName('Splash'),
  lifecycle({
    componentWillMount() {
      console.log(this.props);
      setTimeout(() => this.props.updateSplash(false), 2000)
    }
  })
);

export const Splash = (props) => {
  return (
    <h1>Splash</h1>
  )
};

export default enhance(Splash);