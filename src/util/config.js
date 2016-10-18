import Reflect from 'harmony-reflect'
import {
  PARAMETER_DELIMITER_CHAR,
  SERVICE_DELIMITER_CHAR
} from './constants'

export const configureFlask = (configObject, flask) => {
  registerConfigValues(Reflect.get(configObject, 'config') || {}, flask)

  if (Reflect.has(configObject, 'parameters')) {
    registerParameters(configObject.parameters, flask)
  }
  if (Reflect.has(configObject, 'services')) {
    registerServices(configObject.services, flask)
  }
  if (Reflect.has(configObject, 'listeners')) {
    registerGlobalListeners(configObject.listeners, flask)
  }
}

const registerConfigValues = (config, flask) => {
  flask.setConfigValue(
    'serviceDelimiter', Reflect.has(config, 'serviceDelimiter')
      ? config['serviceDelimiter']
      : SERVICE_DELIMITER_CHAR
  )
  flask.setConfigValue(
    'paramDelimiter', Reflect.has(config, 'paramDelimiter')
      ? config['paramDelimiter']
      : PARAMETER_DELIMITER_CHAR
  )
}

const registerParameters = (parameters, flask) => {
  for (let param in parameters) {
    flask.parameter(param, parameters[param])
  }
}

const registerServices = (services, flask) => {
  for (let alias in services) {
    const service = Reflect.get(services[alias], 'service')
    const args = Reflect.get(services[alias], 'arguments') || []
    const tags = Reflect.get(services[alias], 'tags') || []
    const listeners = Reflect.get(services[alias], 'listeners') || {}
    const isSingleton = Reflect.get(services[alias], 'singleton') || false

    isSingleton === true
    ? flask.singleton(alias, service, args)
    : flask.service(alias, service, args)

    registerTags(alias, tags, flask)
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
