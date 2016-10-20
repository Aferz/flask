import Flask from '../../src/Flask'
import { GLOBAL_LISTENER_NAME, ON_RESOLVED } from '../../src/res/listeners'

describe('Listeners', () => {
  it('Set global listener from instantiation', () => {
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

  it('Set service listener from instantiation', () => {
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

  it('Set global listener manually', () => {
    const func1 = () => {}
    const func2 = () => {}
    const func3 = () => {}
    const flask = new Flask()
    flask.listen(ON_RESOLVED, func1)
    flask.listen('custom', func2)
    flask.listen('custom', func3)

    assert.property(flask.listeners, ON_RESOLVED)
    assert.property(flask.listeners, 'custom')
    assert.property(flask.listeners[ON_RESOLVED], GLOBAL_LISTENER_NAME)
    assert.property(flask.listeners['custom'], GLOBAL_LISTENER_NAME)
    assert.deepEqual(flask.listeners[ON_RESOLVED][GLOBAL_LISTENER_NAME], [func1])
    assert.deepEqual(flask.listeners['custom'][GLOBAL_LISTENER_NAME], [func2, func3])
  })

  it('Set service listener manually', () => {
    class serviceA {}
    const func1 = () => {}
    const func2 = () => {}
    const func3 = () => {}
    const flask = new Flask()
    flask.service('aliasA', serviceA)
    flask.listen(ON_RESOLVED, 'aliasA', func1)
    flask.listen('custom', 'aliasA', func2)
    flask.listen('custom', 'aliasA', func3)

    const service = flask.services[0]
    assert.property(flask.listeners, ON_RESOLVED)
    assert.property(flask.listeners, 'custom')
    assert.property(flask.listeners[ON_RESOLVED], service.alias)
    assert.property(flask.listeners['custom'], service.alias)
    assert.deepEqual(flask.listeners[ON_RESOLVED][service.alias], [func1])
    assert.deepEqual(flask.listeners['custom'][service.alias], [func2, func3])
  })
})