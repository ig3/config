'use strict';
const fs = require('fs');
const stripJsonComments = require('strip-json-comments');
const pathop = require('path');
const deepExtend = require('deep-extend');
const ini = require('ini');
const win = process.platform === 'win32';
const home = win
  ? process.env.USERPROFILE
  : process.env.HOME;

module.exports = (opts = {}) => {
  if (opts.debug) console.debug('options: ', opts);
  if (opts.debug) console.debug('argv: ', process.argv);
  const configArgv = opts.argv || require('minimist')(process.argv.slice(2));
  opts.name = opts.name || configArgv.name ||
    pathop.basename(process.argv[1], '.js');
  const configEnv = env(opts.name + '_');
  const config = opts.config || configEnv.config || configArgv.config;
  if (!opts.paths) {
    opts.paths = [];
    if (!win) {
      opts.paths.push(pathop.join('/etc', opts.name));
      opts.paths.push(pathop.join('/etc', opts.name, 'config'));
    }
    opts.paths.push(pathop.join(home, '.config', opts.name));
    opts.paths.push(pathop.join(home, '.config', opts.name, 'config'));
    opts.paths.push(pathop.join(home, '.' + opts.name));
    opts.paths.push(pathop.join(home, '.' + opts.name, 'config'));
    opts.paths.push('.' + opts.name);
    if (config) opts.paths.push(config);
  }
  if (!opts.parsers) {
    opts.parsers = {
      '.json': content => JSON.parse(stripJsonComments(content)),
      '.ini': content => ini.parse(content)
    };
  }
  if (!opts.extensions) {
    opts.extensions = [
      '.ini',
      '.json'
    ];
  }
  if (!opts.defaults) {
    opts.defaults = {};
  }

  const configFiles = [];
  const configs = [opts.defaults];

  opts.paths.forEach(path => {
    if (opts.debug) console.debug('try path ' + path);
    const extension = pathop.extname(path);
    const parser =
      opts.parsers[extension] ||
      opts.parsers[opts.extensions[opts.extensions.length - 1]];
    if (!parser) throw new Error('No parser for ' + path);
    try {
      const config = parser(fs.readFileSync(path, 'utf8'));
      if (config) {
        if (opts.debug) {
          console.debug('From ' + path + ': ', JSON.stringify(config, null, 2));
        }
        configFiles.push(path);
        configs.push(config);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      if (!extension) {
        opts.extensions.forEach(extension => {
          const extended = path + extension;
          if (opts.debug) console.debug('try extended ' + extended);
          const parser = opts.parsers[extension];
          if (!parser) throw new Error('No parser for ' + extended);
          try {
            const config = parser(fs.readFileSync(extended, 'utf8'));
            if (config) {
              configFiles.push(extended);
              configs.push(config);
            }
          } catch (err) {
            if (err.code !== 'ENOENT') {
              throw err;
            }
          }
        });
      }
    }
  });

  return deepExtend.apply(null, configs.concat([
    configEnv,
    configArgv,
    { configs: configFiles }
  ]));
};

function env (prefix, env) {
  env = env || process.env;
  const obj = {};
  const l = prefix.length;
  for (const k in env) {
    if (k.toLowerCase().indexOf(prefix.toLowerCase()) === 0) {
      const keypath = k.substring(l).split('__');

      // Trim empty strings from keypath array
      let _emptyStringIndex;
      while ((_emptyStringIndex = keypath.indexOf('')) > -1) {
        keypath.splice(_emptyStringIndex, 1);
      }

      let cursor = obj;
      keypath.forEach(function _buildSubObj (_subkey, i) {
        // (check for _subkey first so we ignore empty strings)
        // (check for cursor to avoid assignment to primitive objects)
        if (!_subkey || typeof cursor !== 'object') { return; }

        // If this is the last key, just stuff the value in there
        // Assigns actual value from env variable to final key
        // (unless it's just an empty string- in that case use the last valid key)
        if (i === keypath.length - 1) { cursor[_subkey] = env[k]; }

        // Build sub-object if nothing already exists at the keypath
        if (cursor[_subkey] === undefined) { cursor[_subkey] = {}; }

        // Increment cursor used to track the object at the current depth
        cursor = cursor[_subkey];
      });
    }
  }

  return obj;
}
