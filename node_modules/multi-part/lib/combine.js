'use strict';

const ReadableStream = require('stream').Readable;

const helpers = require('./helpers');

const toStream = helpers.toStream;
const isPromise = helpers.isPromise;
const isBuffer = helpers.isBuffer;
const isString = helpers.isString;

class CombinedStream extends ReadableStream {
  constructor(streams) {
    super();
    this.destroyed = false;
    this._drained = false;
    this._forwarding = false;
    this._current = null;
    this._queue = streams.map(toStream);

    this._next();
  }

  _read() {
    this._drained = true;
    this._forward();
  }

  _forward() {
    if (this._forwarding || !this._drained || !this._current) {
      return;
    }

    this._forwarding = true;

    let chunk = this._current.read();
    while (chunk !== null) {
      this._drained = this.push(chunk);
      chunk = this._current.read();
    }

    this._forwarding = false;
  }

  _next() {
    this._current = null;

    const stream = this._queue.shift();
    if (isPromise(stream)) {
      return stream.then(res => this._gotNextStream(toStream(res))).catch(e => this.destroy(e));
    } else if (isString(stream) || isBuffer(stream)) {
      this._drained = this.push(stream);
      return this._next();
    }

    this._gotNextStream(stream);
  }

  _gotNextStream(stream) {
    if (!stream) {
      this.push(null);
      return this.destroy();
    }

    this._current = stream;
    this._forward();

    const onReadable = () => {
      this._forward();
    };

    const onError = (e) => {
      this.destroy(e);
    };

    const onClose = () => {
      if (!stream._readableState.ended) {
        this.destroy();
      }
    };

    const onEnd = () => {
      this._current = null;
      stream.removeListener('readable', onReadable);
      stream.removeListener('end', onEnd);
      stream.removeListener('error', onError);
      stream.removeListener('close', onClose);
      this._next();
    };

    stream.on('readable', onReadable);
    stream.on('error', onError);
    stream.on('close', onClose);
    stream.on('end', onEnd);
  }

  destroy(e) {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    if (this._current && this._current.destroy) {
      this._current.destroy();
    }

    this._queue.forEach((stream) => {
      if (stream.destroy) {
        stream.destroy();
      }
    });

    if (e) {
      this.emit('error', e);
    }

    this.emit('close');
  }
}

module.exports = CombinedStream;
