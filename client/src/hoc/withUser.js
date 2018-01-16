import React from 'react'
import { withRouter, Redirect } from "react-router-dom";
import {compose, branch, renderComponent} from 'recompose'

import {withStore} from './withStore'

import debug from 'debug'
const log = debug('brandseye:peaches:withUser')

/**
 * A HOC which renders the BootLoader if there is no user logged in yet.
 * This can happen when a user navigates directly to peaches without going to jelly first.
 *
 * We will try and login the user in using the breadTicketStub in local storage,
 * take a look at the LoginStore for details.
 *
 * Usage:
 * import { withUser } from './hoc/withUser'
 */
const RedirectToBootLoader = (props) => {
  log('RedirectToBootLoader')
  return (
    <Redirect
      to={{
        pathname: "/bootloader",
        state: { from: props.location }
      }}
    />
  )
}

const noUserLoggedIn = (props) => {
  // We need to handle the case when the app starts with /bootloader,
  // we don't want to redirect to where we are going anyway cause this cause the bootloader mount twice
  // This will happen when the user is routed here from jelly
  const startedWithBootLoader = props.location
    && props.location.pathname
    && props.location.pathname.indexOf('/bootloader') === 0

  return !startedWithBootLoader && props.store.login.user === undefined
}

export const withUser = compose(
  withRouter,
  withStore,
  branch(noUserLoggedIn, renderComponent(RedirectToBootLoader))
)

