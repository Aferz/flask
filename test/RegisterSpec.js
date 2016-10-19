import Flask from '../src/Flask'
import { Service, Singleton, Parameter } from '../src/services'
import {
  GLOBAL_LISTENER_NAME,
  RESOLVED_LISTENER_NAME
} from '../src/util/constants'

describe('Register Configuration Manually', () => {
  it('Set config values manually', () => {
    const flask = new Flask()
    flask.setConfigValue('serviceDelimiter', '#')
    flask.setConfigValue('key', 'value')

    assert.property(flask.config, 'serviceDelimiter')
    assert.property(flask.config, 'key')
    assert.property(flask.config, 'paramDelimiter')
    assert.equal(flask.config.serviceDelimiter, '#')
    assert.equal(flask.config.paramDelimiter, '%')
    assert.equal(flask.config.key, 'value')
  })

  it('Set parameters manually', () => {
    const flask = new Flask()
    flask.parameter('param1', 'value1')

    const param = flask.parameters[0];
    assert.instanceOf(param, Parameter)
    assert.equal(param.alias, 'param1')
    assert.equal(param.value, 'value1')
  })

  it('Throw exception setting a parameter twice', () => {
    const flask = new Flask()
    flask.parameter('param1', 'value1')
    assert.throws(
      () => flask.parameter('param1', 'value1'),
      Error,
      "Parameter 'param1' already exists in flask."
    )
  })

  it('Set service alias & definition manually', () => {
    const serviceA = () => {}
    function serviceB() {}
    class serviceC {}
    const flask = new Flask()
    flask.service('aliasA', serviceA)
    flask.service('aliasB', serviceB)
    flask.service('aliasC', serviceC)

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

  it('Throw exception setting a service twice', () => {
    const flask = new Flask()
    flask.service('aliasA', () => {})

    assert.throws(
      () => flask.service('aliasA', () => {}),
      Error,
      "Service 'aliasA' already exists in flask."
    )
  })

  it('Set service arguments manually', () => {
    class serviceA {}
    const flask = new Flask()
    flask.service('aliasA', serviceA, ['Arg 1'])
    flask.service('aliasB', serviceA)

    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.deepEqual(service1.args, ['Arg 1'])
    assert.deepEqual(service2.args, [])
  })

  it('Set service as a singleton manually', () => {
    class serviceA {}
    const flask = new Flask()
    flask.singleton('aliasA', serviceA)
    flask.service('aliasB', serviceA)

    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.instanceOf(service1, Singleton)
    assert.instanceOf(service2, Service)
  })

  it('Set tags manually', () => {
    class serviceA {}
    class serviceB {}
    const flask = new Flask()
    flask.service('aliasA', serviceA)
    flask.service('aliasB', serviceB)
    flask.tag('tag1', ['aliasA', 'aliasB'])
    flask.tag('tag2', ['aliasB'])

    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.property(flask.tags, 'tag1')
    assert.property(flask.tags, 'tag2')
    assert.deepEqual(flask.tags.tag1, ['aliasA', 'aliasB'])
    assert.deepEqual(flask.tags.tag2, ['aliasB'])
  })

  it('Throw exception setting a singleton twice', () => {
    const flask = new Flask()
    flask.singleton('aliasA', () => {})

    assert.throws(
      () => flask.singleton('aliasA', () => {}),
      Error,
      "Service 'aliasA' already exists in flask."
    )
  })

  it('Adds to tag when calling \'tag\' with a registered tag name', () => {
    class serviceA {}
    class serviceB {}
    const flask = new Flask()
    flask.service('aliasA', serviceA)
    flask.service('aliasB', serviceB)
    flask.tag('tag1', ['aliasA', 'aliasB'])
    flask.tag('tag1', ['aliasA'])

    assert.property(flask.tags, 'tag1')
    assert.deepEqual(flask.tags.tag1, ['aliasA', 'aliasB', 'aliasA'])
  })

  it('Set global listeners manually', () => {
    const func1 = () => {}
    const func2 = () => {}
    const func3 = () => {}
    const flask = new Flask()
    flask.listen(RESOLVED_LISTENER_NAME, func1)
    flask.listen('custom', func2)
    flask.listen('custom', func3)

    assert.property(flask.listeners, RESOLVED_LISTENER_NAME)
    assert.property(flask.listeners, 'custom')
    assert.property(flask.listeners[RESOLVED_LISTENER_NAME], GLOBAL_LISTENER_NAME)
    assert.property(flask.listeners['custom'], GLOBAL_LISTENER_NAME)
    assert.deepEqual(flask.listeners[RESOLVED_LISTENER_NAME][GLOBAL_LISTENER_NAME], [func1])
    assert.deepEqual(flask.listeners['custom'][GLOBAL_LISTENER_NAME], [func2, func3])
  })

  it('Set service listeners manually', () => {
    class serviceA {}
    const func1 = () => {}
    const func2 = () => {}
    const func3 = () => {}
    const flask = new Flask()
    flask.service('aliasA', serviceA)
    flask.listen(RESOLVED_LISTENER_NAME, 'aliasA', func1)
    flask.listen('custom', 'aliasA', func2)
    flask.listen('custom', 'aliasA', func3)

    const service = flask.services[0]
    assert.property(flask.listeners, RESOLVED_LISTENER_NAME)
    assert.property(flask.listeners, 'custom')
    assert.property(flask.listeners[RESOLVED_LISTENER_NAME], service.alias)
    assert.property(flask.listeners['custom'], service.alias)
    assert.deepEqual(flask.listeners[RESOLVED_LISTENER_NAME][service.alias], [func1])
    assert.deepEqual(flask.listeners['custom'][service.alias], [func2, func3])
  })
})