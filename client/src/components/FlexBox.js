import React from 'react'
import { compose, setDisplayName } from 'recompose'
import Radium from 'radium'

import { addStyle } from '../hoc/addStyle'

export const flexStyle = {
  base: {
    display: 'flex'
  },
  flexDirectionColumn: {
    flexDirection: 'column'
  },
  flexWrap: {
    flexWrap: 'wrap'
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexItem: {
    flex: 1
  }
};

const enhance = compose(
  addStyle(flexStyle.base),
  setDisplayName('FlexBox'),
  Radium,
);

const FlexBox = enhance(({style, column, centered, wrap, item, children}) =>
  <div style={[
    column && flexStyle.flexDirectionColumn,
    centered && flexStyle.centered,
    wrap && flexStyle.flexWrap,
    item && flexStyle.flexItem,
    style
  ]}>
    {children}
  </div>
);

export default FlexBox;