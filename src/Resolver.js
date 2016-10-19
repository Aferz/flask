import toposort from 'toposort'
import Reflect from 'harmony-reflect'
import { findParameter, findService } from './Flask'
import {
  paramNotRegisteredException,
  serviceNotRegisteredException,
  circularDependencyParameterError,
  circularDependencyServiceError
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

  resolveParameterDependencies(reference, parentAlias) {
    if (this.isReferenceToParameter(reference)) {
      const alias = this.extractParameterAliasFromReference(reference)
      this.checkCircularDependency(parentAlias, reference)
      return this.resolveParameter(alias, reference)
    }

    return reference
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

  resolveServiceDependencies(reference, parentAlias) {
    if (this.isReferenceToParameter(reference)) {
      const alias = this.extractParameterAliasFromReference(reference)
      this.checkCircularDependency(parentAlias, reference)
      return this.resolveParameter(alias, reference)
    }

    if (this.isReferenceToService(reference)) {
      const alias = this.extractServiceAliasFromReference(reference)
      this.checkCircularDependency(parentAlias, reference)
      return this.resolveService(alias, reference)
    }

    return reference
  }

  checkCircularDependency(reference, dependency) {
    if (reference !== null) {
      this.circularDependency.push([reference, dependency])

      try {
        toposort(this.circularDependency)
      } catch (e) {
        if (this.isReferenceToParameter(reference)) {
          throw circularDependencyParameterError(this.extractParameterAliasFromReference(reference))
        } else {
          throw circularDependencyServiceError(this.extractServiceAliasFromReference(reference))
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

  extractParameterAliasFromReference(value) {
    return value.substr(1, value.length - 2)
  }

  extractServiceAliasFromReference(value) {
    return value.substr(1, value.length - 2)
  }
}
