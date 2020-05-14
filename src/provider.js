const _ = require('lodash')
const createController = require('./create-controller')
const ExtendedModel = require('./extended-model')
const ProviderRoute = require('./provider-route')
const ProviderOutputRoute = require('./provider-output-route')

class DefaultController {}

module.exports = class Provider {
  static create (params) {
    const provider = new Provider(params)
    provider.registerRoutes()
    return provider
  }

  constructor (params) {
    const {
      provider,
      koop,
      options = {}
    } = params

    // Object.assign(this, provider)
    this.server = koop.server
    this.options = { ...options, ..._.pick(provider, 'hosts', 'disableIdParam') }
    this.registerOutputRoutesFirst = _.get(options, 'defaultToOutputRoutes', false).toString() === 'true'
    this.namespace = getProviderName(provider, options)
    this.outputRouteNamespace = this.namespace.replace(/\s/g, '').toLowerCase()
    this.model = new ExtendedModel({ ProviderModel: provider.Model, koop }, options)
    this.routes = provider.routes || []
    this.outputRoutes = []
    this.outputs = koop.outputs.map(Output => {
      return createController(Output, this.model)
    })
    this.controller = createController(provider.Controller, this.model)
  }

  registerRoutes () {
    if (this.registerOutputRoutesFirst) {
      this.registerOutputPluginRoutes()
      this.registerProviderDefinedRoutes()
    } else {
      this.registerProviderDefinedRoutes()
      this.registerOutputPluginRoutes()
    }
  }

  registerOutputPluginRoutes () {
    const params = {
      ...this.options,
      namespace: this.outputRouteNamespace,
      server: this.server
    }
    this.outputRoutes = this.outputs.map(output => {
      const routes = output.routes.map(route => {
        return ProviderOutputRoute.create({ ...params, controller: output, route })
      })
      return { namespace: output.namespace, routes }
    })
  }

  registerProviderDefinedRoutes () {
    this.providerDefinedRoutes = this.routes.map(route => {
      return ProviderRoute.create({ ...this, controller: this.controller, route, namespace: '' })
    })
  }

  logRoutes () {
    this.outputRoutes.forEach(route => {
      console.log(route)
    })
  }
}

function addMethodsToRouteMap (map, path, methods) {
  const existingMethods = _.get(map, path, [])
  _.set(map, path, _.concat(existingMethods, methods))
}

function getProviderName (provider, options) {
  return options.name || provider.namespace || provider.pluginName || provider.plugin_name || provider.name
}
