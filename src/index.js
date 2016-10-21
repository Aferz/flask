import Flask from './Flask'
import * as listeners from './res/listeners'

Flask._version = '1.1.1'
Flask._env = 'development'

Flask.listeners = listeners

export default Flask
