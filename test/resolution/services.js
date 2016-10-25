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

  it('Resolve registered service with no dependencies', () => {
    class Service {}
    const flask = new Flask()
    flask.service('Service', Service)

    assert.instanceOf(flask.make('Service'), Service)
  })

  it('Resolve registered service with primitive dependencies', () => {
    function Service (arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
      this.arg1 = arg1
      this.arg2 = arg2
      this.arg3 = arg3
      this.arg4 = arg4
      this.arg5 = arg5
      this.arg6 = arg6
      this.arg7 = arg7
    }

    const flask = new Flask()
    const testObj = { key: 'value' }
    const testFunc = () => {}
    const testArr = [ 'value1', 'value2' ]
    flask.service('serviceA', Service, [true, 'value1', 5, 1.2, testArr, testObj, testFunc])

    const service = flask.make('serviceA');
    assert.deepEqual(service.arg1, true)
    assert.deepEqual(service.arg2, 'value1')
    assert.deepEqual(service.arg3, 5)
    assert.deepEqual(service.arg4, 1.2)
    assert.deepEqual(service.arg5, testArr)
    assert.deepEqual(service.arg6, testObj)
    assert.deepEqual(service.arg7, testFunc)
  })

  it('Resolve registered service with reference to parameter', () => {
    function Service(arg1) {
      this.arg1 = arg1
    }
    const flask = new Flask()
    flask.parameter('key', 'value')
    flask.service('Service', Service, ['%key%'])

    const service = flask.make('Service')
    assert.deepEqual(service.arg1, 'value')
  })

  it('Resolve registered service with reference to service', () => {
    function Service1(arg1) {
      this.arg1 = arg1
    }
    function Service2(arg1) {
      this.arg1 = arg1
    }
    const flask = new Flask()
    flask.service('Service1', Service1, ['@Service2@'])
    flask.service('Service2', Service2)

    const service1 = flask.make('Service1')
    assert.instanceOf(service1.arg1, Service2)
  })

  it('Resolve registered service with reference to tag', () => {
    function Service (arg1) {
      this.arg1 = arg1
    }
    const flask = new Flask()
    flask.tag('tag1', ['String1', 'String2'])
    flask.service('Service', Service, ['#tag1#'])

    const service = flask.make('Service')
    assert.strictEqual(service.arg1[0], 'String1')
    assert.strictEqual(service.arg1[1], 'String2')
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

    assert.throws(() => flask.make('Service1'), Error, "Circular dependency detected: Service1 -> Service2 -> Service1")
    assert.throws(() => flask.make('Service2'), Error, "Circular dependency detected: Service2 -> Service1 -> Service2")
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