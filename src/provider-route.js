const _ = require('lodash')
const Joi = require('@hapi/joi')
const routeJoiner = require('./helpers/route-joiner')

const METHODS_SCHEMA = Joi.array().items(Joi.string().valid('get', 'post', 'patch', 'put', 'delete', 'head').insensitive())

class ProviderRoute {
  static create (params) {
    const providerRoute = new ProviderRoute(params)
    providerRoute.addRouteToServer()
    return providerRoute
  }

  constructor (params) {
    Object.assign(this, params)
    this.validateHttpMethods(this.route.methods)
    this.validateController()
    this.routeController = this.controller[this.route.handler].bind(this.controller)
  }

  validateController () {
    const {
      route: {
        handler,
        path
      },
      controller
    } = this
    if (!controller[handler]) throw new Error(`Handler "${handler}" assigned to route "${path}" by the "${controller.namespace}" plugin is undefined for the Koop controller`)
  }

  validateHttpMethods () {
    const {
      route: {
        methods
      }
    } = this
    const result = METHODS_SCHEMA.validate(methods)
    if (result.error) throw new Error(`One or more route methods is not supported; ${result.error}`)
  }

  addRouteToServer () {
    this.path = this.getRoutePath()
    this.route.methods.forEach(method => {
      this.server[method.toLowerCase()](this.path, this.routeController)
    })
  }

  getRoutePath (path) {
    return routeJoiner(this.options.routePrefix, this.route.path)
  }
}


module.exports = ProviderRoute
