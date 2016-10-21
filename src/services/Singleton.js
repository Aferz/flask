import Service from './Service'

export default class Singleton extends Service {
  /* istanbul ignore next */
  constructor(alias, definition, args) {
    super(alias, definition, args)
    this.instance = null
  }

  build(dependencies) {
    if (this.instance !== null) {
      return this.instance
    }
    /* istanbul ignore next */
    return this.instance = super.build(dependencies)
  }
}
