
const ProviderRoute = require('./provider-route')
const namespacedRoutePath = require('../helpers/namespaced-route-path')

class ProviderOutputRoute extends ProviderRoute {
  static create (params) {
    const providerRoute = new ProviderOutputRoute(params)
    providerRoute.addRouteToServer(params.server)
    return providerRoute
  }

  getRoutePath () {
    return namespacedRoutePath(this)
  }
}

module.exports = ProviderOutputRoute
