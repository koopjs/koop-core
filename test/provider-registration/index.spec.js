const should = require('should') // eslint-disable-line
const sinon = require('sinon')
const mockProviderPlugin = require('../fixtures/fake-provider')
const mockOutputPlugin = require('../fixtures/output')
const ProviderRegistration = require('../../provider-registration')
const ProviderRoute = require('../../provider-registration/provider-route')
const ProviderOutputRoute = require('../../provider-registration/provider-output-route')

describe('Tests for Provider', function () {
  it('should create instance of ProviderRoute', function () {
    const serverSpy = sinon.spy({
      get: () => {},
      post: () => {}
    })
    const koopMock = {
      server: serverSpy,
      outputs: [mockOutputPlugin]
    }
    const provider = ProviderRegistration.create({ koop: koopMock, provider: { ...mockProviderPlugin, hosts: true } })
    provider.should.be.instanceOf(ProviderRegistration)
    provider.should.have.property('options').deepEqual({ hosts: true })
    provider.should.have.property('namespace', 'test-provider')
    provider.should.have.property('outputRouteNamespace', 'test-provider')
    provider.should.have.property('outputs').instanceOf(Array).length(1)
    provider.should.have.property('routes').instanceOf(Array).length(1)
    provider.should.have.property('registeredProviderRoutes').length(1)
    provider.registeredProviderRoutes[0].should.be.instanceOf(ProviderRoute)
    provider.should.have.property('registeredOutputs').length(1)
    provider.registeredOutputs[0].should.have.property('namespace', 'MockOutput')
    provider.registeredOutputs[0].should.have.property('routes').instanceOf(Array).length(1)
    provider.registeredOutputs[0].routes[0].should.be.instanceOf(ProviderOutputRoute)
    provider.should.have.property('controller').not.be.undefined()
    provider.should.have.property('model').not.be.undefined()
    provider.should.have.property('registerOutputRoutesFirst', false)
    serverSpy.get.should.have.property('calledTwice', true)
    serverSpy.post.should.have.property('calledOnce', true)
  })
})
