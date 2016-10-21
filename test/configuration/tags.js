import Flask from '../../src/Flask'

describe('Tags', () => {
  it('Set tag from instantiation', () => {
    class serviceA {}
    class serviceB {}
    const config = {
      services: {
        aliasA: {
          service: serviceA,
          tags: 'tag1'
        },
        aliasB: {
          service: serviceB,
          tags: ['tag1', 'tag2']
        }
      }
    }

    const flask = new Flask(config)
    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.property(flask.tags, 'tag1')
    assert.property(flask.tags, 'tag2')
    assert.deepEqual(flask.tags.tag1, ['aliasA', 'aliasB'])
    assert.deepEqual(flask.tags.tag2, ['aliasB'])
  })

  it('Set tag manually', () => {
    class serviceA {}
    class serviceB {}
    const flask = new Flask()
    flask.service('aliasA', serviceA)
    flask.service('aliasB', serviceB)
    flask.tag('tag1', ['aliasA', 'aliasB'])
    flask.tag('tag2', ['aliasB'])

    const service1 = flask.services[0]
    const service2 = flask.services[1]
    assert.property(flask.tags, 'tag1')
    assert.property(flask.tags, 'tag2')
    assert.deepEqual(flask.tags.tag1, ['aliasA', 'aliasB'])
    assert.deepEqual(flask.tags.tag2, ['aliasB'])
  })

  it('Setting a tag twice, adds service(s) to its array', () => {
    class serviceA {}
    class serviceB {}
    const flask = new Flask()
    flask.service('aliasA', serviceA)
    flask.service('aliasB', serviceB)
    flask.tag('tag1', ['aliasA', 'aliasB'])
    flask.tag('tag1', ['aliasA'])

    assert.property(flask.tags, 'tag1')
    assert.deepEqual(flask.tags.tag1, ['aliasA', 'aliasB', 'aliasA'])
  })
})