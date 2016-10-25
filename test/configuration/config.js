import Flask from '../../src/Flask'
import { PARAMETER_DELIMITER_CHAR, SERVICE_DELIMITER_CHAR, TAG_DELIMITER_CHAR } from '../../src/res/config'

describe('Config Values', () => {
  it('Check default values', () => {
    const flask = new Flask()
    assert.property(flask.container.config, 'serviceDelimiter')
    assert.property(flask.container.config, 'paramDelimiter')
    assert.property(flask.container.config, 'tagDelimiter')
    assert.equal(flask.container.config.serviceDelimiter, SERVICE_DELIMITER_CHAR)
    assert.equal(flask.container.config.paramDelimiter, PARAMETER_DELIMITER_CHAR)
    assert.equal(flask.container.config.tagDelimiter, TAG_DELIMITER_CHAR)
  })

  it('Set values from instantiation', () => {
    const config = {
      config: {
        key: 'value',
      }
    }

    const flask = new Flask(config)
    assert.property(flask.container.config, 'key')
    assert.equal(flask.container.config.key, 'value')
  })

  it('Set value manually', () => {
    const flask = new Flask()
    flask.setConfigValue('serviceDelimiter', '#')
    flask.setConfigValue('key', 'value')

    assert.property(flask.container.config, 'serviceDelimiter')
    assert.property(flask.container.config, 'key')
    assert.property(flask.container.config, 'paramDelimiter')
    assert.equal(flask.container.config.serviceDelimiter, '#')
    assert.equal(flask.container.config.paramDelimiter, '%')
    assert.equal(flask.container.config.key, 'value')
  })

  it('Set registered value overrides it', () => {
    const flask = new Flask()
    flask.setConfigValue('serviceDelimiter', '#')

    assert.equal(flask.container.config.serviceDelimiter, '#')
  })
})