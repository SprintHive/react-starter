import {compose, mapProps, branch as when, renderNothing} from 'recompose'

import {withStore} from '../hoc/withStore'
import {isUserRoleAtLeast} from '../Security'

const userDoesNotHavePermission = ({userRole, requiredRole}) => !isUserRoleAtLeast(userRole, requiredRole)

/**
 * A HOC which renders nothing if the logged in user does not have enough permission.
 * @see JobSelection.js for an example of how to use this.
 * @param requiredRole can be ADMIN || OPS
 */
export const withUserRole = (requiredRole) => {
  return compose(
    withStore,
    mapProps(({store}) => ({userRole: store.login.user.role, requiredRole })),
    when(userDoesNotHavePermission, renderNothing)
  )
}
