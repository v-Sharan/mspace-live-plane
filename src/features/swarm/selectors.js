// coverage: 500,
//   gridSpacing: 50,
//   Direction: 'Anti ClockWise Direction', ..
//   groups: [],
//   addedUavs_ids: [],
//   skip_waypoint: 0, ..
//   radius:0, ..
//   speed:18, ..
/**
 * Returns the current value of skip_waypoint.
 *
 * @param  {Object}  state  the state of the application
 */
export const getSkipWaypoint = (state) => state.socket.skip_waypoint

export const getDirection = (state) => state.socket.Direction

export const getRadius = (state) => state.socket.radius

export const getSpeed = (state) => state.socket.speed

export const getGrisSpacing = (state) => state.socket.gridSpacing

export const getCoverage = state => state.socket.coverage

