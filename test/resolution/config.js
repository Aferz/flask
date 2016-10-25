import Flask from '../../src/Flask'

describe('Config Values', () => {
  it('Get value', () => {
    const flask = new Flask()
    flask.setConfigValue('key', 'value')

    assert.equal(flask.config('key'), 'value')
  })

  it('Get unregistered value returns null', () => {
    const flask = new Flask()

    assert.equal(flask.config('key'), null)
  })
})