import Reflect from 'harmony-reflect'
import { GLOBAL_NAMESPACE as GLOBAL_NAMESPACE_LISTENERS } from '../res/listeners'
import { GLOBAL_NAMESPACE as GLOBAL_NAMESPACE_DECORATOR } from '../core/DecoratorResolver'
import { PARAMETER_DELIMITER_CHAR, SERVICE_DELIMITER_CHAR, TAG_DELIMITER_CHAR } from '../res/config'

export default class Configurator {
  constructor(flask) {
    this.flask = flask
  }

  configure(confObject) {
    this.registerDefaultConfiguration()

    this.registerConfigValues(confObject)
    this.registerParameters(confObject)
    this.registerServices(confObject)
    this.registerGlobalDecorators(confObject)
    this.registerGlobalListeners(confObject)
  }

  registerDefaultConfiguration() {
    this.flask.setConfigValue('serviceDelimiter', SERVICE_DELIMITER_CHAR)
    this.flask.setConfigValue('paramDelimiter', PARAMETER_DELIMITER_CHAR)
    this.flask.setConfigValue('tagDelimiter', TAG_DELIMITER_CHAR)
  }

  registerConfigValues(confObject) {
    const values = Reflect.get(confObject, 'config') || {}

    for (let key in values) {
      this.flask.setConfigValue(key, values[key])
    }
  }

  registerParameters(confObject) {
    const parameters = Reflect.get(confObject, 'parameters') || {}

    for (let param in parameters) {
      const isObj = typeof parameters[param] === 'object'
      const value = isObj ? parameters[param].value : parameters[param]
      const tags = isObj ? Reflect.get(parameters[param], 'tags') || [] : []
      const decorators = isObj ? Reflect.get(parameters[param], 'decorators') || [] : []

      this.flask.parameter(param, value)

      this.registerTags(param, tags)
      this.registerDecorators(param, decorators)
    }
  }

  registerServices(confObject) {
    const services = Reflect.get(confObject, 'services') || {}

    for (let alias in services) {
      const service = Reflect.get(services[alias], 'service')
      const args = Reflect.get(services[alias], 'arguments') || []
      const tags = Reflect.get(services[alias], 'tags') || []
      const decorators = Reflect.get(services[alias], 'decorators') || []
      const listeners = Reflect.get(services[alias], 'listeners') || {}
      const isSingleton = Reflect.get(services[alias], 'singleton') || false

      isSingleton === true
        ? this.flask.singleton(alias, service, args)
        : this.flask.service(alias, service, args)

      this.registerTags(alias, tags)
      this.registerListeners(alias, listeners)
      this.registerDecorators(alias, decorators)
    }
  }

  registerTags(alias, tags) {
    if (!Array.isArray(tags)) {
      tags = [tags]
    }
    for (let tag in tags) {
      this.flask.tag(tags[tag], alias)
    }
  }

  registerGlobalDecorators(confObject) {
    const decorators = Reflect.get(confObject, 'decorators') || []
    this.registerDecorators(GLOBAL_NAMESPACE_DECORATOR, decorators)
  }

  registerDecorators(alias, decorators) {
    if (!Array.isArray(decorators)) {
      decorators = [decorators]
    }
    for (let decorator in decorators) {
      this.flask.decorate(alias, decorators[decorator])
    }
  }

  registerGlobalListeners(confObject) {
    const listeners = Reflect.get(confObject, 'listeners') || {}
    this.registerListeners(GLOBAL_NAMESPACE_LISTENERS, listeners)
  }

  registerListeners(alias, listeners) {
    for (let type in listeners) {
      for (let index in listeners[type]) {
        this.flask.listen(type, alias, listeners[type][index])
      }
    }
  }
}