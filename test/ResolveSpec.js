import Flask from '../src/Flask'
import { Service, Singleton, Parameter } from '../src/services'

describe('Resolving Config', () => {
  it('Set config value', () => {
    const flask = new Flask()
    flask.setConfigValue('key', 'value')

    assert.equal(flask.config['key'], 'value')
  })

  it('Get config value', () => {
    const flask = new Flask()
    flask.setConfigValue('key', 'value')

    assert.equal(flask.cfg('key'), 'value')
  })

  it('Get config value of unregistered value returns null', () => {
    const flask = new Flask()

    assert.equal(flask.cfg('key'), null)
  })
})

describe('Resolving Parameters', () => {
  it('Resolve registered parameter', () => {
    const flask = new Flask()
    flask.parameter('key', 'value')

    assert.equal(flask.value('key'), 'value')
  })

  it('Resolve registered parameter that depends on other parameter', () => {
    const flask = new Flask()
    flask.parameter('key', '%key2%')
    flask.parameter('key2', '%key3%')
    flask.parameter('key3', 'value')

    assert.equal(flask.value('key'), 'value')
  })

  it('Throws error when resolving unregistered parameter', () => {
    const flask = new Flask()

    assert.throws(() => flask.value('key'), "Parameter 'key' not registered in flask")
  })

  it('Throw exception when resolving circular dependency', () => {
    const flask = new Flask()
    flask.parameter('key', '%key2%')
    flask.parameter('key2', '%key%')

    assert.throws(() => flask.value('key'), Error, "Circular dependency in parameter 'key'")
  })

  it('Parameter must not resolve services', () => {
    const flask = new Flask()
    flask.service('Service1', () => {})
    flask.parameter('key', '@key2@')

    assert.equal(flask.value('key'), '@key2@')
  })
})

describe('Resolving Services', () => {
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

  it('Resolves tagged service', () => {
    function Service() {}
    const flask = new Flask()
    const customObj = { key: 'value' }
    const customFunc = () => {}
    flask.service('Service', Service)
    flask.parameter('Param', 'Value1')
    flask.tag('multiple', ['@Service@', '%Param%', true, 'string', 1, 1.2, customObj, customFunc])
    
    const tagged = flask.tagged('multiple');
    assert.instanceOf(tagged[0], Service)
    assert.strictEqual(tagged[1], 'Value1')
    assert.strictEqual(tagged[2], true)
    assert.strictEqual(tagged[3], 'string')
    assert.strictEqual(tagged[4], 1)
    assert.strictEqual(tagged[5], 1.2)
    assert.strictEqual(tagged[6], customObj)
    assert.strictEqual(tagged[7], customFunc)
  })

  it('Throws exception when resolving unregistered tag', () => {
    const flask = new Flask()

    assert.throws(() => flask.tagged('tag1'), "Tag 'tag1' not registered in flask")
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

  it('Dispatch global listeners', () => {
    class ServiceA{}
    const flask = new Flask()
    flask.service('serviceA', ServiceA)
    flask.listen('resolved', (serviceInstance, containterInstance) => {
      assert.instanceOf(serviceInstance, ServiceA)
      assert.strictEqual(flask, containterInstance)
    })

    flask.make('serviceA')
  })

  it('Dispatch alias listeners', () => {
    class ServiceA{}
    const flask = new Flask()
    flask.service('serviceA', ServiceA)
    flask.service('serviceB', ServiceA)
    flask.listen('resolved', 'serviceA', (serviceInstance, containterInstance) => {
      assert.instanceOf(serviceInstance, ServiceA)
      assert.strictEqual(flask, containterInstance)
    })

    flask.make('serviceA')
  })
})