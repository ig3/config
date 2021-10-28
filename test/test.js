'use strict';
const t = require('tape');
const pathop = require('path');

t.test('require returns a function', t => {
  try {
    const factory = require('../index.js');
    t.ok(typeof factory === 'function', 'exports a function');
  } catch (err) {
    t.fail(err);
  }
  t.end();
});

t('debug writes messages to console.debug', t => {
  const factory = require('../index.js');
  let consoleDebugCalled = false;
  const origDebug = console.debug;
  console.debug = (msg) => {
    consoleDebugCalled = true;
  };

  factory({ debug: true });
  t.ok(consoleDebugCalled, 'console.debug is called');
  console.debug = origDebug;
  t.end();
});

t('load config from specified path', t => {
  const factory = require('../index.js');
  const conf = factory({
    paths: [
      pathop.join(__dirname, 'data/config.json')
    ]
  });
  t.ok(conf, 'got a configuration');
  t.ok(conf.parameter === 'value', 'got parameter');
  t.end();
});

t('debug writes From messages to console.debug', t => {
  const factory = require('../index.js');
  let gotFrom = false;
  const origDebug = console.debug;
  console.debug = (msg) => {
    if (msg.startsWith('From ')) {
      gotFrom = true;
    }
  };

  factory({
    debug: true,
    paths: [
      pathop.join(__dirname, 'data/config.json')
    ]
  });
  t.ok(gotFrom, 'Wrote From messages');
  console.debug = origDebug;
  t.end();
});

t('load config from file with extension', t => {
  const factory = require('../index.js');
  const conf = factory({
    paths: [
      pathop.join(__dirname, 'data/config')
    ]
  });
  t.ok(conf, 'got a configuration');
  t.ok(conf.parameter === 'value', 'got parameter');
  t.end();
});

t('throws on unparsable config', t => {
  try {
    const factory = require('../index.js');
    const conf = factory({
      paths: [
        pathop.join(__dirname, 'data/badconfig')
      ]
    });
    t.ok(conf, 'got a configuration');
    t.ok(conf.parameter, 'got parameter');
  } catch (err) {
    t.pass('threw error');
  }
  t.end();
});

t('get config from env', t => {
  const factory = require('../index.js');
  process.env.xxx_param = 'somevalue';
  process.env.xxx_param__sub = 'x';
  process.env.xxx_param____sub = 'x';
  const conf = factory({
    name: 'xxx',
    paths: [
      pathop.join(__dirname, 'data/config')
    ]
  });
  t.ok(conf, 'got a configuration');
  t.ok(conf.parameter, 'got parameter');
  t.ok(conf.param === 'somevalue', 'got param from env');
  t.end();
});

t('load config from current directory', t => {
  const factory = require('../index.js');
  process.chdir(pathop.join(__dirname, 'data'));
  const conf = factory({
    name: 'test'
  });
  t.ok(conf, 'got a configuration');
  t.ok(conf.testjsonparam === 'value', 'got param from .test.json');
  t.end();
});

t('load config from config file', t => {
  const factory = require('../index.js');
  const conf = factory({
    name: 'test',
    config: pathop.join(__dirname, 'data/config.json')
  });
  t.ok(conf, 'got a configuration');
  t.ok(conf.parameter === 'value', 'got param from .test.json');
  t.end();
});

t('throws if no parser', t => {
  const factory = require('../index.js');
  try {
    factory({
      name: 'test',
      config: pathop.join(__dirname, 'data/config.json'),
      parsers: []
    });
  } catch (err) {
    t.pass('threw');
  }
  t.end();
});
