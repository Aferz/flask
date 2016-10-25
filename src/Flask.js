import Container from './core/Container'
import { ON_RESOLVED } from './res/listeners'

export default class Flask {
  constructor(config = {}) {
    this.container = new Container(this, config)
  }

  setConfigValue(key, value) {
    this.container.addConfigValue(key, value)
    return this
  }

  parameter(alias, value) {
    this.container.addParameter(alias, value)
    return this
  }

  service(alias, definition, args = []) {
    this.container.addService(alias, definition, args)
    return this
  }

  singleton(alias, definition, args = []) {
    this.container.addService(alias, definition, args, true)
    return this
  }

  tag(alias, services) {
    this.container.addTag(alias, services)
    return this
  }

  decorate(alias, definition) {
    this.container.addDecorator(alias, definition)
    return this
  }

  /* istanbul ignore next */
  listen(event, alias, handler) {
    console.warn('Method deprecated since 1.3.0 release. I\'t will be removed in 2.0 release. Use event named methods.')
    this.container.addListener(event, alias, handler)
    return this
  }

  onResolved(alias, handler) {
    this.container.addListener(ON_RESOLVED, alias, handler)
    return this
  }

  /* istanbul ignore next */
  cfg(key) {
    console.warn('Method deprecated since 1.3.0 release. I\'t will be removed in 2.0 release. Use \'.config()\' method instead.')
    return this.config(key)
  }

  config(key) {
    return this.container.getConfigValue(key)
  }

  value(alias) {
    return this.container.makeParameter(alias)
  }

  make(alias) {
    return this.container.makeService(alias)
  }

  tagged(alias) {
    return this.container.makeTag(alias)
  }

  wrap(definition, args, context = null) {
    return this.container.makeFunction(definition, args, context)
  }

  call(definition, args, context = null) {
    return this.wrap(definition, args, context)()
  }
}
