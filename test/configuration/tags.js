import Flask from '../../src/Flask'
import Tag from '../../src/core/resolvables/Tag'
import Reference from '../../src/core/resolvables/Reference'

describe('Tags', () => {
  it('Set parameter tag from instantiation', () => {
    const config = {
      parameters: {
        aliasA: {
          value: 'value',
          tags: ['tag1']
        }
      }
    }

    const flask = new Flask(config)
    const tag1 = flask.container.tags[0]
    assert.instanceOf(tag1, Tag)
    assert.deepEqual(tag1.alias, 'tag1')
    assert.instanceOf(tag1.references[0], Reference)
    assert.deepEqual(tag1.references[0].value, '%aliasA%')
  })

  it('Set service tag from instantiation', () => {
    function definitionA () {}
    function definitionB () {}
    const config = {
      services: {
        aliasA: {
          service: definitionA,
          tags: 'tag1'
        },
        aliasB: {
          service: definitionB,
          tags: ['tag1', 'tag2']
        }
      }
    }

    const flask = new Flask(config)
    const tag1 = flask.container.tags[0]
    const tag2 = flask.container.tags[1]
    assert.instanceOf(tag1, Tag)
    assert.instanceOf(tag2, Tag)
    assert.deepEqual(tag1.alias, 'tag1')
    assert.deepEqual(tag2.alias, 'tag2')
    assert.instanceOf(tag1.references[0], Reference)
    assert.instanceOf(tag1.references[1], Reference)
    assert.deepEqual(tag1.references[0].value, '@aliasA@')
    assert.deepEqual(tag1.references[1].value, '@aliasB@')
    assert.instanceOf(tag2.references[0], Reference)
    assert.deepEqual(tag2.references[0].value, '@aliasB@')
  })

  it('Set parameter/service tag manually', () => {
    function definitionA () {}
    const flask = new Flask()
    flask.tag('tag1', ['aliasA', 'aliasB'])

    const tag1 = flask.container.tags[0]
    assert.instanceOf(tag1, Tag)
    assert.deepEqual(tag1.alias, 'tag1')
    assert.instanceOf(tag1.references[0], Reference)
    assert.instanceOf(tag1.references[1], Reference)
    assert.deepEqual(tag1.references[0].value, 'aliasA')
    assert.deepEqual(tag1.references[1].value, 'aliasB')
  })

  it('Setting a tag twice, adds service(s) to its array', () => {
    class serviceA {}
    class serviceB {}
    const flask = new Flask()
    flask.tag('tag1', ['aliasA', 'aliasB'])
    flask.tag('tag1', ['aliasA'])

    const tag1 = flask.container.tags[0]
    assert.instanceOf(tag1, Tag)
    assert.deepEqual(tag1.alias, 'tag1')
    assert.instanceOf(tag1.references[0], Reference)
    assert.instanceOf(tag1.references[1], Reference)
    assert.instanceOf(tag1.references[2], Reference)
    assert.deepEqual(tag1.references[0].value, 'aliasA')
    assert.deepEqual(tag1.references[1].value, 'aliasB')
    assert.deepEqual(tag1.references[2].value, 'aliasA')
  })
})