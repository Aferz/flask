import Flask from '../../src/Flask'
import Parameter from '../../src/core/resolvables/Parameter'
import Reference from '../../src/core/resolvables/Reference'

describe('Parameters', () => {
  it('Set parameter from instantiation', () => {
    const config = {
      parameters: {
        param: 'Parameter 1'
      }
    }

    const flask = new Flask(config)
    const param = flask.container.parameters[0]
    assert.instanceOf(param, Parameter)
    assert.equal(param.alias, 'param')
    assert.instanceOf(param.reference, Reference)
    assert.equal(param.reference.value, 'Parameter 1')
  })

  it('Set parameter from instantiation being an object', () => {
    const config = {
      parameters: {
        param: {
          value: 'Parameter 1'
        }
      }
    }

    const flask = new Flask(config)
    const param = flask.container.parameters[0]
    assert.instanceOf(param, Parameter)
    assert.equal(param.alias, 'param')
    assert.instanceOf(param.reference, Reference)
    assert.equal(param.reference.value, 'Parameter 1')
  });

  it('Set parameter manually', () => {
    const flask = new Flask()
    flask.parameter('param', 'value1')

    const param = flask.container.parameters[0];
    assert.instanceOf(param, Parameter)
    assert.equal(param.alias, 'param')
    assert.instanceOf(param.reference, Reference)
    assert.equal(param.reference.value, 'value1')
  })
})