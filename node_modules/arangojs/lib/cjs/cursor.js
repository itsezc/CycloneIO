"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayCursor {
    constructor(connection, body, host, allowDirtyRead) {
        this.extra = body.extra;
        this._connection = connection;
        this._result = body.result;
        this._hasMore = Boolean(body.hasMore);
        this._id = body.id;
        this._host = host;
        this.count = body.count;
        this._allowDirtyRead = allowDirtyRead;
    }
    _drain() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._more();
            if (!this._hasMore)
                return this;
            return this._drain();
        });
    }
    _more() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasMore)
                return;
            else {
                const res = yield this._connection.request({
                    method: "PUT",
                    path: `/_api/cursor/${this._id}`,
                    host: this._host,
                    allowDirtyRead: this._allowDirtyRead
                });
                this._result.push(...res.body.result);
                this._hasMore = res.body.hasMore;
            }
        });
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._drain();
            let result = this._result;
            this._result = [];
            return result;
        });
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            while (!this._result.length && this._hasMore) {
                yield this._more();
            }
            if (!this._result.length) {
                return undefined;
            }
            return this._result.shift();
        });
    }
    hasNext() {
        return Boolean(this._hasMore || this._result.length);
    }
    each(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            while (this._result.length || this._hasMore) {
                let result;
                while (this._result.length) {
                    result = fn(this._result.shift(), index, this);
                    index++;
                    if (result === false)
                        return result;
                }
                if (this._hasMore)
                    yield this._more();
            }
            return true;
        });
    }
    every(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            while (this._result.length || this._hasMore) {
                let result;
                while (this._result.length) {
                    result = fn(this._result.shift(), index, this);
                    index++;
                    if (!result)
                        return false;
                }
                if (this._hasMore)
                    yield this._more();
            }
            return true;
        });
    }
    some(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            while (this._result.length || this._hasMore) {
                let result;
                while (this._result.length) {
                    result = fn(this._result.shift(), index, this);
                    index++;
                    if (result)
                        return true;
                }
                if (this._hasMore)
                    yield this._more();
            }
            return false;
        });
    }
    map(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            let result = [];
            while (this._result.length || this._hasMore) {
                while (this._result.length) {
                    result.push(fn(this._result.shift(), index, this));
                    index++;
                }
                if (this._hasMore)
                    yield this._more();
            }
            return result;
        });
    }
    reduce(fn, accu) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            if (accu === undefined) {
                if (!this._result.length && !this._hasMore) {
                    yield this._more();
                }
                accu = this._result.shift();
                index += 1;
            }
            while (this._result.length || this._hasMore) {
                while (this._result.length) {
                    accu = fn(accu, this._result.shift(), index, this);
                    index++;
                }
                if (this._hasMore)
                    yield this._more();
            }
            return accu;
        });
    }
}
exports.ArrayCursor = ArrayCursor;
//# sourceMappingURL=cursor.js.map