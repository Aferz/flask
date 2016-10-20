import Flask from '../../src/Flask'
import { Parameter } from '../../src/services'

describe('Parameters', () => {
  it('Set parameter from instantiation', () => {
    const config = {
      parameters: {
        param1: 'Parameter 1',
        param2: 'Parameter 2'
      }
    }

    const flask = new Flask(config)
    const param1 = flask.parameters[0]
    const param2 = flask.parameters[1]
    assert.instanceOf(param1, Parameter)
    assert.instanceOf(param2, Parameter)
    assert.equal(param1.alias, 'param1')
    assert.equal(param2.alias, 'param2')
    assert.equal(param1.value, 'Parameter 1')
    assert.equal(param2.value, 'Parameter 2')
  })

  it('Set parameter manually', () => {
    const flask = new Flask()
    flask.parameter('param1', 'value1')

    const param = flask.parameters[0];
    assert.instanceOf(param, Parameter)
    assert.equal(param.alias, 'param1')
    assert.equal(param.value, 'value1')
  })

  it('Throw exceptions setting a parameter twice', () => {
    const flask = new Flask()
    flask.parameter('param1', 'value1')

    assert.throws(
      () => flask.parameter('param1', 'value1'),
      Error,
      "Parameter 'param1' already exists in flask."
    )
  })
})