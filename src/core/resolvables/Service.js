import Reflect from 'harmony-reflect'

export default class Service {
  constructor(alias, definition, references) {
    this._alias = alias
    this._definition = definition
    this._references = references
  }

  get alias() {
    return this._alias
  }

  get definition() {
    return this._definition
  }

  get references() {
    return this._references
  }

  make(resolvedDeps) {
    return Reflect.construct(this.definition, resolvedDeps)
  }
}
