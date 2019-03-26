'use strict';

const ReadableStream = require('stream').Readable;
const ClientRequest = require('http').ClientRequest;
const path = require('path');
const mime = require('mime-kind');

const DEFAULT_PREFIX = 'MultipartBoundary';
const DEFAULT_NAME = 'file';
const DEFAULT_EXT = 'bin';
const DEFAULT_TYPE = 'application/octet-stream';

module.exports.isNumber = val => typeof val === 'number';

const isString = module.exports.isString = val => typeof val === 'string';

const isBuffer = module.exports.isBuffer = Buffer.isBuffer;

module.exports.isObject = val => Object.prototype.toString.call(val) === '[object Object]' && !isBuffer(val);

const isHTTPStream = module.exports.isHTTPStream = s => s && s instanceof ClientRequest;

const isStream = module.exports.isStream = s => s && typeof s === 'object' && typeof s.pipe === 'function' && s.readable !== false && typeof s._read === 'function' && typeof s._readableState === 'object';

module.exports.isArray = Array.isArray;

const isPromise = module.exports.isPromise = val => (typeof val === 'object' || typeof val === 'function') && typeof val.then === 'function';

module.exports.isVinyl = file => file && file._isVinyl === true;

module.exports.toStream = (s) => {
  if (!s || isStream(s) || isBuffer(s) || isPromise(s) || isString(s)) {
    return s;
  }

  if (isHTTPStream(s)) {
    return new Promise((resolve, reject) => {
      s.on('response', resolve).end();
      s.on('error', reject);
    });
  }

  const wrap = new ReadableStream().wrap(s);
  if (s.destroy) {
    wrap.destroy = s.destroy.bind(s);
  }

  return wrap;
};

module.exports.getFileName = (value) => {
  if (isBuffer(value)) {
    return `${DEFAULT_NAME}.${mime(value, DEFAULT_TYPE).ext}`;
  }

  const filename = value.filename || value.path;

  if (filename) {
    return path.basename(filename);
  }

  return `${DEFAULT_NAME}.${DEFAULT_EXT}`;
};

module.exports.getContentType = (opts) => {
  if (opts.contentType) {
    return opts.contentType;
  }

  return mime(opts.filename, DEFAULT_TYPE).mime;
};

module.exports.genBoundary = (prefix) => {
  prefix = prefix || DEFAULT_PREFIX;
  let boundary = `--${prefix}`;

  for (let i = 0; i < 12; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }

  return boundary;
};
