import {mapProps} from 'recompose'

export const addStyle = style => mapProps(props => {
  return {...props, style: [style, props.style]}
});