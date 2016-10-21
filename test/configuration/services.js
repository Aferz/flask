import Flask from '../../src/Flask'
import { Service, Singleton } from '../../src/services'

describe('Services & Singletons', () => {
  it('Set service from instantiation', () => {
    const serviceA = () => {}
    function serviceB(){}
    const config = {
      services: {
        aliasA: {
          service: serviceA,
          arguments: ['Arg 1']
        },
        aliasB: {
          service: serviceB
        }
      }
    }

    const flask = new Flask(config)
    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.instanceOf(service1, Service)
    assert.instanceOf(service2, Service)
    assert.equal(service1.alias, 'aliasA')
    assert.equal(service2.alias, 'aliasB')
    assert.equal(service1.definition, serviceA)
    assert.equal(service2.definition, serviceB)
    assert.deepEqual(service1.args, ['Arg 1'])
    assert.deepEqual(service2.args, [])
  })

  it('Set singleton from instantiation', () => {
    const serviceA = () => {}
    function serviceB () {}
    const config = {
      services: {
        aliasA: {
          service: serviceA,
          arguments: ['Arg 1'],
          singleton: true
        },
        aliasB: {
          service: serviceB,
          singleton: true
        }
      }
    }

    const flask = new Flask(config)
    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.instanceOf(service1, Singleton)
    assert.instanceOf(service2, Singleton)
    assert.equal(service1.alias, 'aliasA')
    assert.equal(service2.alias, 'aliasB')
    assert.equal(service1.definition, serviceA)
    assert.equal(service2.definition, serviceB)
    assert.deepEqual(service1.args, ['Arg 1'])
    assert.deepEqual(service2.args, [])
  })

  it('Set service manually', () => {
    const serviceA = () => {}
    const serviceB = () => {}
    const flask = new Flask()
    flask.service('aliasA', serviceA, ['Arg 1'])
    flask.service('aliasB', serviceB)

    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.instanceOf(service1, Service)
    assert.instanceOf(service2, Service)
    assert.equal(service1.alias, 'aliasA')
    assert.equal(service2.alias, 'aliasB')
    assert.equal(service1.definition, serviceA)
    assert.equal(service2.definition, serviceB)
    assert.deepEqual(service1.args, ['Arg 1'])
    assert.deepEqual(service2.args, [])
  });

  it('Set singleton manually', () => {
    const serviceA = () => {}
    const serviceB = () => {}
    const flask = new Flask()
    flask.singleton('aliasA', serviceA, ['Arg 1'])
    flask.singleton('aliasB', serviceB)

    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.instanceOf(service1, Singleton)
    assert.instanceOf(service2, Singleton)
    assert.equal(service1.alias, 'aliasA')
    assert.equal(service2.alias, 'aliasB')
    assert.equal(service1.definition, serviceA)
    assert.equal(service2.definition, serviceB)
    assert.deepEqual(service1.args, ['Arg 1'])
    assert.deepEqual(service2.args, [])
  });

  it('Throw exception setting a service twice', () => {
    const flask = new Flask()
    flask.service('aliasA', () => {})

    assert.throws(
      () => flask.service('aliasA', () => {}),
      Error,
      "Service 'aliasA' already exists in flask."
    )
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
})