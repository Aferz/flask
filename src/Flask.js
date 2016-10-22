import Resolver from './Resolver'
import Reflect from 'harmony-reflect'
import { configureFlask } from './util/config'
import DecoratorResolver from './core/DecoratorResolver'
import { Service, Singleton, Parameter } from './services'
import { GLOBAL_NAMESPACE, ON_RESOLVED } from './res/listeners'
import {
  tagNotRegisteredException,
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
    this.decoratorResolver = new DecoratorResolver(this)

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

  decorate(alias, definition) {
    this.decoratorResolver.add(alias, definition)
  }

  listen(event, alias, handler) {
    if (typeof alias === 'function') {
      handler = alias
      alias = GLOBAL_NAMESPACE
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
    const decoratedValue = this.decoratorResolver.apply(alias, value)
    dispatchListeners(alias, decoratedValue, this)
    return decoratedValue
  }

  make(alias) {
    let service = new Resolver(this).resolveService(alias)
    service = this.decoratorResolver.apply(alias, service)
    dispatchListeners(alias, service, this)
    return service
  }

  tagged(name) {
    return new Resolver(this).resolveTag(name)
  }

  call(definition, dependencies, context = null) {
    return this.wrap(definition, dependencies, context)()
  }

  wrap(definition, dependencies, context = null) {
    const resolver = new Resolver(this)
    const resolvedDeps = dependencies.map(dependency => {
      return resolver.resolveServiceDependencies(dependency, null)
    })
    return definition.bind(context, ...resolvedDeps)
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

const findListeners = (event, alias, flask) => {
  if (Reflect.has(flask.listeners, event)) {
    return Reflect.get(flask.listeners[event], alias) || []
  }
  return []
}

const dispatchListeners = (alias, instance, flask) => {
  findListeners(ON_RESOLVED, GLOBAL_NAMESPACE, flask)
    .concat(findListeners(ON_RESOLVED, alias, flask))
    .map(listener => {
      listener(instance, flask)
    })
}
