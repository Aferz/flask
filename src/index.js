import Flask from './Flask'
import * as listeners from './res/listeners'

Flask._version = '1.3.0'
Flask._env = 'development'

Flask.listeners = listeners

export default Flask
