import Flask from '../../src/Flask'

describe('Tags', () => {
  it('Resolves registered tags loaded from configuration', () => {
    function definitionA () {}
    const config = {
      parameters: {
        paramA: {
          value: 'value',
          tags: 'tag1'
        }
      },
      services: {
        aliasA: {
          service: definitionA,
          tags: ['tag1', 'tag2']
        }
      }
    }

    const flask = new Flask(config)
    const resolvedDeps1 = flask.tagged('tag1')
    const resolvedDeps2 = flask.tagged('tag2')
    assert.deepEqual(resolvedDeps1[0], 'value')
    assert.instanceOf(resolvedDeps1[1], definitionA)
    assert.instanceOf(resolvedDeps2[0], definitionA)
  })

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
    const flask = new Flask()
    function Service () {}
    flask.service('Service', Service)
    flask.tag('tag1', ['@Service@', 'String1'])
    flask.tag('tag2', ['String2', 'String3'])
    flask.tag('tag3', ['#tag1#', '#tag2#'])

    const tag = flask.tagged('tag3')
    assert.instanceOf(tag[0][0], Service)
    assert.strictEqual(tag[0][1], 'String1')
    assert.strictEqual(tag[1][0], 'String2')
    assert.strictEqual(tag[1][1], 'String3')
  })

  it('Throws exception when resolving unregistered tag', () => {
    const flask = new Flask()

    assert.throws(() => flask.tagged('tag1'), "Tag 'tag1' not registered in flask")
  })

  it('Throws exception when resolving circular dependency', () => {
    const flask = new Flask()
    flask.tag('tag1', ['#tag2#'])
    flask.tag('tag2', ['#tag1#'])

    assert.throws(() => flask.tagged('tag1'), Error, "Circular dependency detected: tag1 -> tag2 -> tag1")
    assert.throws(() => flask.tagged('tag2'), Error, "Circular dependency detected: tag2 -> tag1 -> tag2")
  })
})