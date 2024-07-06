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

Configuration is read from defaults, one or more configuration files,
environment variables beginning with the name of the program and command
line arguments. The same parameter may appear more than once in which
case the later appearance overrides previous appearances.

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

#### defaults ({})
Default configuration parameters.

```
options.defaults = {
  option1: 'value1',
  option2: 'value2',
  option3: true,
  option4: 1234
};
```

#### argv (minimist)
Parsed arguments from process.argv, or wherever you like.

If not set, [minimist](https://github.com/substack/minimist) is used to
parse the arguments.

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
 * /usr/local/etc/&lt;name>
 * /usr/local/etc/&lt;name>/config
 * ~/.config/&lt;name>
 * ~/.config/&lt;name>/config
 * ~/.&lt;name>
 * ~/.&lt;name>/config
 * .&lt;name>
 * &lt;name>

The path starting with '~' are dependent on the environment variable HOME
being set. If it is not set, these paths will not be checked.

```
options.paths = [
  '/etc/myapp.json',
  path.join(process.env.HOME, '.myapp.json'),
  '.myapp.json'
];
```

The order of paths is significant. If multiple files are found their
contents are merged. If the same parameter appears in more than one file,
the value from files later in the list will override values from files
earlier in the list.  in the list of paths will override those earlier in
the list.

#### parsers The config file parsers.

Parsers for config files are selected by filename extension. If there is no
extension, the parser for the last extension in option extensions is used.

```
options.parsers = {
  '.json5': JSON5.parse,
  '.json': JSON.parse,
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

### 0.2.2 - 20220331

Update all dependencies.

### 0.2.1 - 20220331

Fix the precedence of config option: command line; environment; options

### 0.2.0
Remove strop-json-comments and add JSON5.

### 0.1.0
Add missing dependencies

### 0.0.1

Initial release

### 0.2.3 - WIP
 * Update dependencies
 * Fix tests
