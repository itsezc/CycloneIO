"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const collection_1 = require("./collection");
const error_1 = require("./error");
class GraphVertexCollection extends collection_1.BaseCollection {
    constructor(connection, name, graph) {
        super(connection, name);
        this.type = collection_1.CollectionType.DOCUMENT_COLLECTION;
        this.graph = graph;
    }
    document(documentHandle, opts = {}) {
        if (typeof opts === "boolean") {
            opts = { graceful: opts };
        }
        const { allowDirtyRead = undefined, graceful = false } = opts;
        const result = this._connection.request({
            path: `/_api/gharial/${this.graph.name}/vertex/${this._documentHandle(documentHandle)}`,
            allowDirtyRead
        }, res => res.body.vertex);
        if (!graceful)
            return result;
        return result.catch(err => {
            if (error_1.isArangoError(err) && err.errorNum === collection_1.DOCUMENT_NOT_FOUND) {
                return null;
            }
            throw err;
        });
    }
    vertex(documentHandle, opts = {}) {
        if (typeof opts === "boolean") {
            opts = { graceful: opts };
        }
        return this.document(documentHandle, opts);
    }
    save(data, opts) {
        return this._connection.request({
            method: "POST",
            path: `/_api/gharial/${this.graph.name}/vertex/${this.name}`,
            body: data,
            qs: opts
        }, res => res.body.vertex);
    }
    replace(documentHandle, newValue, opts = {}) {
        var _a;
        const headers = {};
        if (typeof opts === "string") {
            opts = { rev: opts };
        }
        if (opts.rev) {
            let rev;
            (_a = opts, { rev } = _a, opts = __rest(_a, ["rev"]));
            headers["if-match"] = rev;
        }
        return this._connection.request({
            method: "PUT",
            path: `/_api/gharial/${this.graph.name}/vertex/${this._documentHandle(documentHandle)}`,
            body: newValue,
            qs: opts,
            headers
        }, res => res.body.vertex);
    }
    update(documentHandle, newValue, opts = {}) {
        var _a;
        const headers = {};
        if (typeof opts === "string") {
            opts = { rev: opts };
        }
        if (opts.rev) {
            let rev;
            (_a = opts, { rev } = _a, opts = __rest(_a, ["rev"]));
            headers["if-match"] = rev;
        }
        return this._connection.request({
            method: "PATCH",
            path: `/_api/gharial/${this.graph.name}/vertex/${this._documentHandle(documentHandle)}`,
            body: newValue,
            qs: opts,
            headers
        }, res => res.body.vertex);
    }
    remove(documentHandle, opts = {}) {
        var _a;
        const headers = {};
        if (typeof opts === "string") {
            opts = { rev: opts };
        }
        if (opts.rev) {
            let rev;
            (_a = opts, { rev } = _a, opts = __rest(_a, ["rev"]));
            headers["if-match"] = rev;
        }
        return this._connection.request({
            method: "DELETE",
            path: `/_api/gharial/${this.graph.name}/vertex/${this._documentHandle(documentHandle)}`,
            qs: opts,
            headers
        }, res => res.body.removed);
    }
}
exports.GraphVertexCollection = GraphVertexCollection;
class GraphEdgeCollection extends collection_1.EdgeCollection {
    constructor(connection, name, graph) {
        super(connection, name);
        this.type = collection_1.CollectionType.EDGE_COLLECTION;
        this.type = collection_1.CollectionType.EDGE_COLLECTION;
        this.graph = graph;
    }
    document(documentHandle, opts = {}) {
        if (typeof opts === "boolean") {
            opts = { graceful: opts };
        }
        const { allowDirtyRead = undefined, graceful = false } = opts;
        const result = this._connection.request({
            path: `/_api/gharial/${this.graph.name}/edge/${this._documentHandle(documentHandle)}`,
            allowDirtyRead
        }, res => res.body.edge);
        if (!graceful)
            return result;
        return result.catch(err => {
            if (error_1.isArangoError(err) && err.errorNum === collection_1.DOCUMENT_NOT_FOUND) {
                return null;
            }
            throw err;
        });
    }
    save(data, fromId, toId, opts) {
        if (fromId !== undefined) {
            if (toId !== undefined) {
                data._from = this._documentHandle(fromId);
                data._to = this._documentHandle(toId);
            }
            else {
                opts = fromId;
            }
        }
        return this._connection.request({
            method: "POST",
            path: `/_api/gharial/${this.graph.name}/edge/${this.name}`,
            body: data,
            qs: opts
        }, res => res.body.edge);
    }
    replace(documentHandle, newValue, opts = {}) {
        var _a;
        const headers = {};
        if (typeof opts === "string") {
            opts = { rev: opts };
        }
        if (opts.rev) {
            let rev;
            (_a = opts, { rev } = _a, opts = __rest(_a, ["rev"]));
            headers["if-match"] = rev;
        }
        return this._connection.request({
            method: "PUT",
            path: `/_api/gharial/${this.graph.name}/edge/${this._documentHandle(documentHandle)}`,
            body: newValue,
            qs: opts,
            headers
        }, res => res.body.edge);
    }
    update(documentHandle, newValue, opts = {}) {
        var _a;
        const headers = {};
        if (typeof opts === "string") {
            opts = { rev: opts };
        }
        if (opts.rev) {
            let rev;
            (_a = opts, { rev } = _a, opts = __rest(_a, ["rev"]));
            headers["if-match"] = rev;
        }
        return this._connection.request({
            method: "PATCH",
            path: `/_api/gharial/${this.graph.name}/edge/${this._documentHandle(documentHandle)}`,
            body: newValue,
            qs: opts,
            headers
        }, res => res.body.edge);
    }
    remove(documentHandle, opts = {}) {
        var _a;
        const headers = {};
        if (typeof opts === "string") {
            opts = { rev: opts };
        }
        if (opts.rev) {
            let rev;
            (_a = opts, { rev } = _a, opts = __rest(_a, ["rev"]));
            headers["if-match"] = rev;
        }
        return this._connection.request({
            method: "DELETE",
            path: `/_api/gharial/${this.graph.name}/edge/${this._documentHandle(documentHandle)}`,
            qs: opts,
            headers
        }, res => res.body.removed);
    }
}
exports.GraphEdgeCollection = GraphEdgeCollection;
const GRAPH_NOT_FOUND = 1924;
class Graph {
    constructor(connection, name) {
        this.name = name;
        this._connection = connection;
    }
    get() {
        return this._connection.request({ path: `/_api/gharial/${this.name}` }, res => res.body.graph);
    }
    exists() {
        return this.get().then(() => true, err => {
            if (error_1.isArangoError(err) && err.errorNum === GRAPH_NOT_FOUND) {
                return false;
            }
            throw err;
        });
    }
    create(properties = {}, opts) {
        return this._connection.request({
            method: "POST",
            path: "/_api/gharial",
            body: Object.assign({}, properties, { name: this.name }),
            qs: opts
        }, res => res.body.graph);
    }
    drop(dropCollections = false) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/gharial/${this.name}`,
            qs: { dropCollections }
        }, res => res.body.removed);
    }
    vertexCollection(collectionName) {
        return new GraphVertexCollection(this._connection, collectionName, this);
    }
    listVertexCollections(opts) {
        return this._connection.request({ path: `/_api/gharial/${this.name}/vertex`, qs: opts }, res => res.body.collections);
    }
    vertexCollections(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const names = yield this.listVertexCollections(opts);
            return names.map((name) => new GraphVertexCollection(this._connection, name, this));
        });
    }
    addVertexCollection(collection) {
        if (collection_1.isArangoCollection(collection)) {
            collection = collection.name;
        }
        return this._connection.request({
            method: "POST",
            path: `/_api/gharial/${this.name}/vertex`,
            body: { collection }
        }, res => res.body.graph);
    }
    removeVertexCollection(collection, dropCollection = false) {
        if (collection_1.isArangoCollection(collection)) {
            collection = collection.name;
        }
        return this._connection.request({
            method: "DELETE",
            path: `/_api/gharial/${this.name}/vertex/${collection}`,
            qs: {
                dropCollection
            }
        }, res => res.body.graph);
    }
    edgeCollection(collectionName) {
        return new GraphEdgeCollection(this._connection, collectionName, this);
    }
    listEdgeCollections() {
        return this._connection.request({ path: `/_api/gharial/${this.name}/edge` }, res => res.body.collections);
    }
    edgeCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            const names = yield this.listEdgeCollections();
            return names.map((name) => new GraphEdgeCollection(this._connection, name, this));
        });
    }
    addEdgeDefinition(definition) {
        return this._connection.request({
            method: "POST",
            path: `/_api/gharial/${this.name}/edge`,
            body: definition
        }, res => res.body.graph);
    }
    replaceEdgeDefinition(definitionName, definition) {
        return this._connection.request({
            method: "PUT",
            path: `/_api/gharial/${this.name}/edge/${definitionName}`,
            body: definition
        }, res => res.body.graph);
    }
    removeEdgeDefinition(definitionName, dropCollection = false) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/gharial/${this.name}/edge/${definitionName}`,
            qs: {
                dropCollection
            }
        }, res => res.body.graph);
    }
    traversal(startVertex, opts) {
        return this._connection.request({
            method: "POST",
            path: `/_api/traversal`,
            body: Object.assign({}, opts, { startVertex, graphName: this.name })
        }, res => res.body.result);
    }
}
exports.Graph = Graph;
//# sourceMappingURL=graph.js.map