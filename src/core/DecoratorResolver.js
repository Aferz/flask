import Reflect from 'harmony-reflect'

export const GLOBAL_NAMESPACE = '__global__'

export default class DecoratorResolver {
  constructor(flask) {
    this.flask = flask
    this.decorators = {}
  }

  find(alias) {
    return Reflect.get(this.decorators, alias) || []
  }

  add(alias, definition) {
    if (typeof alias === 'function') {
      definition = alias
      alias = GLOBAL_NAMESPACE
    }
    this.decorators[alias] = (this.decorators[alias] || []).concat(definition)
  }

  apply(alias, instance) {
    return this.find(GLOBAL_NAMESPACE)
      .concat(this.find(alias))
      .reduce((decoratedInstance, decorator) => {
        return decorator(decoratedInstance, this.flask)
      }, instance)
  }
}
