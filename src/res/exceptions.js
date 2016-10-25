export const paramNotRegisteredException = (alias) => {
  return new Error(`Parameter '${alias}' not registered in flask.`)
}
export const serviceNotRegisteredException = (alias) => {
  return new Error(`Service '${alias}' not registered in flask.`)
}
export const tagNotRegisteredException = (name) => {
  return new Error(`Tag '${name}' not registered in flask.`)
}
export const circularDependencyException = (dependencyChain) => {
  return new Error(`Circular dependency detected: ${dependencyChain}`)
}
