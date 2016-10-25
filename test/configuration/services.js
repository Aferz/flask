import Flask from '../../src/Flask'
import Service from '../../src/core/resolvables/Service'
import Singleton from '../../src/core/resolvables/Singleton'
import Reference from '../../src/core/resolvables/Reference'

describe('Services & Singletons', () => {
  it('Set service from instantiation', () => {
    function definitionA () {}
    function definitionB () {}
    const config = {
      services: {
        serviceA: {
          service: definitionA
        },
        serviceB: {
          service: definitionB,
          arguments: ['Arg 1']
        }
      }
    }

    const flask = new Flask(config)
    const serviceA = flask.container.services[0]
    const serviceB = flask.container.services[1]
    assert.instanceOf(serviceA, Service)
    assert.instanceOf(serviceB, Service)
    assert.equal(serviceA.alias, 'serviceA')
    assert.equal(serviceB.alias, 'serviceB')
    assert.equal(serviceA.definition, definitionA)
    assert.equal(serviceB.definition, definitionB)
    assert.deepEqual(serviceA.references, [])
    assert.instanceOf(serviceB.references[0], Reference)
    assert.deepEqual(serviceB.references[0].value, 'Arg 1')
  })

  it('Set singleton from instantiation', () => {
    function definitionA () {}
    const config = {
      services: {
        serviceA: {
          service: definitionA,
          arguments: ['Arg 1'],
          singleton: true
        }
      }
    }

    const flask = new Flask(config)
    const serviceA = flask.container.services[0]
    assert.instanceOf(serviceA, Singleton)
    assert.equal(serviceA.alias, 'serviceA')
    assert.equal(serviceA.definition, definitionA)
    assert.instanceOf(serviceA.references[0], Reference)
    assert.deepEqual(serviceA.references[0].value, 'Arg 1')
  })

  it('Set service manually', () => {
    const definitionA = () => {}
    const definitionB = () => {}
    const flask = new Flask()
    flask.service('serviceA', definitionA)
    flask.service('serviceB', definitionB, ['Arg 1'])

    const serviceA = flask.container.services[0]
    const serviceB = flask.container.services[1]
    assert.instanceOf(serviceA, Service)
    assert.instanceOf(serviceB, Service)
    assert.equal(serviceA.alias, 'serviceA')
    assert.equal(serviceB.alias, 'serviceB')
    assert.equal(serviceA.definition, definitionA)
    assert.equal(serviceB.definition, definitionB)
    assert.deepEqual(serviceA.references, [])
    assert.instanceOf(serviceB.references[0], Reference)
    assert.deepEqual(serviceB.references[0].value, 'Arg 1')
  });

  it('Set singleton manually', () => {
    const definitionA = () => {}
    const flask = new Flask()
    flask.singleton('serviceA', definitionA, ['Arg 1'])

    const serviceA = flask.container.services[0]
    assert.instanceOf(serviceA, Singleton)
    assert.equal(serviceA.alias, 'serviceA')
    assert.equal(serviceA.definition, definitionA)
    assert.instanceOf(serviceA.references[0], Reference)
    assert.deepEqual(serviceA.references[0].value, 'Arg 1')
  });
})