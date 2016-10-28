import Stub from './Stub'

export default class Mock {
  constructor(alias) {
    this._alias = alias
    this._stubs = {}
  }

  get alias() {
    return this._alias
  }

  get stubs() {
    return this._stubs
  }

  onCall(methodName) {
    return Reflect.get(this.stubs, methodName) || (this._stubs[methodName] = new Stub())
  }
}
/*
const mock = container.mock('serviceA')

  mock.onCall('makeThings').returns('10')
  mock.onCall('makeThings').returns('20')
  mock.onCall('makeThings')
    .returns('40')
    .onCall('makeThings2')
    .forTime(2)
    .returns('40') */

