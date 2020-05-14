const namespacedRoutePath = require('../../src/helpers/namespaced-route-path')
const should = require('should') // eslint-disable-line

describe('Tests for namespacedRoutePath', function () {
  it('create route with :host and :id parameter', function () {
    const params = { hosts: true, namespace: 'test', route: { path: 'FeatureServer/:layer/:method' } }
    const fullRoute = namespacedRoutePath(params)
    fullRoute.should.equal('/test/:host/:id/FeatureServer/:layer/:method')
  })

  it('create route with :host parameter and without :id parameter', function () {
    const params = { hosts: true, disableIdParam: true, namespace: 'test', route: { path: 'FeatureServer/:layer/:method' } }
    const fullRoute = namespacedRoutePath(params)
    fullRoute.should.equal('/test/:host/FeatureServer/:layer/:method')
  })

  it('create route without :host parameter', function () {
    const params = { namespace: 'test', route: { path: 'FeatureServer/:layer/:method' } }
    const fullRoute = namespacedRoutePath(params)
    fullRoute.should.equal('/test/:id/FeatureServer/:layer/:method')
  })

  it('create route without :host and :id parameter', function () {
    const params = { namespace: 'test', disableIdParam: true, route: { path: 'FeatureServer/:layer/:method' } }
    const fullRoute = namespacedRoutePath(params)
    fullRoute.should.equal('/test/FeatureServer/:layer/:method')
  })

  it('create route with templated $namespace$ substring', function () {
    const params = { namespace: 'test', disableIdParam: true, route: { path: '$namespace/rest/services/FeatureServer/:layer/:method' } }
    const fullRoute = namespacedRoutePath(params)
    fullRoute.should.equal('/test/rest/services/FeatureServer/:layer/:method')
  })

  it('create route with templated $namespace$ and $providerParams$ substrings', function () {
    const params = { namespace: 'test', hosts: true, route: { path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/:method' } }
    const fullRoute = namespacedRoutePath(params)
    fullRoute.should.equal('/test/rest/services/:host/:id/FeatureServer/:layer/:method')
  })

  it('create route without path construction', function () {
    const params = { namespace: 'tests', route: { path: 'rest/info', absolutePath: true } }
    const fullRoute = namespacedRoutePath(params)
    fullRoute.should.equal('/rest/info')
  })

  it('create route with prefix, :host, :id parameters', function () {
    const params = { namespace: 'test', routePrefix: 'api/v1', route: { path: 'FeatureServer/:layer/:method' } }
    const fullRoute = namespacedRoutePath(params)
    fullRoute.should.equal('/api/v1/test/:id/FeatureServer/:layer/:method')
  })
})
