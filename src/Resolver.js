import toposort from 'toposort'
import Reflect from 'harmony-reflect'
import { findParameter, findService, findTag } from './Flask'
import {
  paramNotRegisteredException,
  serviceNotRegisteredException,
  tagNotRegisteredException,
  circularDependencyParameterError,
  circularDependencyServiceError,
  circularDependencyTagError
} from './res/exceptions'

export default class Resolver {
  constructor(flask) {
    this.flask = flask
    this.circularDependency = []
  }

  resolveParameter(alias, parentAlias = null) {
    const parameter = findParameter(alias, this.flask)
    if (!parameter) {
      throw paramNotRegisteredException(alias)
    }

    return this.resolveParameterDependencies(parameter.value, parentAlias)
  }

  resolveService(alias, parentAlias = null) {
    const service = findService(alias, this.flask)
    if (!service) {
      throw serviceNotRegisteredException(alias)
    }

    const resolvedDeps = service.args.length === 0
      ? []
      : service.args.map(dependency => {
        return this.resolveServiceDependencies(dependency, parentAlias)
      })

    return service.build(resolvedDeps)
  }

  resolveTag(alias, parentAlias = null) {
    const dependencies = findTag(alias, this.flask)
    if (!dependencies) {
      throw tagNotRegisteredException(alias)
    }

    return dependencies.map(dependency => {
      return this.resolveTagDependencies(dependency, parentAlias)
    })
  }

  resolveParameterDependencies(reference, parentAlias) {
    if (this.isReferenceToParameter(reference)) {
      return this.resolveParameterReference(reference, parentAlias)
    }
    return reference
  }

  resolveServiceDependencies(reference, parentAlias) {
    if (this.isReferenceToParameter(reference)) {
      return this.resolveParameterReference(reference, parentAlias)
    } else if (this.isReferenceToService(reference)) {
      return this.resolveServiceReference(reference, parentAlias)
    } else if (this.isReferenceToTag(reference)) {
      return this.resolveTagReference(reference, parentAlias)
    }
    return reference
  }

  resolveTagDependencies(reference, parentAlias) {
    // Currently, one tag can resolve its arguments exactly the same
    // way than one service, so we'll reuse its resolution function
    return this.resolveServiceDependencies(reference, parentAlias)
  }

  resolveParameterReference(reference, parentAlias) {
    const alias = this.extractParameterAliasFromReference(reference)
    this.checkCircularDependency(parentAlias, reference)
    return this.resolveParameter(alias, reference)
  }

  resolveServiceReference(reference, parentAlias) {
    const alias = this.extractServiceAliasFromReference(reference)
    this.checkCircularDependency(parentAlias, reference)
    return this.resolveService(alias, reference)
  }

  resolveTagReference(reference, parentAlias) {
    const alias = this.extractTagAliasFromReference(reference)
    this.checkCircularDependency(parentAlias, reference)
    return this.resolveTag(alias, reference)
  }

  checkCircularDependency(reference, dependency) {
    if (reference !== null) {
      this.circularDependency.push([reference, dependency])

      try {
        toposort(this.circularDependency)
      } catch (e) {
        if (this.isReferenceToParameter(reference)) {
          throw circularDependencyParameterError(this.extractParameterAliasFromReference(reference))
        } else if (this.isReferenceToService(reference)) {
          throw circularDependencyServiceError(this.extractServiceAliasFromReference(reference))
        } else {
          throw circularDependencyTagError(this.extractTagAliasFromReference(reference))
        }
      }
    }
  }

  isReferenceToParameter(value) {
    const delimiter = Reflect.get(this.flask.config, 'paramDelimiter')
    return typeof value === 'string' && value.match(`\\${delimiter}.*\\${delimiter}`)
  }

  isReferenceToService(value) {
    const delimiter = Reflect.get(this.flask.config, 'serviceDelimiter')
    return typeof value === 'string' && value.match(`\\${delimiter}.*\\${delimiter}`)
  }

  isReferenceToTag(value) {
    const delimiter = Reflect.get(this.flask.config, 'tagDelimiter')
    return typeof value === 'string' && value.match(`\\${delimiter}.*\\${delimiter}`)
  }

  extractParameterAliasFromReference(value) {
    return value.substr(1, value.length - 2)
  }

  extractServiceAliasFromReference(value) {
    return value.substr(1, value.length - 2)
  }

  extractTagAliasFromReference(value) {
    return value.substr(1, value.length - 2)
  }
}
