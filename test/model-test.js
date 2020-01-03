/* eslint handle-callback-err: "off" */
const should = require('should') // eslint-disable-line
const Spy = require('./helpers/simple-spy')
const Model = require('../src/models')

// Mock getData function
Model.prototype.getData = function (req, callback) {
  callback(null, { hello: 'world' })
}

describe('Tests for models/index', function () {
  describe('createKey', function () {
    it('should create cache-key as provider name', () => {
      const retrieveSpy = new Spy()
      const pullSpy = new Spy()
      // create a model with mocked cache "retrieve" function
      const model = new Model({
        cache: {
          retrieve: function (key, queryParams, callback) {
            retrieveSpy.add(arguments)
            callback(null, {})
          }
        }
      })
      model.pull({ url: 'domain/test-provider', params: {}, query: {} }, function (err, data) {
        pullSpy.add(arguments)
      })
      retrieveSpy.calls().should.equal(1)
      retrieveSpy.call(0).args().should.equal(3)
      retrieveSpy.call(0).arg(0).should.equal('test-provider')
      retrieveSpy.call(0).arg(1).should.be.an.Object().and.be.empty()
      retrieveSpy.call(0).arg(2).should.be.an.Function()
      pullSpy.calls().should.equal(1)
      pullSpy.call(0).args().should.equal(2)
      should.not.exist(pullSpy.call(0).arg(0))
      pullSpy.call(0).arg(1).should.be.an.Object().and.be.empty()
    })

    it('should create cache-key as provider name and concenated url params', () => {
      const retrieveSpy = new Spy()
      const pullSpy = new Spy()
      // create a model with mocked cache "retrieve" function
      const model = new Model({
        cache: {
          retrieve: function (key, queryParams, callback) {
            retrieveSpy.add(arguments)
            callback(null, {})
          }
        }
      })
      model.pull({ url: 'domain/test-provider', params: { host: 'host-param', id: 'id-param', layer: 'layer-param' }, query: {} }, function (err, data) {
        pullSpy.add(arguments)
      })
      retrieveSpy.calls().should.equal(1)
      retrieveSpy.call(0).args().should.equal(3)
      retrieveSpy.call(0).arg(0).should.equal('test-provider::host-param::id-param::layer-param')
      retrieveSpy.call(0).arg(1).should.be.an.Object().and.be.empty()
      retrieveSpy.call(0).arg(2).should.be.an.Function()
      pullSpy.calls().should.equal(1)
      pullSpy.call(0).args().should.equal(2)
      should.not.exist(pullSpy.call(0).arg(0))
      pullSpy.call(0).arg(1).should.be.an.Object().and.be.empty()
    })

    it('should create cache-key from Model defined createKey function', () => {
      const retrieveSpy = new Spy()
      const pullSpy = new Spy()

      // create a model with mocked cache "retrieve" function
      const model = new Model({
        cache: {
          retrieve: function (key, queryParams, callback) {
            retrieveSpy.add(arguments)
            callback(null, {})
          }
        }
      })
      model.createKey = function () { return 'custom-key' }
      model.pull({ url: 'domain/test-provider', query: {} }, function (err, data) {
        pullSpy.add(arguments)
      })
      retrieveSpy.calls().should.equal(1)
      retrieveSpy.call(0).args().should.equal(3)
      retrieveSpy.call(0).arg(0).should.equal('custom-key')
      retrieveSpy.call(0).arg(1).should.be.an.Object().and.be.empty()
      retrieveSpy.call(0).arg(2).should.be.an.Function()
      pullSpy.calls().should.equal(1)
      pullSpy.call(0).args().should.equal(2)
      should.not.exist(pullSpy.call(0).arg(0))
      pullSpy.call(0).arg(1).should.be.an.Object().and.be.empty()
    })
  })
})
