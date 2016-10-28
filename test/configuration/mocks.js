import Flask from '../../src/Flask'
import Mock from '../../src/core/resolvables/Mock'
import Stub from '../../src/core/resolvables/Stub'

describe.only('Mocks', () => {
  it('Add service mock manually', () => {
    const flask = new Flask()
    const mock = flask.mock('serviceA')

    assert.property(flask.container.mockery.mocks, 'serviceA')
    assert.instanceOf(flask.container.mockery.mocks['serviceA'], Mock)
    assert.deepEqual(flask.container.mockery.mocks['serviceA'], mock)
  })

  it('Add stubbed method to mocked service', () => {
    const flask = new Flask()
    const stub = flask.mock('serviceA')
      .onCall('method')

    assert.property(flask.container.mockery.mocks['serviceA'].stubs, 'method')
    assert.instanceOf(flask.container.mockery.mocks['serviceA'].stubs['method'], Stub)
    assert.deepEqual(flask.container.mockery.mocks['serviceA'].stubs['method'], stub)
  })

  it('Set return value to stubbed method', () => {
    const flask = new Flask()
    const stub = flask.mock('serviceA')
      .onCall('method')
      .returns('value')

    assert.deepEqual(flask.container.mockery.mocks['serviceA'].stubs['method'].returnValue, 'value')
    assert.deepEqual(stub, undefined)
  })
})