import { inject, observer } from "mobx-react";
import {compose} from 'recompose'

/**
 * A HOC which injects the mobx store into a component, the store is available as props.store
 */
export const withStore = compose(
  inject('store'),
  observer
)