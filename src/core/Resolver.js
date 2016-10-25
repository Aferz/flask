import toposort from 'toposort'
import { circularDependencyException } from '../res/exceptions'

export default class Resolver {
  constructor(container) {
    this.container = container
  }

  resolveParameter(parameter, dependantReference = null, resolvedDeps = []) {
    if (parameter.reference.isParameter()) {
      return this.resolveParameterReference(parameter.reference, dependantReference, resolvedDeps)
    }
    return this.resolveListenersAndDecorators(parameter.alias, parameter.make())
  }

  resolveService(service, dependantReference = null, resolvedDeps = []) {
    const deps = service.references.map(reference => {
      return this.resolveReference(reference, dependantReference, resolvedDeps)
    })
    return this.resolveListenersAndDecorators(service.alias, service.make(deps))
  }

  resolveTag(tag, dependantReference = null, resolvedDeps = []) {
    const deps = tag.references.map(reference => {
      return this.resolveReference(reference, dependantReference, resolvedDeps)
    })
    return tag.make(deps)
  }

  resolveParameterReference(reference, dependentReference, resolvedDeps) {
    const parameterAlias = reference.extractAlias()
    const parameter = this.container.findParameter(parameterAlias)

    resolvedDeps = this.checkCircularDependency(resolvedDeps, dependentReference, reference)
    return this.resolveParameter(parameter, reference, resolvedDeps)
  }

  resolveServiceReference(reference, dependentReference, resolvedDeps) {
    const serviceAlias = reference.extractAlias()
    const service = this.container.findService(serviceAlias)

    resolvedDeps = this.checkCircularDependency(resolvedDeps, dependentReference, reference)
    return this.resolveService(service, reference, resolvedDeps)
  }

  resolveTagReference(reference, dependentReference, resolvedDeps) {
    const tagAlias = reference.extractAlias()
    const tag = this.container.findTag(tagAlias)

    resolvedDeps = this.checkCircularDependency(resolvedDeps, dependentReference, reference)
    return this.resolveTag(tag, reference, resolvedDeps)
  }

  resolveReference(reference, dependantReference = null, resolvedDeps = []) {
    if (reference.isParameter()) {
      return this.resolveParameterReference(reference, dependantReference, resolvedDeps)
    } else if (reference.isService()) {
      return this.resolveServiceReference(reference, dependantReference, resolvedDeps)
    } else if (reference.isTag()) {
      return this.resolveTagReference(reference, dependantReference, resolvedDeps)
    }
    return reference.value
  }

  resolveListenersAndDecorators(alias, instance) {
    instance = this.container.decoratorResolver.apply(alias, instance)
    this.container.eventDispatcher.dispatchOnResolved(alias, instance)
    return instance
  }

  checkCircularDependency(resolvedDeps, dependantReference, dependencyReference) {
    if (dependantReference !== null && dependencyReference !== null) {
      resolvedDeps.push([
        dependantReference.extractAlias(),
        dependencyReference.extractAlias()
      ])

      try {
        toposort(resolvedDeps)
        return resolvedDeps
      } catch (e) {
        throw circularDependencyException(this.generateCircularDependencyMessage(resolvedDeps))
      }
    }
  }

  generateCircularDependencyMessage(resolvedDeps) {
    const depsChain = resolvedDeps
      .reverse()
      .reduce((carry, current) => {
        /* istanbul ignore next */
        if (carry.length === 0 || carry[carry.length - 1] === current[1]) {
          carry.push(current[0])
        }
        return carry
      }, [])

    return depsChain.join(' -> ').concat(` -> ${depsChain[0]}`)
  }
}
