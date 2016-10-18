[![Build Status](https://travis-ci.org/Aferz/flask.svg?branch=develop)](https://travis-ci.org/Aferz/flask)

# Introduction
Flask is a tiny yet powerful IOC Container for your projects based on javascript, including nodejs. It resolves dependencies for you automaticly and improves your development flow tyding up your code.

It offers support for <code>services</code>, <code>singletons</code>, <code>parameters</code> and much more... <b>let's dive in!</b>

## Index

- [Installation](https://github.com/Aferz/flask/new/develop?readme=1#installation)
- [Parameters](https://github.com/Aferz/flask/new/develop?readme=1#parameters)
  - [*.parameter(alias, value)*](https://github.com/Aferz/flask/new/develop?readme=1#parameteralias-value)
  - [*.value(alias)*](https://github.com/Aferz/flask/new/develop?readme=1#valuealias)
- [Services & Singletons](https://github.com/Aferz/flask/new/develop?readme=1#services--singletons)
  - [*.service(alias, definition [, args = []])*](https://github.com/Aferz/flask/new/develop?readme=1#servicealias-definition--args--)
  - [*.singleton(alias, definition [, args = []])*](https://github.com/Aferz/flask/new/develop?readme=1#singletonalias-definition--args--)
  - [*.make(alias)*](https://github.com/Aferz/flask/new/develop?readme=1#makealias)
- [Tagging](https://github.com/Aferz/flask/new/develop?readme=1#tagging)
  - [*.tag(name, aliases)*](https://github.com/Aferz/flask/new/develop?readme=1#tagname-aliases)
  - [*.tagged(name)*](https://github.com/Aferz/flask/new/develop?readme=1#taggedname)
- [Decorators](https://github.com/Aferz/flask/new/develop?readme=1#decorators)
- [Calling & Wrapping](https://github.com/Aferz/flask/new/develop?readme=1#calling--wrapping)
  - [*.call(definition, dependencies[, context = null])*](https://github.com/Aferz/flask/new/develop?readme=1#calldefinition-dependencies-context--null)
  - [*.wrap(definition, dependencies[, context = null])*](https://github.com/Aferz/flask/new/develop?readme=1#wrapdefinition-dependencies-context--null)
- [Eventing](https://github.com/Aferz/flask/new/develop?readme=1#eventing)
  - [*.listen(event, alias, handler)*](https://github.com/Aferz/flask/new/develop?readme=1#listenevent-alias-handler)
    - [Globally](https://github.com/Aferz/flask/new/develop?readme=1#globally)
    - [Service/Parameter Scoped](https://github.com/Aferz/flask/new/develop?readme=1#serviceparameter-scoped)
- [Config](https://github.com/Aferz/flask/new/develop?readme=1#config)
  - [*.setConfigValue(key, value)*](https://github.com/Aferz/flask/new/develop?readme=1#setconfigvaluekey-value)
  - [*.cfg(key)*](https://github.com/Aferz/flask/new/develop?readme=1#cfgkey)
- [Setting up Flask on bootstrap](https://github.com/Aferz/flask/new/develop?readme=1#setting-up-flask-on-bootstrap)
- [Merging different Flask configuration objects](https://github.com/Aferz/flask/new/develop?readme=1#merging-different-flask-configuration-objects)

## Installation

#### Bower
```
bower install flask-container --save
```

#### Npm
```
npm install flask-container --save
```

#### Manually
```
git clone https://github.com/Aferz/flask
```

And reference it in your html:

```html
<script src="path/of/my/libs/flask/dist/flask.min.js"></script>
```

## Parameters

Parameters are simple values that are resolved for the container. It can store any kind of value.

### .parameter(alias, value)

It registers a parameter into the container:

```javascript
  var flask = new Flask(); // Creates our awesome container instance
  
  flask.parameter('heroe', 'Superman');
```

### .value(alias)

Returns registered parameter out the container:

```javascript
  var heroe = flask.value('heroe'); // Superman
```

Such impressive, isn't it? Let's step it further. With Flask you can inject parameters by reference just enclosing the value into the symbol <b>%</b><i>(Configurable)</i>:


```javascript
  flask.parameter('heroe', 'Superman');
  flask.parameter('heroe2', '%heroe%');
  flask.parameter('heroe3', '%heroe2%');
  
  var heroe = flask.value('heroe3'); // Superman
```

Not bad. By the way, the order of registering doesn't matter.

## Services & Singletons

Services are a <i>fancy</i> word to describe super cool reusable objects. That's all. Flask helps you building this objects for you and resolving its dependencies. This way you allways know your objects are created in the same way, making your code less complex, more secure and realiable.

<b>Important note:</b> all services are created with the <b><i>new</i></b> keyword. Don't say I didn't tell you.

### .service(alias, definition [, args = []])

Register a service. Returns new instance on every call:

```javascript
  funcion Villain(weapon) {
    this.weapon = weapon;
  }

  var heroe = flask.service('Villain', Villain, ['lazer']);
```

Now we can create a Villain instance when we need it.

### .singleton(alias, definition [, args = []])

Of course, there is only one superman so we'll use a singleton for this case. A singleton returns the <b><i>same</i></b> instance once resolved for first time.


```javascript
  funcion Superman(superPower1, superPower2) {
    this.superPower1 = superPower1;
    this.superPower2 = superPower2;
  }

  var heroe = flask.singleton('Superman', Superman, ['xRayVision', 'fly']);
```

### .make(alias)

It's time to create some Villains and Heroes


```javascript
  var villain1 = flask.make('Villain'); // Villain instance
  var villain2 = flask.make('Villain'); // Another Villain instance
  
  console.log(villain1 === villain2) // false
  
  var superman1 = flask.make('Superman'); // Superman instance
  var superman2 = flask.make('Superman'); // The same Superman instance
  
  console.log(superman1 === superman2) // true, I promise
```

Flask can resolve any dependency either strings, booleans, objects, functions, numbers ... even <b>services and parameters</b> using special symbols. The special symbol for services is <b>@</b><i>(Configurable)</i>:


```javascript
  function Superman(Batman, superPower) {
    this.Batman = Batman;
    this.superPower = superPower;
  }
  
  function Batman(superPower) {
    this.superPower = superPower
  }
  
  flask.parameter('superPower.superman', 'X-rays');
  flask.parameter('superPower.batman', 'Rich');
  
  flask.service('Superman', Superman, ['@Batman@', '%superPower.superman%']);
  flask.service('Batman', Batman, ['%superPower.batman%']);
  
  var superman = flask.make('Superman');
  
  console.log(superman.Batman); // Instance of Batman
  console.log(superman.superPower); // X-Rays
  console.log(superman.Batman.superPower); // Rich
```

This function support infinite (Oh boy) nested dependencies.

<b>Note:</b> Don't try to inject a service into a parameter with '@' syntax, it just won't work and it'll return the string. That's not the purpose of parameters.

## Tagging

Tagging it's the way Flask offers to classify and resolve multiple primitive types and services and/or parameters at once.

### .tag(name, aliases)

```javascript
  function Superman() {}
  function WonderWoman() {}
  function Batman() {}
  
  flask.parameter('Aquaman', 'Ocean'); // Dummy parameter, ok
  flask.service('Superman', Superman);
  flask.service('WonderWoman', WonderWoman);
  flask.service('Batman', Batman);
  
  flask.tag('JusticeLeague', ['@Superman@', '@WonderWoman@', '@Batman@', '%Aquaman%']);
```

### .tagged(name)

With this method we'll retrieve the registered tag out the container:

```javascript
  var justiceLeague = flask.tagged('JusticeLeague')
  
  console.log(justiceLeague[0]); // Instance of Superman
  console.log(justiceLeague[1]); // Instance of WonderWoman
  console.log(justiceLeague[2]); // Instance of Batman
  console.log(justiceLeague[3]); // 'Ocean'
```

(Resolving tag references WIP)


## Decorators
(WIP)

## Calling & Wrapping

Sometimes we'll need to call or create a function injecting directly any dependency. Flask give us two methods that will help us on this task.

### .call(definition, dependencies[, context = null])

This method will call given function injecting specified dependencies as second argument. Let see an example:

```javascript
  function SaveTheWorld(Superman, Batman) {
    console.log(Superman);
    console.log(Batman);
  }

  flask.service('Superman', Superman);
  flask.service('Batman', Batman);
  flask.call(SaveTheWorld, ['@Superman@' '@Batman@']); // Function will be inmediately called
  
  // Log: Instance of Superman
  // Log: Instance of Batman
```

As you can see, this method will call inmediately the passed definition, but ... What if you just want to resolve the arguments of the definition and store the result function in a variable to call it later? Flask to the rescue again:

### .wrap(definition, dependencies[, context = null])

```javascript
  // We will use the previous example
  var resolvedFunc = flask.wrap(SaveTheWorld, ['@Superman@' '@Batman@']);
  
  // Function hasn't been called automaticly

  resolvedFunc()
 
  // Log: Instance of Superman
  // Log: Instance of Batman
```

<b>Note:</b> Both, call and wrap accept a third parameter to bind a context into the given function.

## Eventing

Wouldn't be nice if you could listen events emitted by Flask? Well, i have good news for you:

### .listen(event, alias, handler)

This is the proper way to register events and it can be used on two ways:

#### Globally
```javascript
  flask.listen('eventName', function (instance, flask) {
    // this will be executed before for EVERY service/parameter resolved
  });
```

#### Service/Parameter Scoped
```javascript
  flask.listen('eventName', 'ServiceA', function (instance, flask) {
    // this will be executed before instance is returned ONLY for ServiceA
  });
```

<b>Note:</b> The listener will be executed in order they were registered.

Harcoding name of the event is a bad practice, thats why Flask offers right out the box usefull constants for these methods (ES6 modules & node only) located in `flask-container/listeners`. One example:

```javascript
// ES6
import { RESOLVED_LISTENER_NAME } from 'flask-container/listeners'

// Node
var onResolved = require('flask-container/listeners').RESOLVED_LISTENER_NAME
```

Here is a table to help you with the event system:

Name     | Constant               | Fires when ...
:------: | :--------------------: | :-----------:
resolved | RESOLVED_LISTENER_NAME | After service/parameter is instantiated. *It'll only affect to requested one, not its dependencies.*
(WIP) | (WIP) | (WIP) | Before service/parameter is instantiated. *It'll only affect to requested one, not its dependencies.*

## Config

We can modify the internals of our Flask container through configuration variables. Here is a list of variables that can be modified:

Name  | Default value | What it does
:---: | :-----------: | :----------:
serviceDelimiter | @ | It delimites the reference of a service when resolving arguments injection
parameterDelimiter | % | It delimites the reference of a parameter when resolving arguments injection

### .setConfigValue(key, value)

Set a config value:

```javascript
  flask.setConfigValue('serviceDelimiter', '#');
```

### .cfg(key)

Get config value by its key:

```javascript
  var serviceDelimiter = flask.cfg('serviceDelimiter'); // '@'
```

## Setting up Flask on bootstrap

In order to mantain good separation of concerns, Flask can be configured during its instantiation using a configuration object. This will allow to have our dependencies in one place (or many, with diferent config files). Let's see a full example.

```javascript
  function serviceA () {}
  function serviceB () {}
  function serviceC () {}
  function aliasCListener () {}
  function globalListener () {}

  var config = {
    config: {
      serviceDelimiter: '#',
      paramDelimiter: '~'
    },
    parameters: {
      param1: 'Parameter 1',
      param2: '%param1%'
    },
    services: {
      aliasA: {
        service: serviceA,
        arguments: ['@aliasB@'],
        tags: 'tag1'
      },
      aliasB: {
        service: serviceB,
        singleton: true,
        tags: ['tag1', 'tag2']
      },
      aliasC: {
        service: serviceC,
        listeners: {
            resolved: [aliasCListener]
          }
      }
    },
    listeners: {
      resolved: [globalListener]
    }
  }
```

## Merging different Flask configuration objects
(WIP)

# Contributing

Consider contributing opening an [issue](https://github.com/Aferz/flask/issues) or opening a [pull request](https://github.com/Aferz/flask/pull).

## License

Flask is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

## Special thanks

To Symfony and its IOC Container, that it obviously inspired me to build this.
