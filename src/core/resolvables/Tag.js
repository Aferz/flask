export default class Tag {
  constructor(alias, references) {
    this._alias = alias
    this._references = references
  }

  get alias() {
    return this._alias
  }

  get references() {
    return this._references
  }

  addReferences(references) {
    this._references = this._references.concat(references)
  }

  make(resolvedDeps) {
    return resolvedDeps
  }
}
