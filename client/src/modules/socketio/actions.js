export const SOCKET_CONNECTION_STATUS_CHANGED_ACTION = "SOCKET_CONNECTION_STATUS_CHANGED_ACTION";
export function socketConnectionStatusChanged(payload) {
  return {
    type: SOCKET_CONNECTION_STATUS_CHANGED_ACTION,
    payload
  }
}

