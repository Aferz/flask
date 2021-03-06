import Reflect from 'harmony-reflect'
import { GLOBAL_NAMESPACE as GLOBAL_NAMESPACE_LISTENERS } from '../core/EventDispatcher'
import { GLOBAL_NAMESPACE as GLOBAL_NAMESPACE_DECORATOR } from '../core/DecoratorResolver'
import { PARAMETER_DELIMITER_CHAR, SERVICE_DELIMITER_CHAR, TAG_DELIMITER_CHAR } from '../res/config'

export default class Configurator {
  constructor(container) {
    this.container = container
  }

  instantiationConfiguration(confObject) {
    this.registerDefaultConfiguration()
    this.merge(confObject)
  }

  merge(confObject) {
    this.registerConfigValues(confObject)
    this.registerParameters(confObject)
    this.registerServices(confObject)
    this.registerGlobalDecorators(confObject)
    this.registerGlobalListeners(confObject)
  }

  registerDefaultConfiguration() {
    this.container.addConfigValue('serviceDelimiter', SERVICE_DELIMITER_CHAR)
    this.container.addConfigValue('paramDelimiter', PARAMETER_DELIMITER_CHAR)
    this.container.addConfigValue('tagDelimiter', TAG_DELIMITER_CHAR)
  }

  registerConfigValues(confObject) {
    const values = Reflect.get(confObject, 'config') || {}

    for (let key in values) {
      this.container.addConfigValue(key, values[key])
    }
  }

  registerParameters(confObject) {
    const parameters = Reflect.get(confObject, 'parameters') || {}

    for (let param in parameters) {
      const isObj = typeof parameters[param] === 'object'
      const value = isObj ? parameters[param].value : parameters[param]
      const tags = isObj ? Reflect.get(parameters[param], 'tags') || [] : []
      const decorators = isObj ? Reflect.get(parameters[param], 'decorators') || [] : []

      this.container.addParameter(param, value)

      this.registerTags(param, tags, this.container.getConfigValue('paramDelimiter'))
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

      this.container.addService(alias, service, args, isSingleton)

      this.registerTags(alias, tags, this.container.getConfigValue('serviceDelimiter'))
      this.registerListeners(alias, listeners)
      this.registerDecorators(alias, decorators)
    }
  }

  registerTags(alias, references, delimiter) {
    if (!Array.isArray(references)) {
      references = [references]
    }
    for (let reference in references) {
      this.container.addTag(references[reference], `${delimiter}${alias}${delimiter}`)
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
      this.container.addDecorator(alias, decorators[decorator])
    }
  }

  registerGlobalListeners(confObject) {
    const listeners = Reflect.get(confObject, 'listeners') || {}
    this.registerListeners(GLOBAL_NAMESPACE_LISTENERS, listeners)
  }

  registerListeners(alias, listeners) {
    for (let type in listeners) {
      for (let index in listeners[type]) {
        this.container.addListener(type, alias, listeners[type][index])
      }
    }
  }
}
