import Reflect from 'harmony-reflect'
import { ON_RESOLVED } from '../res/listeners'

export const GLOBAL_NAMESPACE = '__global__'

export default class EventDispatcher {
  constructor(flask) {
    this.flask = flask
    this.listeners = {}
  }

  addListener(event, alias, handler) {
    [event, alias, handler] = this.normalizeListener(event, alias, handler)

    this.getEventPlaceholder(event, alias)
      .push(handler)

    return this
  }

  dispatch(event, alias, instance) {
    this.findGlobalEvent(event, GLOBAL_NAMESPACE)
      .concat(this.findServiceEvent(event, alias))
      .map(listener => {
        listener(instance, this.flask)
      })
  }

  dispatchOnResolved(alias, instance) {
    this.dispatch(ON_RESOLVED, alias, instance)
  }

  findServiceEvent(event, alias) {
    if (Reflect.has(this.listeners, event)) {
      return Reflect.get(this.listeners[event], alias) || []
    }
    return []
  }

  findGlobalEvent(event) {
    return this.findServiceEvent(event, GLOBAL_NAMESPACE)
  }

  normalizeListener(event, alias, handler) {
    if (typeof alias === 'function') {
      handler = alias
      alias = GLOBAL_NAMESPACE
    }
    return [ event, alias, handler ]
  }

  getEventPlaceholder(event, alias) {
    if (!Reflect.has(this.listeners, event)) {
      this.listeners[event] = {}
    }
    if (!Array.isArray(this.listeners[event][alias])) {
      this.listeners[event][alias] = []
    }
    return this.listeners[event][alias]
  }
}
