import Resolver from './Resolver'
import Reflect from 'harmony-reflect'
import { configureFlask } from './util/config'
import { Service, Singleton, Parameter } from './services'
import { GLOBAL_LISTENER_NAME, ON_RESOLVED } from './res/listeners'
import {
  paramAlreadyExistsException,
  serviceAlreadyExistsException
} from './res/exceptions'

export default class Flask {
  constructor(config = {}) {
    this.config = {}
    this.parameters = []
    this.services = []
    this.tags = {}
    this.listeners = {}

    configureFlask(config, this)
  }

  setConfigValue(key, value) {
    this.config[key] = value
  }

  parameter(alias, value) {
    const parameter = findParameter(alias, this)
    if (parameter) {
      throw paramAlreadyExistsException(alias)
    }

    this.parameters.push(new Parameter(alias, value))
  }

  service(alias, definition, args = []) {
    const service = findService(alias, this)
    if (service) {
      throw serviceAlreadyExistsException(alias)
    }

    this.services.push(new Service(alias, definition, args))
  }

  singleton(alias, definition, args = []) {
    const service = findService(alias, this)
    if (service) {
      throw serviceAlreadyExistsException(alias)
    }

    this.services.push(new Singleton(alias, definition, args))
  }

  tag(name, alias) {
    if (!Array.isArray(alias)) {
      alias = [alias]
    }
    this.tags[name] = (this.tags[name] || []).concat(alias)
  }

  listen(event, alias, handler) {
    if (typeof alias === 'function') {
      handler = alias
      alias = GLOBAL_LISTENER_NAME
    }
    if (!Reflect.has(this.listeners, event)) {
      this.listeners[event] = {}
    }
    if (!Array.isArray(this.listeners[event][alias])) {
      this.listeners[event][alias] = []
    }
    this.listeners[event][alias].push(handler)
  }

  cfg(key) {
    return Reflect.get(this.config, key) || null
  }

  value(alias) {
    const value = new Resolver(this).resolveParameter(alias)
    dispatchResolvedListeners(alias, value, this)
    return value
  }

  make(alias) {
    const service = new Resolver(this).resolveService(alias)
    dispatchResolvedListeners(alias, service, this)
    return service
  }

  tagged(alias) {
    const tag = new Resolver(this).resolveTag(alias)
    // dispatchResolvedListeners(alias, service, this)
    return tag
  }

  call(definition, dependencies, context = null) {
    return this.wrap(definition, dependencies, context)()
  }

  wrap(definition, dependencies, context = null) {
    return definition.bind(context, ...resolveDependencies(dependencies, this))
  }
}

export const findParameter = (alias, flask) => {
  return flask.parameters.find(parameter => parameter.alias === alias)
}

export const findService = (alias, flask) => {
  return flask.services.find(service => service.alias === alias)
}

export const findTag = (name, flask) => {
  return Reflect.get(flask.tags, name) || null
}

const resolveDependencies = (dependencies, flask) => {
  const resolver = new Resolver(flask)
  return dependencies.map(dependency => {
    return resolver.resolveServiceDependencies(dependency)
  })
}

const findGlobalListeners = (event, flask) => {
  if (Reflect.has(flask.listeners, event)) {
    return Reflect.get(flask.listeners[event], GLOBAL_LISTENER_NAME) || []
  }
  return []
}

const findListeners = (event, alias, flask) => {
  if (Reflect.has(flask.listeners, event)) {
    return Reflect.get(flask.listeners[event], alias) || []
  }
  return []
}

const dispatchResolvedListeners = (alias, instance, flask) => {
  findGlobalListeners(ON_RESOLVED, flask)
    .concat(findListeners(ON_RESOLVED, alias, flask))
    .map(listener => {
      listener(instance, flask)
    })
}
