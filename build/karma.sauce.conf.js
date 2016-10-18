var karmaLocal = require('./karma.local.conf.js')

var batches = [
  // the cool kids
  {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox'
    },
    sl_mac_safari: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10'
    }
  },
  // ie family
  {
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9'
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8',
      version: '10'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    },
    sl_edge: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      platform: 'Windows 10'
    }
  },
  // mobile
  {
    sl_ios_safari_8: {
      base: 'SauceLabs',
      browserName: 'iphone',
      version: '8.4'
    },
    sl_ios_safari_9: {
      base: 'SauceLabs',
      browserName: 'iphone',
      version: '9.3'
    },
    sl_android_4_2: {
      base: 'SauceLabs',
      browserName: 'android',
      version: '4.2'
    },
    sl_android_5_1: {
      base: 'SauceLabs',
      browserName: 'android',
      version: '5.1'
    }
  }
]

module.exports = function(config) {
  var batch = batches[process.argv[4] || 0]
  
  config.set(Object.assign(karmaLocal, {
    singleRun: true,
    browsers: Object.keys(batch),
    customLaunchers: batch,
    reporters: [
      'saucelabs',
      'spec'
    ],
    sauceLabs: {
      testName: 'Flask unit tests',
      recordScreenshots: false,
      build: process.env.CIRCLE_BUILD_NUM || process.env.SAUCE_BUILD_ID || Date.now()
    },
    captureTimeout: 300000,
    browserNoActivityTimeout: 300000
  }))
}
