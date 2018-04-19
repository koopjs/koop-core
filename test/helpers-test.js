var helpers = require('../src/helpers')
const should = require('should') // eslint-disable-line

describe('Tests for helper functions', function () {
  describe('Tests for composeRouteString', function () {
    it('create route with :host and :id parameter', function () {
      let fullRoute = helpers.composeRouteString('test', 'FeatureServer/:layer/:method', true)
      fullRoute.should.equal('/test/:host/:id/FeatureServer/:layer/:method')
    })
    it('create route with :host parameter', function () {
      let fullRoute = helpers.composeRouteString('test', 'FeatureServer/:layer/:method', true, true)
      fullRoute.should.equal('/test/:host/:id/FeatureServer/:layer/:method')
    })
    it('create route without :host parameter', function () {
      let fullRoute = helpers.composeRouteString('test', 'FeatureServer/:layer/:method')
      fullRoute.should.equal('/test/:id/FeatureServer/:layer/:method')
    })

    it('create route without :host and :id parameter', function () {
      let fullRoute = helpers.composeRouteString('test', 'FeatureServer/:layer/:method', undefined, true)
      fullRoute.should.equal('/test/FeatureServer/:layer/:method')
    })

    it('create route with templated $provider$ substring', function () {
      let fullRoute = helpers.composeRouteString('test', 'rest/services/$provider$/FeatureServer/:layer/:method', true)
      fullRoute.should.equal('/rest/services/test/:host/:id/FeatureServer/:layer/:method')
    })

  })
})
