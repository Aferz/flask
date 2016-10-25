import Flask from '../../src/Flask'

describe('Listeners', () => {
  it('Dispatch global "onResolved" listeners', () => {
    class ServiceA{}
    const flask = new Flask()
    flask.service('serviceA', ServiceA)
    flask.onResolved((serviceInstance, flask) => {
      assert.instanceOf(serviceInstance, ServiceA)
      assert.instanceOf(flask, Flask)
    })

    flask.make('serviceA')
  })

  it('Dispatch alias "onResolved" listeners', () => {
    class ServiceA{}
    const flask = new Flask()
    flask.service('serviceA', ServiceA)
    flask.service('serviceB', ServiceA)
    flask.onResolved('serviceA', (serviceInstance, flask) => {
      assert.instanceOf(serviceInstance, ServiceA)
      assert.instanceOf(flask, Flask)
    })

    flask.make('serviceA')
  })
})