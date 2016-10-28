import Tag from './resolvables/Tag'
import Service from './resolvables/Service'
import Singleton from './resolvables/Singleton'
import Parameter from './resolvables/Parameter'
import Reference from './resolvables/Reference'

import Mockery from './Mockery'
import Resolver from './Resolver'
import Configurator from './Configurator'
import EventDispatcher from './EventDispatcher'
import DecoratorResolver from './DecoratorResolver'

import {
  paramNotRegisteredException,
  serviceNotRegisteredException,
  tagNotRegisteredException
} from '../res/exceptions'

export default class Container {
  constructor(flask, config) {
    this.config = {}

    this.tags = []
    this.services = []
    this.parameters = []

    this.mockery = new Mockery(this)
    this.resolver = new Resolver(this)
    this.configResolver = new Configurator(this)
    this.eventDispatcher = new EventDispatcher(flask)
    this.decoratorResolver = new DecoratorResolver(flask)

    this.configResolver.instantiationConfiguration(config)
  }

  addConfigValue(key, value) {
    this.config[key] = value
  }

  addParameter(alias, value) {
    this.parameters.push(new Parameter(alias, this.createReference(value)))
  }

  addService(alias, definition, args, isSingleton = false) {
    const references = args.map(value => this.createReference(value))

    if (!isSingleton) {
      this.services.push(new Service(alias, definition, references))
    } else {
      this.services.push(new Singleton(alias, definition, references))
    }
  }

  addTag(alias, args) {
    if (!Array.isArray(args)) {
      args = [args]
    }

    const references = args.map(value => this.createReference(value))
    const tag = this.findTag(alias)
    if (!tag) {
      this.tags.push(new Tag(alias, references))
    } else {
      tag.addReferences(references)
    }
  }

  addDecorator(alias, definition) {
    this.decoratorResolver.add(alias, definition)
  }

  addListener(event, alias, handler) {
    this.eventDispatcher.addListener(event, alias, handler)
  }

  setMock(alias) {
    return this.mockery.setMock(alias)
  }

  getConfigValue(key) {
    return this.config[key] || null
  }

  makeParameter(alias) {
    const parameter = this.findParameter(alias)
    if (!parameter) {
      throw paramNotRegisteredException(alias)
    }
    return this.resolver.resolveParameter(parameter)
  }

  makeService(alias) {
    const mock = this.mockery.find(alias)
    if (mock) {
      return mock
    }

    const service = this.findService(alias)
    if (!service) {
      throw serviceNotRegisteredException(alias)
    }
    return this.resolver.resolveService(service)
  }

  makeTag(alias) {
    const tag = this.findTag(alias)
    if (!tag) {
      throw tagNotRegisteredException(alias)
    }
    return this.resolver.resolveTag(tag)
  }

  makeFunction(definition, args, context) {
    const deps = args.map(value => this.createReference(value))
      .map(reference => {
        return this.resolver.resolveReference(reference)
      })
    return definition.bind(context, ...deps)
  }

  findParameter (alias) {
    return this.parameters.find(parameter => parameter.alias === alias)
  }

  findService (alias) {
    return this.services.find(service => service.alias === alias)
  }

  findTag (alias) {
    return this.tags.find(tag => tag.alias === alias)
  }

  createReference(valueOrReference) {
    return new Reference(this.config, valueOrReference)
  }
}
