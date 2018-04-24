const path = require('path')

/**
 * Compose route string based on inputs and options
 * @param {string} routePath - initial route pathfragment
 * @param {string} namespace - namespace for the route
 * @param {object} options - options object with decoration flags
 */
function composeRouteString(routePath, namespace, opts) {
  let options = opts || {}
  let modifiedPath
  let paramFragment = ''

  // No compostion needed if flagged as an absolute route
  if(options.absolutePath) return path.posix.join('/', routePath)

  // Build parameterized route fragment based on provider options
  if (options.hosts) paramFragment = path.posix.join(':host', ':id')
  else if (!options.disableIdParam) paramFragment = path.posix.join(':id')

  // Replace placehold substrings if present, fallback to namespace/:host/:id
  if (routePath.includes('$namespace$') && routePath.includes('$providerParams$')) {
    return path.posix.join('/', routePath.replace('$namespace$', namespace).replace('$providerParams$', paramFragment))
  } else if (routePath.includes('$namespace$')) {
    return path.posix.join('/', routePath.replace('$namespace$', path.posix.join(namespace, paramFragment)))
  } else {
    return path.posix.join('/', namespace, paramFragment, routePath)
  }
}
module.exports = { composeRouteString }