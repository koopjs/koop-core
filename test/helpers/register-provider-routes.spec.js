const should = require('should') // eslint-disable-line
const sinon = require('sinon')
require('should-sinon')
const registerProviderRoutes = require('../../src/helpers/register-provider-routes')

const mockController = {
  testHandler: () => {}
}

describe('Tests for register-provider-routes', function () {
  it('should register a provider route', () => {
    const mockServer = sinon.spy({
      get: () => {}
    })

    const mockProvider = {
      namespace: 'mock-provider',
      hosts: true,
      disableIdParam: false,
      routes: [{
        path: '/test/route',
        methods: ['get'],
        handler: 'testHandler'
      }]
    }
    const providerRouteMap = registerProviderRoutes({
      provider: mockProvider,
      controller: mockController,
      server: mockServer
    })

    mockServer.get.should.be.calledOnce()
    providerRouteMap.should.deepEqual({ '/test/route': ['get'] })
  })

  it('should throw an error if handler not found on Koop controller', () => {
    const mockServer = sinon.spy({
      get: () => {}
    })

    const mockProvider = {
      namespace: 'mock-provider',
      hosts: true,
      disableIdParam: false,
      routes: [{
        path: '/test/route',
        methods: ['get'],
        handler: 'testHandler'
      }]
    }

    try {
      registerProviderRoutes({
        provider: mockProvider,
        controller: {},
        server: mockServer
      })
      should.fail('Should have thrown')
    } catch (err) {
      mockServer.get.should.be.callCount(0)
      err.message.should.equal('Handler "testHandler" assigned to route "/test/route" by the "mock-provider" provider is undefined for the Koop controller')
    }
  })
})