const _ = require('lodash')
const createController = require('./create-controller')
const ExtendedModel = require('./extended-model')
const ProviderRoute = require('./provider-route')
const ProviderOutputRoute = require('./provider-output-route')
const consolePrinting = require('../helpers/console-printing')

module.exports = class Provider {
  static create (params) {
    const provider = new Provider(params)
    provider.registerRoutes(params.koop.server)
    consolePrinting(provider)
    return provider
  }

  constructor (params) {
    const {
      provider,
      koop,
      options = {}
    } = params

    this.options = { ...options, ..._.pick(provider, 'hosts', 'disableIdParam') }
    this.registerOutputRoutesFirst = _.get(options, 'defaultToOutputRoutes', false).toString() === 'true'
    this.namespace = getProviderName(provider, options)
    this.outputRouteNamespace = this.namespace.replace(/\s/g, '').toLowerCase()
    this.model = new ExtendedModel({ ProviderModel: provider.Model, koop }, options)
    this.routes = provider.routes || []
    this.registeredOutputs = []
    this.outputs = koop.outputs.map(Output => {
      return createController(Output, this.model)
    })
    this.controller = createController(provider.Controller, this.model)
  }

  registerRoutes (server) {
    if (this.registerOutputRoutesFirst) {
      this.registerOutputPluginRoutes(server)
      this.registerProviderDefinedRoutes(server)
    } else {
      this.registerProviderDefinedRoutes(server)
      this.registerOutputPluginRoutes(server)
    }
  }

  registerOutputPluginRoutes (server) {
    const params = {
      ...this,
      ...this.options,
      namespace: this.outputRouteNamespace,
      server
    }
    this.registeredOutputs = this.outputs.map(output => {
      const routes = output.routes.map(route => {
        return ProviderOutputRoute.create({ ...params, controller: output, route })
      })
      return { namespace: output.namespace, routes }
    })
  }

  registerProviderDefinedRoutes (server) {
    const params = {
      ...this,
      ...this.options,
      server
    }
    this.registeredProviderRoutes = this.routes.map(route => {
      return ProviderRoute.create({ ...params, controller: this.controller, route })
    })
  }

  logRoutes () {
    this.registeredOutputs.forEach(route => {
      console.log(route)
    })
  }
}

function getProviderName (provider, options) {
  return options.name || provider.namespace || provider.pluginName || provider.plugin_name || provider.name
}
