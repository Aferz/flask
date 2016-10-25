export default class Parameter {
  constructor(alias, reference) {
    this._alias = alias
    this._reference = reference
  }

  get alias() {
    return this._alias
  }

  get reference() {
    return this._reference
  }

  make() {
    return this.reference.value
  }
}
