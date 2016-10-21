import Reflect from 'harmony-reflect'

export default class Service {
  constructor(alias, definition, args) {
    this.alias = alias
    this.definition = definition
    this.args = args
  }

  build(dependencies) {
    return Reflect.construct(this.definition, dependencies)
  }
}
