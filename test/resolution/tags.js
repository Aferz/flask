import Flask from '../../src/Flask'

describe('Tags', () => {
  it('Resolves registered tag with primitives dependencies', () => {
    const flask = new Flask()
    const customObj = { key: 'value' }
    const customFunc = () => {}
    const customArr = ['A1']
    flask.tag('multiple', [true, 'string', 1, 1.2, customObj, customFunc, customArr])
  
    const tagged = flask.tagged('multiple');
    assert.strictEqual(tagged[0], true)
    assert.strictEqual(tagged[1], 'string')
    assert.strictEqual(tagged[2], 1)
    assert.strictEqual(tagged[3], 1.2)
    assert.strictEqual(tagged[4], customObj)
    assert.strictEqual(tagged[5], customFunc)
    assert.strictEqual(tagged[6], customArr)
  })

  it('Resolves registered tag with reference to parameter', () => {
    const flask = new Flask()
    flask.parameter('Param', 'Value')
    flask.tag('multiple', ['%Param%'])
    
    const tagged = flask.tagged('multiple');
    assert.strictEqual(tagged[0], 'Value')
  })

  it('Resolves registered tag with reference to service', () => {
    function Service() {}
    function Singleton() {}
    const flask = new Flask()
    flask.service('Service', Service)
    flask.singleton('Singleton', Singleton)
    flask.tag('multiple', ['@Service@', '@Singleton@'])
    
    const tagged = flask.tagged('multiple');
    assert.instanceOf(tagged[0], Service)
    assert.instanceOf(tagged[1], Singleton)
  })

  it('Resolves registered tag with reference to tag', () => {
    assert.equal(true, false)
  })

  it('Throws exception when resolving unregistered tag', () => {
    const flask = new Flask()

    assert.throws(() => flask.tagged('tag1'), "Tag 'tag1' not registered in flask")
  })

  it('Throws exception when resolving circular dependency', () => {
    assert.equal(true, false)
  })
})