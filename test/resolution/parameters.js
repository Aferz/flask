import Flask from '../../src/Flask'

describe('Parameters', () => {
  it('Resolve registered parameter', () => {
    const flask = new Flask()
    flask.parameter('key', 'value')

    assert.equal(flask.value('key'), 'value')
  })

  it('Resolve registered parameter that references other parameter', () => {
    const flask = new Flask()
    flask.parameter('key', '%key2%')
    flask.parameter('key2', '%key3%')
    flask.parameter('key3', 'value')

    assert.equal(flask.value('key'), 'value')
  })

  it('Throws error when resolving unregistered parameter', () => {
    const flask = new Flask()

    assert.throws(() => flask.value('key'), "Parameter 'key' not registered in flask")
  })

  it('Throw exception when resolving circular dependency', () => {
    const flask = new Flask()
    flask.parameter('key', '%key2%')
    flask.parameter('key2', '%key%')

    assert.throws(() => flask.value('key'), Error, "Circular dependency in parameter 'key'")
  })

  it('Parameter must not resolve services', () => {
    const flask = new Flask()
    flask.service('Service1', () => {})
    flask.parameter('key', '@key2@')

    assert.equal(flask.value('key'), '@key2@')
  })
})