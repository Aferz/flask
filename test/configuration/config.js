import Flask from '../../src/Flask'
import { PARAMETER_DELIMITER_CHAR, SERVICE_DELIMITER_CHAR, TAG_DELIMITER_CHAR } from '../../src/res/config'

describe('Config Values', () => {
  it('Check default values', () => {
    const flask = new Flask()
    assert.property(flask.config, 'serviceDelimiter')
    assert.property(flask.config, 'paramDelimiter')
    assert.property(flask.config, 'tagDelimiter')
    assert.equal(flask.config.serviceDelimiter, SERVICE_DELIMITER_CHAR)
    assert.equal(flask.config.paramDelimiter, PARAMETER_DELIMITER_CHAR)
    assert.equal(flask.config.tagDelimiter, TAG_DELIMITER_CHAR)
  })

  it('Set values from instantiation', () => {
    const config = {
      config: {
        key: 'value',
      }
    }

    const flask = new Flask(config)
    assert.property(flask.config, 'key')
    assert.equal(flask.config.key, 'value')
  })

  it('Set value manually', () => {
    const flask = new Flask()
    flask.setConfigValue('serviceDelimiter', '#')
    flask.setConfigValue('key', 'value')

    assert.property(flask.config, 'serviceDelimiter')
    assert.property(flask.config, 'key')
    assert.property(flask.config, 'paramDelimiter')
    assert.equal(flask.config.serviceDelimiter, '#')
    assert.equal(flask.config.paramDelimiter, '%')
    assert.equal(flask.config.key, 'value')
  })

  it('Set registered value overrides it', () => {
    const flask = new Flask()
    flask.setConfigValue('serviceDelimiter', '#')

    assert.equal(flask.config.serviceDelimiter, '#')
  })
})