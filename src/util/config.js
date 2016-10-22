import Reflect from 'harmony-reflect'
import { GLOBAL_NAMESPACE } from '../res/listeners'
import { PARAMETER_DELIMITER_CHAR, SERVICE_DELIMITER_CHAR, TAG_DELIMITER_CHAR } from '../res/config'

export const configureFlask = (configObject, flask) => {
  registerConfigValues(Reflect.get(configObject, 'config') || {}, flask)

  if (Reflect.has(configObject, 'parameters')) {
    registerParameters(configObject.parameters, flask)
  }
  if (Reflect.has(configObject, 'services')) {
    registerServices(configObject.services, flask)
  }
  if (Reflect.has(configObject, 'decorators')) {
    registerDecorators(GLOBAL_NAMESPACE, configObject.decorators, flask)
  }
  if (Reflect.has(configObject, 'listeners')) {
    registerGlobalListeners(configObject.listeners, flask)
  }
}

const registerConfigValues = (config, flask) => {
  for (let key in config) {
    flask.setConfigValue(key, config[key])
  }
  registerDefaultConfigValue(flask)
}

const registerDefaultConfigValue = (flask) => {
  flask.setConfigValue('serviceDelimiter', flask.config.serviceDelimiter || SERVICE_DELIMITER_CHAR)
  flask.setConfigValue('paramDelimiter', flask.config.paramDelimiter || PARAMETER_DELIMITER_CHAR)
  flask.setConfigValue('tagDelimiter', flask.config.tagDelimiter || TAG_DELIMITER_CHAR)
}

const registerParameters = (parameters, flask) => {
  for (let param in parameters) {
    const isObj = typeof parameters[param] === 'object'
    const value = isObj ? parameters[param].value : parameters[param]
    const decorators = isObj ? Reflect.get(parameters[param], 'decorators') || [] : []

    flask.parameter(param, value)
    
    registerDecorators(param, decorators, flask)
  }
}

const registerServices = (services, flask) => {
  for (let alias in services) {
    const service = Reflect.get(services[alias], 'service')
    const args = Reflect.get(services[alias], 'arguments') || []
    const tags = Reflect.get(services[alias], 'tags') || []
    const decorators = Reflect.get(services[alias], 'decorators') || []
    const listeners = Reflect.get(services[alias], 'listeners') || {}
    const isSingleton = Reflect.get(services[alias], 'singleton') || false

    isSingleton === true
    ? flask.singleton(alias, service, args)
    : flask.service(alias, service, args)

    registerTags(alias, tags, flask)
    registerDecorators(alias, decorators, flask)
    registerServiceListeners(alias, listeners, flask)
  }
}

const registerTags = (alias, tags, flask) => {
  if (!Array.isArray(tags)) {
    tags = [tags]
  }
  for (let tag in tags) {
    flask.tag(tags[tag], alias)
  }
}

const registerDecorators = (alias, decorators, flask) => {
  if (!Array.isArray(decorators)) {
    decorators = decorators
  }
  for (let decorator in decorators) {
    flask.decorate(alias, decorators[decorator])
  }
}

const registerGlobalListeners = (listeners, flask) => {
  for (let type in listeners) {
    for (let index in listeners[type]) {
      flask.listen(type, listeners[type][index])
    }
  }
}

const registerServiceListeners = (alias, listeners, flask) => {
  for (let type in listeners) {
    for (let index in listeners[type]) {
      flask.listen(type, alias, listeners[type][index])
    }
  }
}
