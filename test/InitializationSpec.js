import Flask from '../src/Flask'
import { Service, Singleton, Parameter } from '../src/services'
import { GLOBAL_LISTENER_NAME, ON_RESOLVED } from '../src/res/listeners'
import { PARAMETER_DELIMITER_CHAR, SERVICE_DELIMITER_CHAR } from '../src/res/config'

describe('Initial Configuration', () => {
  it('Load default config values if config values not present', () => {
    const flask = new Flask()
    assert.property(flask.config, 'serviceDelimiter')
    assert.property(flask.config, 'paramDelimiter')
    assert.equal(flask.config.serviceDelimiter, SERVICE_DELIMITER_CHAR)
    assert.equal(flask.config.paramDelimiter, PARAMETER_DELIMITER_CHAR)
  })

  it('Override config values from initial config', () => {
    const config = {
      config: {
        serviceDelimiter: '#',
        paramDelimiter: '~'
      }
    }

    const flask = new Flask(config)
    assert.property(flask.config, 'serviceDelimiter')
    assert.property(flask.config, 'paramDelimiter')
    assert.equal(flask.config.serviceDelimiter, '#')
    assert.equal(flask.config.paramDelimiter, '~')
  })
  
  it('Load parameters from initial config', () => {
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

  it('Load service alias & definition from initial config', () => {
    const serviceA = () => {}
    function serviceB(){}
    class serviceC {}
    const config = {
      services: {
        aliasA: {
          service: serviceA,
        },
        aliasB: {
          service: serviceB,
        },
        aliasC: {
          service: serviceC
        }
      }
    }

    const flask = new Flask(config)
    const service1 = flask.services[0]
    const service2 = flask.services[1]
    const service3 = flask.services[2]
    assert.instanceOf(service1, Service)
    assert.instanceOf(service2, Service)
    assert.instanceOf(service3, Service)
    assert.equal(service1.alias, 'aliasA')
    assert.equal(service2.alias, 'aliasB')
    assert.equal(service3.alias, 'aliasC')
    assert.equal(service1.definition, serviceA)
    assert.equal(service2.definition, serviceB)
    assert.equal(service3.definition, serviceC)
  })

  it('Load service arguments from initial config', () => {
    class serviceA {}
    const config = {
      services: {
        aliasA: {
          service: serviceA,
          arguments: ['Arg 1']
        },
        aliasB: {
          service: serviceA
        }
      }
    }

    const flask = new Flask(config)
    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.deepEqual(service1.args, ['Arg 1'])
    assert.deepEqual(service2.args, [])
  })

  it('Load service as a singleton from initial config', () => {
    class serviceA {}
    const config = {
      services: {
        aliasA: {
          service: serviceA,
          singleton: true
        },
        aliasB: {
          service: serviceA,
          singleton: false
        }
      }
    }

    const flask = new Flask(config)
    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.instanceOf(service1, Singleton)
    assert.instanceOf(service2, Service)
  })

  it('Load tags from initial config', () => {
    class serviceA {}
    class serviceB {}
    const config = {
      services: {
        aliasA: {
          service: serviceA,
          tags: 'tag1'
        },
        aliasB: {
          service: serviceB,
          tags: ['tag1', 'tag2']
        }
      }
    }

    const flask = new Flask(config)
    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.property(flask.tags, 'tag1')
    assert.property(flask.tags, 'tag2')
    assert.deepEqual(flask.tags.tag1, ['aliasA', 'aliasB'])
    assert.deepEqual(flask.tags.tag2, ['aliasB'])
  })

  it('Load global listeners from initial config', () => {
    const func1 = () => {}
    const func2 = () => {}
    const func3 = () => {}
    const config = {
      listeners: {
        [ON_RESOLVED]: [func1],
        custom: [func2, func3]
      }
    }

    const flask = new Flask(config)
    assert.property(flask.listeners, ON_RESOLVED)
    assert.property(flask.listeners, 'custom')
    assert.property(flask.listeners[ON_RESOLVED], GLOBAL_LISTENER_NAME)
    assert.property(flask.listeners['custom'], GLOBAL_LISTENER_NAME)
    assert.deepEqual(flask.listeners[ON_RESOLVED][GLOBAL_LISTENER_NAME], [func1])
    assert.deepEqual(flask.listeners['custom'][GLOBAL_LISTENER_NAME], [func2, func3])
  })

  it('Load service listeners from initial config', () => {
    class serviceA {}
    const func1 = () => {}
    const func2 = () => {}
    const func3 = () => {}
    const config = {
      services: {
        aliasA: {
          service: serviceA,
          listeners: {
            [ON_RESOLVED]: [func1],
            custom: [func2, func3]
          }
        }
      }
    }

    const flask = new Flask(config)
    const service = flask.services[0]
    assert.property(flask.listeners, ON_RESOLVED)
    assert.property(flask.listeners, 'custom')
    assert.property(flask.listeners[ON_RESOLVED], service.alias)
    assert.property(flask.listeners['custom'], service.alias)
    assert.deepEqual(flask.listeners[ON_RESOLVED][service.alias], [func1])
    assert.deepEqual(flask.listeners['custom'][service.alias], [func2, func3])
  })
})