import Reflect from 'harmony-reflect'

export default class Reference {
  constructor(config, value) {
    this._config = config
    this._value = value
  }

  get config() {
    return this._config
  }

  get value() {
    return this._value
  }

  extractAlias() {
    return this.value.substr(1, this.value.length - 2)
  }

  isParameter() {
    return this.is(Reflect.get(this.config, 'paramDelimiter'))
  }

  isService() {
    return this.is(Reflect.get(this.config, 'serviceDelimiter'))
  }

  isTag() {
    return this.is(Reflect.get(this.config, 'tagDelimiter'))
  }

  is(delimiter) {
    return typeof this.value === 'string' && this.value.match(`\\${delimiter}.*\\${delimiter}`)
  }
}
