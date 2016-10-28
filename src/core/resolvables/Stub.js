export default class Stub {
  constructor() {
    this._returnsValue = null
  }

  get returnValue () {
    return this._returnsValue
  }

  returns(value) {
    this._returnsValue = value
  }
}