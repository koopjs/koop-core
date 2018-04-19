const path = require('path')

/**
 * Compose route string based on inputs and options
 * @param {string} namespace - namespace for the route
 * @param {string} routePath - initial route pathfragment
 * @param {boolean} hosts - flag determining inclusion of :host in route
 * @param {boolean} disableIdParam - flag determining omission of :id in route (when hosts=false)
 */
function composeRouteString(namespace, routePath, hosts = false, disableIdParam = false) {
  let routeFragment
  // Build route fragment
  if (hosts) {
    routeFragment = path.posix.join(namespace, ':host', ':id')
  } else if (disableIdParam) {
    routeFragment = path.posix.join(namespace)
  } else {
    routeFragment = path.posix.join(namespace, ':id')
  }

  // routeFragment should replace the $providers$ substring if present in routePath, otherwise add as a prefix
  if (routePath.includes('$provider$')) return path.posix.join('/', routePath.replace('$provider$', routeFragment))
  return path.posix.join('/', routeFragment, routePath)
  
}
module.exports = { composeRouteString }