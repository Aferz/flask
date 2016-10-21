export const paramNotRegisteredException = (alias) => {
  return new Error(`Parameter '${alias}' not registered in flask.`)
}
export const serviceNotRegisteredException = (alias) => {
  return new Error(`Service '${alias}' not registered in flask.`)
}
export const tagNotRegisteredException = (name) => {
  return new Error(`Tag '${name}' not registered in flask.`)
}
export const paramAlreadyExistsException = (alias) => {
  return new Error(`Parameter '${alias}' already exists in flask.`)
}
export const serviceAlreadyExistsException = (alias) => {
  return new Error(`Service '${alias}' already exists in flask.`)
}
export const circularDependencyParameterError = (alias) => {
  return new Error(`Circular dependency in parameter '${alias}'`)
}
export const circularDependencyServiceError = (alias) => {
  return new Error(`Circular dependency in service '${alias}'`)
}
export const circularDependencyTagError = (alias) => {
  return new Error(`Circular dependency in tag '${alias}'`)
}
