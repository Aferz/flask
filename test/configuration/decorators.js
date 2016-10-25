import Flask from '../../src/Flask'
import { GLOBAL_NAMESPACE } from '../../src/core/DecoratorResolver'

describe('Decorators', () => {
  it('Set global decorator from instantiation', () => {
    const func1 = () => {}
    const func2 = () => {}
    const config = {
      'decorators': [func1, func2]
    }

    const flask = new Flask(config);
    assert.deepEqual(flask.container.decoratorResolver.decorators[GLOBAL_NAMESPACE][0], func1)
    assert.deepEqual(flask.container.decoratorResolver.decorators[GLOBAL_NAMESPACE][1], func2)
  })

  it('Set parameter decorator from instantiation', () => {
    const func1 = () => {}
    const config = {
      parameters: {
        param1: {
          value: 'Parameter 1',
          decorators: [func1]
        },
      }
    }

    const flask = new Flask(config)
    assert.deepEqual(flask.container.decoratorResolver.decorators['param1'][0], func1)
  })

  it('Set service decorator from instantiation', () => {
    const func1 = () => {}
    const Service = () => {}
    const config = {
      services: {
        alias: {
          definition: Service,
          decorators: [func1]
        }
      }
    }

    const flask = new Flask(config)
    assert.deepEqual(flask.container.decoratorResolver.decorators['alias'][0], func1)
  })

  it('Set service decorator as string converts it into an array from instantiation', () => {
    const func1 = () => {}
    const Service = () => {}
    const config = {
      services: {
        alias: {
          definition: Service,
          decorators: func1
        }
      }
    }

    const flask = new Flask(config)
    assert.deepEqual(flask.container.decoratorResolver.decorators['alias'], [func1])
  })

  it('Set global decorator manually', () => {
    const func1 = () => {}
    const func2 = () => {}
    const flask = new Flask();
    flask.decorate(func1)
    flask.decorate(func2)

    assert.deepEqual(flask.container.decoratorResolver.decorators[GLOBAL_NAMESPACE][0], func1)
    assert.deepEqual(flask.container.decoratorResolver.decorators[GLOBAL_NAMESPACE][1], func2)
  })

  it('Set service/parameter decorator manually', () => {
    const func1 = () => {}
    const func2 = () => {}
    const flask = new Flask();
    flask.decorate('serviceA', func1)
    flask.decorate('serviceB', func2)

    assert.deepEqual(flask.container.decoratorResolver.decorators['serviceA'][0], func1)
    assert.deepEqual(flask.container.decoratorResolver.decorators['serviceB'][0], func2)
  })

  it('Set decorator twice just concat functions', () => {
    const func1 = () => {}
    const func2 = () => {}
    const flask = new Flask();
    flask.decorate('serviceA', func1)
    flask.decorate('serviceA', func2)
    
    assert.deepEqual(flask.container.decoratorResolver.decorators['serviceA'], [func1, func2])
  })
})