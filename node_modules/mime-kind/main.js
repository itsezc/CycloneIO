'use strict';

const fs = require('fs');
const normalize = require('path').normalize;
const fileType = require('file-type');
const mimeType = require('mime-types');

const BUFFER_LENGTH = 262;

function isString(val) {
  return typeof val === 'string';
}

function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

function isStream(val) {
  return typeof val === 'object' && typeof val.pipe === 'function' &&
    val.readable !== false && typeof val._read === 'function' &&
    typeof val._readableState === 'object';
}

function isExists(path) {
  try {
    fs.accessSync(normalize(path));
    return true;
  } catch (e) {
    return false;
  }
}

function chunkSync(data) {
  if (!data.fd) {
    data.path = normalize(data.path);
    if (isExists(data.path)) {
      data.fd = fs.openSync(data.path, data.flags, data.mode);
    } else {
      throw new Error('The file must be local and exists.');
    }
  }

  const buf = new Buffer(BUFFER_LENGTH);

  fs.readSync(data.fd, buf, 0, BUFFER_LENGTH);
  fs.closeSync(data.fd);

  return buf;
}

function streamSync(stream) {
  if (!stream.closed && !stream.destroyed) {
    return chunkSync(stream);
  }
  return false;
}

module.exports = (data, defaultValue) => {
  if (data) {
    let file = null;
    if (isString(data)) {
      const mime = mimeType.lookup(data);
      if (mime) {
        return { ext: mimeType.extension(mime), mime };
      }
      if (isExists(data)) {
        file = fileType(chunkSync({ path: data, flags: 'r' }));
      }
    } else if (Buffer.isBuffer(data)) {
      file = fileType(data);
    } else if (isStream(data)) {
      file = fileType(streamSync(data));
    }
    if (file != null) {
      return file;
    }
  }

  if (defaultValue) {
    if (isObject(defaultValue)) {
      let ext;
      if (defaultValue.ext) {
        ext = defaultValue.ext;
        const mime = mimeType.lookup(ext);
        if (mime) {
          return { ext, mime };
        }
      }

      if (defaultValue.mime || defaultValue.type) {
        const mime = defaultValue.mime || defaultValue.type;
        if (!ext) {
          ext = mimeType.extension(mime);
        }
        if (ext) {
          return { ext, mime };
        }
      }
    } else if (isString(defaultValue)) {
      let ext = mimeType.extension(defaultValue);
      let mime = mimeType.lookup(defaultValue);

      if (ext || mime) {
        if (!mime) {
          mime = mimeType.lookup(ext);
        }
        if (!ext) {
          ext = mimeType.extension(mime);
        }
        return { ext, mime };
      }
    }
  }

  return null;
};
