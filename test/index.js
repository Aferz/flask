import mocha from 'mocha'
import chai from 'chai'

const assert = chai.assert
var window = {}

window.assert = assert
global.assert = assert

import './configuration'
import './resolution'