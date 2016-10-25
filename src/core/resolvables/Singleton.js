import Service from './Service'

export default class Singleton extends Service {
  /* istanbul ignore next */
  constructor(alias, definition, references) {
    super(alias, definition, references)
    this._instance = null
  }

  make(resolvedDeps) {
    if (this._instance !== null) {
      return this._instance
    }
    /* istanbul ignore next */
    return this._instance = super.make(resolvedDeps)
  }
}
