multi-part [![License](https://img.shields.io/npm/l/multi-part.svg)](https://github.com/strikeentco/multi-part/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/multi-part.svg)](https://www.npmjs.com/package/multi-part)
==========
[![Build Status](https://travis-ci.org/strikeentco/multi-part.svg)](https://travis-ci.org/strikeentco/multi-part) [![node](https://img.shields.io/node/v/multi-part.svg)](https://www.npmjs.com/package/multi-part) [![Test Coverage](https://codeclimate.com/github/strikeentco/multi-part/badges/coverage.svg)](https://codeclimate.com/github/strikeentco/multi-part/coverage) [![bitHound Score](https://www.bithound.io/github/strikeentco/multi-part/badges/score.svg)](https://www.bithound.io/github/strikeentco/multi-part)

A `multi-part` library allows you to create multipart/form-data `stream` which can be used to submit forms and file uploads to other web applications.

Supports: `Strings`, `Numbers`, `Arrays`, `Streams`, `Buffers` and `Vinyl`.

## Install
```sh
$ npm install multi-part --save
```

## Usage
Usage with `got`:

```js
const got = require('got');
const Multipart = require('multi-part');
const form = new Multipart();

form.append('photo', got.stream('https://avatars1.githubusercontent.com/u/2401029'));
form.append('field', 'multi-part test');

got.post('127.0.0.1:3000', form.streamWithOptions({ json: true }));
```
Usage with `http`/`https`:

```js
const http = require('http');
const https = require('https');
const Multipart = require('multi-part');
const form = new Multipart();

form.append('photo', https.request('https://avatars1.githubusercontent.com/u/2401029'));

form.stream().pipe(http.request({ headers: form.getHeaders(), hostname: '127.0.0.1', port: 3000, method: 'POST' }));
```

# API

### new Multipart([options])

Constructor.

### Params:
* **[options]** (*Object*) - `Object` with options:
  * **boundary**  (*String|Number*) - Custom boundary for `multipart` data. Ex: if equal `CustomBoundary`, boundary will be equal exactly `CustomBoundary`.
  * **boundaryPrefix** (*String|Number*) - Custom boundary prefix for `multipart` data. Ex: if equal `CustomBoundary`, boundary will be equal something like `--CustomBoundary567689371204`.

### .append(name, value, [options])

Adds a new data to the `multipart/form-data` stream.

### Params:
* **name** (*String|Number*) - Field name. Ex: `photo`.
* **value** (*Mixed*) - Value can be `String`, `Number`, `Array`, `Buffer`, `ReadableStream` or even [Vynil](https://www.npmjs.com/package/vinyl).
* **[options]** (*Object*) - Additional options:
  * **filename**  (*String*) - File name. If you appending a remote stream it's recommended to specify file name with extension, otherwise `file.bin` will be set. Ex: `anonim.jpg`.
  * **contentType** (*String*) - File content type. It's not necessary, if you already specified file name, but you can provide content type of remote stream. If you not sure of content type - leave `filename` and `contentType` empty and it will be automatically determined as `file.bin` and `application/octet-stream`. Ex: `image/jpeg`.

If `value` is an array, `append` will be called for each value:
```js
form.append('array', [0, [2, 3], 1]);

// similar to

form.append('array', 0);
form.append('array', 2);
form.append('array', 3);
form.append('array', 1);
```

`Null`, `false` and `true` will be converted to `'0'`, `'0'` and `'1'`. Numbers will be converted to strings also.

For `Buffer` content type will be automatically determined, if it's possible, and name will be specified according to content type. If content type is `image/jpeg`, file name will be set as `file.jpeg` (if `filename` option is not specified).<br>In case content type is undetermined, content type and file name will be set as `application/octet-stream` and `file.bin`.

### .stream() or .getStream()

Returns a `multipart/form-data` stream.

### .streamWithOptions([options]) or .getStreamWithOptions([options])

Returns the object:
```js
{
  headers: {
    transfer-encoding: 'chunked',
    content-type: 'multipart/form-data; boundary="--MultipartBoundary352840693617"'
  },
  body: <Stream>
}
```

Where:
  - `headers` - HTTP request headers.
  - `body` - A `multipart/form-data` stream.

### Params:
* **[options]** (*Object*) - `Object` which will be mixed to return object.

### .getBoundary()

Returns the form boundary used in the `multipart/form-data` stream.

```js
form.getBoundary(); // -> '--MultipartBoundary352840693617'
```

### .getHeaders()

Returns the headers.

```js
form.getHeaders(); // ->
//{
//  transfer-encoding: 'chunked',
//  content-type: 'multipart/form-data; boundary="--MultipartBoundary352840693617"'
//}
```

## License

The MIT License (MIT)<br/>
Copyright (c) 2015-2016 Alexey Bystrov
