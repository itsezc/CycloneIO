"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cursor_1 = require("./cursor");
const error_1 = require("./error");
var CollectionType;
(function (CollectionType) {
    CollectionType[CollectionType["DOCUMENT_COLLECTION"] = 2] = "DOCUMENT_COLLECTION";
    CollectionType[CollectionType["EDGE_COLLECTION"] = 3] = "EDGE_COLLECTION";
})(CollectionType = exports.CollectionType || (exports.CollectionType = {}));
function isArangoCollection(collection) {
    return Boolean(collection && collection.isArangoCollection);
}
exports.isArangoCollection = isArangoCollection;
exports.DOCUMENT_NOT_FOUND = 1202;
exports.COLLECTION_NOT_FOUND = 1203;
class BaseCollection {
    constructor(connection, name) {
        this.isArangoCollection = true;
        this.name = name;
        this._idPrefix = `${this.name}/`;
        this._connection = connection;
        if (this._connection.arangoMajor >= 3) {
            this.first = undefined;
            this.last = undefined;
            this.createCapConstraint = undefined;
        }
    }
    _documentPath(documentHandle) {
        return `/document/${this._documentHandle(documentHandle)}`;
    }
    _documentHandle(documentHandle) {
        if (typeof documentHandle !== "string") {
            if (documentHandle._id) {
                return documentHandle._id;
            }
            if (documentHandle._key) {
                return this._idPrefix + documentHandle._key;
            }
            throw new Error("Document handle must be a document or string");
        }
        if (documentHandle.indexOf("/") === -1) {
            return this._idPrefix + documentHandle;
        }
        return documentHandle;
    }
    _indexHandle(indexHandle) {
        if (typeof indexHandle !== "string") {
            if (indexHandle.id) {
                return indexHandle.id;
            }
            throw new Error("Index handle must be a index or string");
        }
        if (indexHandle.indexOf("/") === -1) {
            return this._idPrefix + indexHandle;
        }
        return indexHandle;
    }
    _get(path, qs) {
        return this._connection.request({ path: `/_api/collection/${this.name}/${path}`, qs }, res => res.body);
    }
    _put(path, body) {
        return this._connection.request({
            method: "PUT",
            path: `/_api/collection/${this.name}/${path}`,
            body
        }, res => res.body);
    }
    get() {
        return this._connection.request({ path: `/_api/collection/${this.name}` }, res => res.body);
    }
    exists() {
        return this.get().then(() => true, err => {
            if (error_1.isArangoError(err) && err.errorNum === exports.COLLECTION_NOT_FOUND) {
                return false;
            }
            throw err;
        });
    }
    create(properties) {
        return this._connection.request({
            method: "POST",
            path: "/_api/collection",
            body: Object.assign({}, properties, { name: this.name, type: this.type })
        }, res => res.body);
    }
    properties() {
        return this._get("properties");
    }
    count() {
        return this._get("count");
    }
    figures() {
        return this._get("figures");
    }
    revision() {
        return this._get("revision");
    }
    checksum(opts) {
        return this._get("checksum", opts);
    }
    load(count) {
        return this._put("load", typeof count === "boolean" ? { count: count } : undefined);
    }
    unload() {
        return this._put("unload", undefined);
    }
    setProperties(properties) {
        return this._put("properties", properties);
    }
    async rename(name) {
        const result = await this._connection.request({
            method: "PUT",
            path: `/_api/collection/${this.name}/rename`,
            body: { name }
        }, res => res.body);
        this.name = name;
        this._idPrefix = `${name}/`;
        return result;
    }
    rotate() {
        return this._put("rotate", undefined);
    }
    truncate() {
        return this._put("truncate", undefined);
    }
    drop(opts) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/collection/${this.name}`,
            qs: opts
        }, res => res.body);
    }
    documentExists(documentHandle) {
        return this._connection
            .request({
            method: "HEAD",
            path: `/_api/${this._documentPath(documentHandle)}`
        }, () => true)
            .catch(err => {
            if (err.statusCode === 404) {
                return false;
            }
            throw err;
        });
    }
    document(documentHandle, opts = {}) {
        if (typeof opts === "boolean") {
            opts = { graceful: opts };
        }
        const { allowDirtyRead = undefined, graceful = false } = opts;
        const result = this._connection.request({ path: `/_api/${this._documentPath(documentHandle)}`, allowDirtyRead }, res => res.body);
        if (!graceful)
            return result;
        return result.catch(err => {
            if (error_1.isArangoError(err) && err.errorNum === exports.DOCUMENT_NOT_FOUND) {
                return null;
            }
            throw err;
        });
    }
    replace(documentHandle, newValue, opts = {}) {
        var _a;
        const headers = {};
        if (typeof opts === "string") {
            opts = { rev: opts };
        }
        if (opts.rev && this._connection.arangoMajor >= 3) {
            let rev;
            (_a = opts, { rev } = _a, opts = __rest(_a, ["rev"]));
            headers["if-match"] = rev;
        }
        return this._connection.request({
            method: "PUT",
            path: `/_api/${this._documentPath(documentHandle)}`,
            body: newValue,
            qs: opts,
            headers
        }, res => res.body);
    }
    update(documentHandle, newValue, opts = {}) {
        var _a;
        const headers = {};
        if (typeof opts === "string") {
            opts = { rev: opts };
        }
        if (opts.rev && this._connection.arangoMajor >= 3) {
            let rev;
            (_a = opts, { rev } = _a, opts = __rest(_a, ["rev"]));
            headers["if-match"] = rev;
        }
        return this._connection.request({
            method: "PATCH",
            path: `/_api/${this._documentPath(documentHandle)}`,
            body: newValue,
            qs: opts,
            headers
        }, res => res.body);
    }
    bulkUpdate(newValues, opts) {
        return this._connection.request({
            method: "PATCH",
            path: `/_api/document/${this.name}`,
            body: newValues,
            qs: opts
        }, res => res.body);
    }
    remove(documentHandle, opts = {}) {
        var _a;
        const headers = {};
        if (typeof opts === "string") {
            opts = { rev: opts };
        }
        if (opts.rev && this._connection.arangoMajor >= 3) {
            let rev;
            (_a = opts, { rev } = _a, opts = __rest(_a, ["rev"]));
            headers["if-match"] = rev;
        }
        return this._connection.request({
            method: "DELETE",
            path: `/_api/${this._documentPath(documentHandle)}`,
            qs: opts,
            headers
        }, res => res.body);
    }
    list(type = "id") {
        if (this._connection.arangoMajor <= 2) {
            return this._connection.request({
                path: "/_api/document",
                qs: { type, collection: this.name }
            }, res => res.body.documents);
        }
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/all-keys",
            body: { type, collection: this.name }
        }, res => res.body.result);
    }
    all(opts) {
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/all",
            body: Object.assign({}, opts, { collection: this.name })
        }, res => new cursor_1.ArrayCursor(this._connection, res.body, res.host));
    }
    any() {
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/any",
            body: { collection: this.name }
        }, res => res.body.document);
    }
    first(opts) {
        if (typeof opts === "number") {
            opts = { count: opts };
        }
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/first",
            body: Object.assign({}, opts, { collection: this.name })
        }, res => res.body.result);
    }
    last(opts) {
        if (typeof opts === "number") {
            opts = { count: opts };
        }
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/last",
            body: Object.assign({}, opts, { collection: this.name })
        }, res => res.body.result);
    }
    byExample(example, opts) {
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/by-example",
            body: Object.assign({}, opts, { example, collection: this.name })
        }, res => new cursor_1.ArrayCursor(this._connection, res.body, res.host));
    }
    firstExample(example) {
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/first-example",
            body: {
                example,
                collection: this.name
            }
        }, res => res.body.document);
    }
    removeByExample(example, opts) {
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/remove-by-example",
            body: Object.assign({}, opts, { example, collection: this.name })
        }, res => res.body);
    }
    replaceByExample(example, newValue, opts) {
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/replace-by-example",
            body: Object.assign({}, opts, { example,
                newValue, collection: this.name })
        }, res => res.body);
    }
    updateByExample(example, newValue, opts) {
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/update-by-example",
            body: Object.assign({}, opts, { example,
                newValue, collection: this.name })
        }, res => res.body);
    }
    lookupByKeys(keys) {
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/lookup-by-keys",
            body: {
                keys,
                collection: this.name
            }
        }, res => res.body.documents);
    }
    removeByKeys(keys, options) {
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/remove-by-keys",
            body: {
                options,
                keys,
                collection: this.name
            }
        }, res => res.body);
    }
    import(data, _a = {}) {
        var { type = "auto" } = _a, opts = __rest(_a, ["type"]);
        if (Array.isArray(data)) {
            data = data.map(line => JSON.stringify(line)).join("\r\n") + "\r\n";
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/import",
            body: data,
            isBinary: true,
            qs: Object.assign({ type: type === null ? undefined : type }, opts, { collection: this.name })
        }, res => res.body);
    }
    indexes() {
        return this._connection.request({
            path: "/_api/index",
            qs: { collection: this.name }
        }, res => res.body.indexes);
    }
    index(indexHandle) {
        return this._connection.request({ path: `/_api/index/${this._indexHandle(indexHandle)}` }, res => res.body);
    }
    createIndex(details) {
        return this._connection.request({
            method: "POST",
            path: "/_api/index",
            body: details,
            qs: { collection: this.name }
        }, res => res.body);
    }
    dropIndex(indexHandle) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/index/${this._indexHandle(indexHandle)}`
        }, res => res.body);
    }
    createCapConstraint(opts) {
        if (typeof opts === "number") {
            opts = { size: opts };
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/index",
            body: Object.assign({}, opts, { type: "cap" }),
            qs: { collection: this.name }
        }, res => res.body);
    }
    createHashIndex(fields, opts) {
        if (typeof fields === "string") {
            fields = [fields];
        }
        if (typeof opts === "boolean") {
            opts = { unique: opts };
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/index",
            body: Object.assign({ unique: false }, opts, { type: "hash", fields: fields }),
            qs: { collection: this.name }
        }, res => res.body);
    }
    createSkipList(fields, opts) {
        if (typeof fields === "string") {
            fields = [fields];
        }
        if (typeof opts === "boolean") {
            opts = { unique: opts };
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/index",
            body: Object.assign({ unique: false }, opts, { type: "skiplist", fields: fields }),
            qs: { collection: this.name }
        }, res => res.body);
    }
    createPersistentIndex(fields, opts) {
        if (typeof fields === "string") {
            fields = [fields];
        }
        if (typeof opts === "boolean") {
            opts = { unique: opts };
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/index",
            body: Object.assign({ unique: false }, opts, { type: "persistent", fields: fields }),
            qs: { collection: this.name }
        }, res => res.body);
    }
    createGeoIndex(fields, opts) {
        if (typeof fields === "string") {
            fields = [fields];
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/index",
            body: Object.assign({}, opts, { fields, type: "geo" }),
            qs: { collection: this.name }
        }, res => res.body);
    }
    createFulltextIndex(fields, minLength) {
        if (typeof fields === "string") {
            fields = [fields];
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/index",
            body: { fields, minLength, type: "fulltext" },
            qs: { collection: this.name }
        }, res => res.body);
    }
    fulltext(attribute, query, opts = {}) {
        if (opts.index)
            opts.index = this._indexHandle(opts.index);
        return this._connection.request({
            method: "PUT",
            path: "/_api/simple/fulltext",
            body: Object.assign({}, opts, { attribute,
                query, collection: this.name })
        }, res => new cursor_1.ArrayCursor(this._connection, res.body, res.host));
    }
}
exports.BaseCollection = BaseCollection;
class DocumentCollection extends BaseCollection {
    constructor(connection, name) {
        super(connection, name);
        this.type = CollectionType.DOCUMENT_COLLECTION;
    }
    save(data, opts) {
        if (typeof opts === "boolean") {
            opts = { returnNew: opts };
        }
        if (this._connection.arangoMajor <= 2) {
            return this._connection.request({
                method: "POST",
                path: "/_api/document",
                body: data,
                qs: Object.assign({}, opts, { collection: this.name })
            }, res => res.body);
        }
        return this._connection.request({
            method: "POST",
            path: `/_api/document/${this.name}`,
            body: data,
            qs: opts
        }, res => res.body);
    }
}
exports.DocumentCollection = DocumentCollection;
class EdgeCollection extends BaseCollection {
    constructor(connection, name) {
        super(connection, name);
        this.type = CollectionType.EDGE_COLLECTION;
    }
    _documentPath(documentHandle) {
        if (this._connection.arangoMajor < 3) {
            return `edge/${this._documentHandle(documentHandle)}`;
        }
        return `document/${this._documentHandle(documentHandle)}`;
    }
    edge(documentHandle, opts = {}) {
        if (typeof opts === "boolean") {
            opts = { graceful: opts };
        }
        return this.document(documentHandle, opts);
    }
    save(data, fromIdOrOpts, toId, opts) {
        if (toId !== undefined) {
            data._from = this._documentHandle(fromIdOrOpts);
            data._to = this._documentHandle(toId);
        }
        else if (fromIdOrOpts !== undefined) {
            opts = fromIdOrOpts;
        }
        if (typeof opts === "boolean") {
            opts = { returnNew: opts };
        }
        if (this._connection.arangoMajor <= 2) {
            return this._connection.request({
                method: "POST",
                path: "/_api/edge",
                body: data,
                qs: Object.assign({}, opts, { collection: this.name, from: data._from, to: data._to })
            }, res => res.body);
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/document",
            body: data,
            qs: Object.assign({}, opts, { collection: this.name })
        }, res => res.body);
    }
    _edges(documentHandle, direction) {
        return this._connection.request({
            path: `/_api/edges/${this.name}`,
            qs: {
                direction,
                vertex: this._documentHandle(documentHandle)
            }
        }, res => res.body.edges);
    }
    edges(vertex) {
        return this._edges(vertex, undefined);
    }
    inEdges(vertex) {
        return this._edges(vertex, "in");
    }
    outEdges(vertex) {
        return this._edges(vertex, "out");
    }
    traversal(startVertex, opts) {
        return this._connection.request({
            method: "POST",
            path: "/_api/traversal",
            body: Object.assign({}, opts, { startVertex, edgeCollection: this.name })
        }, res => res.body.result);
    }
}
exports.EdgeCollection = EdgeCollection;
function constructCollection(connection, data) {
    const Collection = data.type === CollectionType.EDGE_COLLECTION
        ? EdgeCollection
        : DocumentCollection;
    return new Collection(connection, data.name);
}
exports.constructCollection = constructCollection;
//# sourceMappingURL=collection.js.map