const path = require('path')

/**
 * Compose route string based on inputs and options
 * @param {string} namespace - namespace for the route
 * @param {string} routePath - initial route pathfragment
 * @param {object} options - options object with decoration flags
 */
function composeRouteString(routePath, namespace, opts) {
  let options = opts || {}
  let routeFragment

  if(options.skipDecoration) return path.posix.join('/', routePath)
  // Build route fragment
  if (options.hosts) {
    routeFragment = path.posix.join(namespace, ':host', ':id')
  } else if (options.disableIdParam) {
    routeFragment = path.posix.join(namespace)
  } else {
    routeFragment = path.posix.join(namespace, ':id')
  }

  // routeFragment should replace the $providers$ substring if present in routePath, otherwise add as a prefix
  if (routePath.includes('$provider$')) return path.posix.join('/', routePath.replace('$provider$', routeFragment))
  return path.posix.join('/', routeFragment, routePath)
  
}
module.exports = { composeRouteString }