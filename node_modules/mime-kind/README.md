mime-kind [![License](https://img.shields.io/npm/l/mime-kind.svg)](https://github.com/strikeentco/mime-kind/blob/master/LICENSE)  [![npm](https://img.shields.io/npm/v/mime-kind.svg)](https://www.npmjs.com/package/mime-kind)
==========
[![Build Status](https://travis-ci.org/strikeentco/mime-kind.svg)](https://travis-ci.org/strikeentco/mime-kind) [![node](https://img.shields.io/node/v/mime-kind.svg)](https://www.npmjs.com/package/mime-kind) [![Test Coverage](https://codeclimate.com/github/strikeentco/mime-kind/badges/coverage.svg)](https://codeclimate.com/github/strikeentco/mime-kind/coverage) [![bitHound Score](https://www.bithound.io/github/strikeentco/mime-kind/badges/score.svg)](https://www.bithound.io/github/strikeentco/mime-kind)

Detect the mime type of a `Buffer`, `ReadStream`, file path and file name.

## Install
```sh
$ npm install mime-kind --save
```

## Usage

```js
const fs = require('fs');
const mime = require('mime-kind');

mime('c:/anonim.jpeg'); // -> { ext: 'jpeg', mime: 'image/jpeg' }
mime('.fakeext'); // -> null
mime(fs.createReadStream('./anonim.jpg')); // -> { ext: 'jpeg', mime: 'image/jpeg' }
```

## API

### mime(data, [defaultValue])

Returns an object (or `null` when no match) with:

* `ext` - file type
* `mime` - the [MIME type](http://en.wikipedia.org/wiki/Internet_media_type)

### Params:

* **data** (*Buffer|ReadStream|String*) - `Buffer`, `ReadStream`, file path or file name.
* **[defaultValue]** (*String|Object*) - `String` or `Object` with value which will be returned if no match will be found. If `defaultValue` is incorrect returns `null`.

```js
const mime = require('mime-kind');

mime('.fakeext', 'application/octet-stream'); // -> { ext: 'bin', mime: 'application/octet-stream' }
mime('.fakeext', { ext: 'mp4', mime: 'video/mp4' }); // -> { ext: 'mp4', mime: 'video/mp4' }
mime('.fakeext', 'ogg'); // -> { ext: 'ogg', mime: 'audio/ogg' }
// but
mime('.fakeext', 'ogg3'); // -> null
mime('.fakeext', { ext: 'fake', mime: 'fake/fake' }); // -> { ext: 'fake', mime: 'fake/fake' }
```

## License

The MIT License (MIT)<br/>
Copyright (c) 2015-2017 Alexey Bystrov
