'use strict';

const CombinedStream = require('./lib/combine');
const helpers = require('./lib/helpers');

const isString = helpers.isString;
const isNumber = helpers.isNumber;
const isObject = helpers.isObject;
const isStream = helpers.isStream;
const isHTTPStream = helpers.isHTTPStream;
const isBuffer = helpers.isBuffer;
const isArray = helpers.isArray;
const isVinyl = helpers.isVinyl;

const toStream = helpers.toStream;
const getFileName = helpers.getFileName;
const getContentType = helpers.getContentType;
const genBoundary = helpers.genBoundary;

const CRLF = '\r\n';

class Multipart {
  constructor(opts) {
    this.opts = Object.assign({}, opts);
    this.boundary = this.opts.boundary || genBoundary(this.opts.boundaryPrefix);
    this.headers = {
      'transfer-encoding': 'chunked',
      'content-type': `multipart/form-data; boundary="${this.getBoundary()}"`
    };
    this.body = [];
    this._storage = [];
  }

  _append(data) {
    Array.prototype.push.call(this.body, toStream(data));
  }

  _proccess(n) {
    if (!n) {
      if (this.body && this.body.length) {
        return this._append(`--${this.getBoundary()}--`);
      }

      return;
    }

    this._genBody(n);
  }

  _genBody(n) {
    let buf = n.stream;
    let opts = n.options;

    this._append(`--${this.getBoundary()}${CRLF}`);
    this._append(`Content-Disposition: form-data; name="${n.name}"`);

    if (isStream(buf) || isBuffer(buf) || isVinyl(buf) || isHTTPStream(buf)) {
      let contentType;
      if (isVinyl(buf)) {
        opts = Object.assign({}, opts);
        if (!opts.filename && buf.basename) {
          opts.filename = buf.basename;
        }
        buf = buf.contents;
      }

      const filename = (opts && opts.filename) ? getFileName(opts) : getFileName(buf);
      this._append(`; filename="${filename}"${CRLF}`);
      if (opts && (opts.filename || opts.contentType)) {
        contentType = getContentType(opts);
      } else {
        contentType = getContentType({ filename });
      }

      this._append(`Content-Type: ${contentType}${CRLF}`);
    } else {
      this._append(CRLF);
    }

    this._append(CRLF);
    this._append(buf);
    this._append(CRLF);

    this._proccess(this._storage.shift());
  }

  getBoundary() {
    return this.boundary;
  }

  getHeaders() {
    return this.headers;
  }

  append(name, stream, options) {
    if (!name || (!isNumber(name) && !isString(name))) {
      throw new TypeError('Name must be specified and must be a string or a number');
    }

    if (isArray(stream)) {
      if (!stream.length) {
        stream = '';
      } else {
        for (let i = 0; i < stream.length; i++) {
          this.append(name, stream[i], options);
        }

        return this;
      }
    }

    if (stream === true || stream === false || stream === null) {
      stream = +stream;
    }

    if (isNumber(stream)) {
      stream += '';
    }

    if (isObject(options)) {
      this._storage.push({ name, stream, options });
    } else {
      this._storage.push({ name, stream });
    }

    return this;
  }

  stream() {
    if (!(this._stream instanceof CombinedStream)) {
      this._proccess(this._storage.shift());
      this._stream = new CombinedStream(this.body);
    }

    return this._stream;
  }

  streamWithOptions(opts) {
    return Object.assign(
      { headers: this.getHeaders() },
      isObject(opts) ? opts : {},
      { body: this.stream() }
    );
  }
}

Multipart.prototype.getStream = Multipart.prototype.stream;
Multipart.prototype.getStreamWithOptions = Multipart.prototype.streamWithOptions;

module.exports = Multipart;
