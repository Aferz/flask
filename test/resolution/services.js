import Flask from '../../src/Flask'

describe('Services', () => {
  it('Service must return new instance on every make call', () => {
    class Service {}
    const flask = new Flask()
    flask.service('Service', Service)

    const serviceInstance1 = flask.make('Service')
    const serviceInstance2 = flask.make('Service')
    assert.notStrictEqual(serviceInstance1, serviceInstance2)
  })

  it('Singleton must return same instance on every make call', () => {
    class Service {}
    const flask = new Flask()
    flask.singleton('Service', Service)

    const serviceInstance1 = flask.make('Service')
    const serviceInstance2 = flask.make('Service')
    assert.strictEqual(serviceInstance1, serviceInstance2)
  })

  it('Resolve registered service without dependencies', () => {
    class Service {}
    const flask = new Flask()
    flask.service('Service', Service)

    assert.instanceOf(flask.make('Service'), Service)
  })

  it('Resolve registered service with primitive dependencies', () => {
    class Service {
      constructor(arg1) {
        this.arg1 = arg1
      }
    }
    const flask = new Flask()
    const testObj = { key: 'value' }
    const testFunc = () => {}
    const testArr = [ 'value1', 'value2' ]
    flask.service('serviceA', Service, [true])
    flask.service('serviceB', Service, ['value1'])
    flask.service('serviceC', Service, [5])
    flask.service('serviceD', Service, [15.45])
    flask.service('serviceE', Service, [testArr])
    flask.service('serviceF', Service, [testObj])
    flask.service('serviceG', Service, [testFunc])

    assert.deepEqual(flask.make('serviceA').arg1, true)
    assert.deepEqual(flask.make('serviceB').arg1, 'value1')
    assert.deepEqual(flask.make('serviceC').arg1, 5)
    assert.deepEqual(flask.make('serviceD').arg1, 15.45)
    assert.deepEqual(flask.make('serviceE').arg1, testArr)
    assert.deepEqual(flask.make('serviceF').arg1, testObj)
    assert.deepEqual(flask.make('serviceG').arg1, testFunc)
  })

  it('Resolve registered service with reference to parameter', () => {
    function Service(arg1, arg2) {
      this.arg1 = arg1
      this.arg2 = arg2
    }
    const flask = new Flask()
    flask.parameter('key', 'value')
    flask.service('Service', Service, [true, '%key%'])

    const service = flask.make('Service')
    assert.deepEqual(service.arg1, true)
    assert.deepEqual(service.arg2, 'value')
  })

  it('Resolve registered service with reference to service', () => {
    function Service1(arg1, arg2) {
      this.arg1 = arg1
      this.arg2 = arg2
    }
    function Service2(arg1) {
      this.arg1 = arg1
    }
    const flask = new Flask()
    flask.parameter('key', 'value')
    flask.service('Service1', Service1, [true, '@Service2@'])
    flask.service('Service2', Service2, ['%key%'])

    const service1 = flask.make('Service1')
    const service2 = flask.make('Service2')
    assert.deepEqual(service1.arg1, true)
    assert.instanceOf(service1.arg2, Service2)
    assert.deepEqual(service2.arg1, 'value')
  })

  it('Throws error when resolving unregistered service', () => {
    const flask = new Flask()

    assert.throws(() => flask.make('service'), "Service 'service' not registered in flask")
  })

  it('Throws exception when resolving circular dependency', () => {
    function Service1() {}
    function Service2() {}
    const flask = new Flask()
    flask.service('Service1', Service1, ['@Service2@'])
    flask.service('Service2', Service2, ['@Service1@'])

    assert.throws(() => flask.make('Service1'), Error, "Circular dependency in service 'Service1'")
    assert.throws(() => flask.make('Service2'), Error, "Circular dependency in service 'Service2'")
  })

  it('Resolves dependencies definition before call it whe using \'call\' method', () => {
    function ServiceA(arg1) {
      this.arg1 = arg1
    }
    class ServiceB{}
    const customContext = { key: 'value' }
    const flask = new Flask()
    flask.parameter('key', 'value')
    flask.service('serviceA', ServiceA, ['@serviceB@'])
    flask.service('serviceB', ServiceB)

    function func1(arg1, arg2) {
      assert.equal(arg1, 'value')
      assert.instanceOf(arg2, ServiceA)
      assert.instanceOf(arg2.arg1, ServiceB)
      assert.equal(this, customContext)
    }    
    function func2() {
      assert.equal(this, null)
    }
    flask.call(func1, ['%key%', '@serviceA@'], customContext)
    flask.call(func2, [])
  })

  it('Resolves dependencies definition before wrap it whe using \'wrap\' method', () => {
    function ServiceA(arg1) {
      this.arg1 = arg1
    }
    class ServiceB{}
    const customContext = { key: 'value' }
    const flask = new Flask()
    flask.parameter('key', 'value')
    flask.service('serviceA', ServiceA, ['@serviceB@'])
    flask.service('serviceB', ServiceB)

    function func1(arg1, arg2) {
      assert.equal(arg1, 'value')
      assert.instanceOf(arg2, ServiceA)
      assert.instanceOf(arg2.arg1, ServiceB)
      assert.equal(this, customContext)
    }
    function func2() {
      assert.equal(this, null)
    }
    const wrappedFunc = flask.wrap(func1, ['%key%', '@serviceA@'], customContext)()
    const wrappedFunc2 = flask.wrap(func2, [])()
  })
})