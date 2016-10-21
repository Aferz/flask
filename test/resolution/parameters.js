import Flask from '../../src/Flask'

describe('Parameters', () => {
  it('Resolve registered parameter', () => {
    const flask = new Flask()
    flask.parameter('key', 'value')

    assert.equal(flask.value('key'), 'value')
  })

  it('Resolve registered parameter with primitive dependencies', () => {
    const flask = new Flask()
    const testObj = { key: 'value' }
    const testFunc = () => {}
    const testArr = [ 'value1', 'value2' ]
    flask.parameter('param1', true);
    flask.parameter('param2', 'value1');
    flask.parameter('param3', 5);
    flask.parameter('param4', 1.2);
    flask.parameter('param5', testArr);
    flask.parameter('param6', testObj);
    flask.parameter('param7', testFunc);

    const parameter1 = flask.value('param1');
    const parameter2 = flask.value('param2');
    const parameter3 = flask.value('param3');
    const parameter4 = flask.value('param4');
    const parameter5 = flask.value('param5');
    const parameter6 = flask.value('param6');
    const parameter7 = flask.value('param7');
    assert.deepEqual(parameter1, true)
    assert.deepEqual(parameter2, 'value1')
    assert.deepEqual(parameter3, 5)
    assert.deepEqual(parameter4, 1.2)
    assert.deepEqual(parameter5, testArr)
    assert.deepEqual(parameter6, testObj)
    assert.deepEqual(parameter7, testFunc)
  })

  it('Resolve registered parameter with reference to parameter', () => {
    const flask = new Flask()
    flask.parameter('key', '%key2%')
    flask.parameter('key2', 'value')

    assert.equal(flask.value('key'), 'value')
  })

  it('Parameter must not resolve services', () => {
    const flask = new Flask()
    flask.service('Service1', () => {})
    flask.parameter('key', '@key2@')

    assert.equal(flask.value('key'), '@key2@')
  })

  it('Parameter must not resolve tags', () => {
    const flask = new Flask()
    flask.service('Service1', () => {})
    flask.service('Service2', () => {})
    flask.tag('tag', ['@Service1@', '@Service2@'])
    flask.parameter('key', '#tag#')

    assert.equal(flask.value('key'), '#tag#')
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
})