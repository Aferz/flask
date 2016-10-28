import Reflect from 'harmony-reflect'
import Mock from './resolvables/Mock'

export default class Mockery {
  constructor(container) {
    this.container = container
    this.mocks = {}
  }

  find(alias) {
    return Reflect.get(this.mocks, alias) || null
  }

  setMock(alias) {
    this.mocks[alias] = new Mock(alias)
    return this.mocks[alias]
  }
}
