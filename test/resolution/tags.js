import Flask from '../../src/Flask'

describe('Tags', () => {
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
})