import Flask from '../../src/Flask'

describe('Decorators', () => {
  it('Apply global decorator to parameter', () => {
    const flask = new Flask()
    flask.parameter('Param1', 'Value1')
    flask.decorate((value, flask) => {
      assert.strictEqual(value, 'Value1')
      assert.instanceOf(flask, Flask)
      return `decorated-${value}`
    })

    const value = flask.value('Param1')
    assert.deepEqual(value, 'decorated-Value1')
  })

  it('Apply global decorator to service', () => {
    class ServiceA {}
    const flask = new Flask()
    const logFunc1 = () => {}
    flask.service('serviceA', ServiceA)
    flask.decorate((instance, flask) => {
      assert.instanceOf(instance, ServiceA)
      // assert.instanceOf(flask, Flask)
      instance.log1 = logFunc1
      return instance
    })

    const instance = flask.make('serviceA')
    assert.deepEqual(instance.log1, logFunc1)
  })

  it('Apply decorator to parameter', () => {
    const flask = new Flask()
    flask.parameter('Param1', 'Value1')
    flask.decorate('Param1', (value, flask) => {
      assert.strictEqual(value, 'Value1')
      // assert.instanceOf(flask, Flask)
      return `decorated-${value}`
    })

    const value = flask.value('Param1')
    assert.deepEqual(value, 'decorated-Value1')
  })

  it('Apply decorator to service', () => {
    class ServiceA {}
    const flask = new Flask()
    const logFunc1 = () => {}
    flask.service('serviceA', ServiceA)
    flask.decorate('serviceA', (instance, flask) => {
      assert.instanceOf(instance, ServiceA)
      assert.instanceOf(flask, Flask)
      instance.log1 = logFunc1
      return instance
    })

    const instance = flask.make('serviceA')
    assert.deepEqual(instance.log1, logFunc1)
  })
})