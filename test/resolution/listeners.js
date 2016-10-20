import Flask from '../../src/Flask'

describe('Listeners', () => {
  it('Dispatch global listeners', () => {
    class ServiceA{}
    const flask = new Flask()
    flask.service('serviceA', ServiceA)
    flask.listen('resolved', (serviceInstance, containterInstance) => {
      assert.instanceOf(serviceInstance, ServiceA)
      assert.strictEqual(flask, containterInstance)
    })

    flask.make('serviceA')
  })

  it('Dispatch alias listeners', () => {
    class ServiceA{}
    const flask = new Flask()
    flask.service('serviceA', ServiceA)
    flask.service('serviceB', ServiceA)
    flask.listen('resolved', 'serviceA', (serviceInstance, containterInstance) => {
      assert.instanceOf(serviceInstance, ServiceA)
      assert.strictEqual(flask, containterInstance)
    })

    flask.make('serviceA')
  })
})