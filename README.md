# @ig3/config

This packages loads configuration from command line, environment and a set
of configuration files.

## Install

```
$ npm install @ig3/config
```

## Usage

```
const config = require('@ig3/config')();
console.log("config: ", JSON.stringify(config, null, 2));
```

The package exports a single function that takes an options argument and
returns a configuration object.

### Configuration
Options may be passed to the factory:

```
const options = {};
const config = require('@ig3/config')(options);
```

#### debug (false)
If truthy, print debug messages to console.debug.

```
options.debug = true;
```

#### argv (minimist)
Parsed arguments from process.argv, or wherever you like. If not set,
[minimist](https://github.com/substack/minimist) is used to parse the
arguments.

```
  require('minimist')(process.argv.slice(2), {
    string: ['config'],
    boolean: ['debug'],
    alias: {
      config: ['C'],
      debug: ['d']
    }
  });
```

For example, to use nopt to process command line arguments:
```
options.argv = nopt(knownOpts, shortHands, process.argv, 2);
```

#### name (path.basename(process.argv[1], '.js'))
The name of the program.

```
options.name = 'myapp';
```

#### config (undefined)
The path of a config file to load. This file, if it exists, overrides all
other config files from opts.paths.

```
options.config = '/tmp/test/config.json';
```

#### paths
The paths to search for config files.

Default paths are:
 * /etc/&lt;name>
 * /etc/&lt;name>/config
 * ~/.config/&lt;name>
 * ~/.config/&lt;name>/config
 * ~/.&lt;name>
 * ~/.&lt;name>/config
 * .&lt;name>
 * &lt;name>

```
options.paths = [
  '/etc/myapp.json',
  path.join(process.env.HOME, '.myapp.json'),
  '.myapp.json'
];
```
#### parsers
The config file parsers.

Parsers for config files are selected by filename extension. If there is no
extension, the parser for the last extension in option extensions is used.

```
options.parsers = {
  '.json': JSON.parse,
  '.json5': JSON5.parse,
  '.ini': ini.parse
};
```

#### extensions
An array of extensions to try if a path does not end with an extension.

```
options.extensions = [
  '.ini',
  '.xml',
  '.json'
];

### Methods

None.

## License

MIT, see [LICENSE.md](http://github.com/ig3/agiloft-script/blob/master/LICENSE.md) for details.

## Change Log

### 0.0.1

Initial release
