import {compose, branch, renderComponent} from 'recompose'

export const nonOptimalStates = (states) =>
  compose(...states.map(s =>
    branch(s.when, renderComponent(s.render))
  ));
