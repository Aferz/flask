import Flask from './Flask'
import {
  GLOBAL_LISTENER_NAME,
  RESOLVED_LISTENER_NAME
} from './util/constants'

Flask._version = '1.0.2'
Flask._env = 'development'

export default Flask
export {
  GLOBAL_LISTENER_NAME,
  RESOLVED_LISTENER_NAME
}
