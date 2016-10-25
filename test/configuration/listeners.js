import Flask from '../../src/Flask'
import { ON_RESOLVED } from '../../src/res/listeners'
import { GLOBAL_NAMESPACE } from '../../src/core/EventDispatcher'

describe('Listeners', () => {
  it('Set global "onResolved" listener from instantiation', () => {
    const func1 = () => {}
    const func2 = () => {}
    const config = {
      listeners: {
        [ON_RESOLVED]: [func1, func2]
      }
    }

    const flask = new Flask(config)
    assert.property(flask.container.eventDispatcher.listeners, ON_RESOLVED)
    assert.property(flask.container.eventDispatcher.listeners[ON_RESOLVED], GLOBAL_NAMESPACE)
    assert.deepEqual(flask.container.eventDispatcher.listeners[ON_RESOLVED][GLOBAL_NAMESPACE], [func1, func2])
  })

  it('Set alias "onResolved" listener from instantiation', () => {
    class serviceA {}
    const func1 = () => {}
    const config = {
      services: {
        aliasA: {
          service: serviceA,
          listeners: {
            [ON_RESOLVED]: [func1]
          }
        }
      }
    }

    const flask = new Flask(config)
    const service = flask.container.services[0]
    assert.property(flask.container.eventDispatcher.listeners, ON_RESOLVED)
    assert.property(flask.container.eventDispatcher.listeners[ON_RESOLVED], 'aliasA')
    assert.deepEqual(flask.container.eventDispatcher.listeners[ON_RESOLVED]['aliasA'], [func1])
  })

  it('Set global "onResolved" listener manually', () => {
    const func1 = () => {}
    const func2 = () => {}
    const flask = new Flask()
    flask.onResolved(func1)
    flask.onResolved(func2)

    assert.property(flask.container.eventDispatcher.listeners, ON_RESOLVED)
    assert.property(flask.container.eventDispatcher.listeners[ON_RESOLVED], GLOBAL_NAMESPACE)
    assert.deepEqual(flask.container.eventDispatcher.listeners[ON_RESOLVED][GLOBAL_NAMESPACE], [func1, func2])
  })

  it('Set alias "onResolved" listener manually', () => {
    class serviceA {}
    const func1 = () => {}
    const func2 = () => {}
    const flask = new Flask()
    flask.onResolved('aliasA', func1)
    flask.onResolved('aliasA', func2)

    const service = flask.container.services[0]
    assert.property(flask.container.eventDispatcher.listeners, ON_RESOLVED)
    assert.property(flask.container.eventDispatcher.listeners[ON_RESOLVED], 'aliasA')
    assert.deepEqual(flask.container.eventDispatcher.listeners[ON_RESOLVED]['aliasA'], [func1, func2])
  })
})