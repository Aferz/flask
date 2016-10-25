## [Unreleased]

## [1.3.0] - 2016-10-27
### Added
  - '.config()' method to get config value.
  - '.onResolved()' method to add listeners when parameter o service is resolved.
  - Deprecation warnings in console outputs.

### Changed
  - Huge refactor for Resolver core class.

### Deprecated
  - '.cfg()' method deprecated. It'll be removed in release 2.0. Use '.config()' method instead.
  - '.listen()' method deprecated. It'll be removed in release 2.0. Use event named methods instead.

## [1.2.0] - 2016-10-24
### Added
  - Decorator functionality added (#8)
  - Parameter section, in configuration object, now accepts objects to better customization of parameters at configuration level.

### Changed
  - Refactorized Configurator. Moved to its own class. (#14)

## [1.1.1] - 2016-10-21
### Added
  - Tags can be resolved by referece in services and tags arguments, enclosing the tag name in '#' symbol.
  
### Changed
  - Moved listener names & exceptions & config to its own folder to better accesing from node modules.
  - Included static 'listener' object to Flask Constructor to access them from non-modules environments.
  - Test refactor for better visualization

## [1.1.0] - 2016-10-21 [YANKED]

## [1.0.0] - 2016-10-18
  - Initial release.
