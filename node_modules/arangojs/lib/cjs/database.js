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
const aql_query_1 = require("./aql-query");
const collection_1 = require("./collection");
const connection_1 = require("./connection");
const cursor_1 = require("./cursor");
const error_1 = require("./error");
const graph_1 = require("./graph");
const route_1 = require("./route");
const btoa_1 = require("./util/btoa");
const multipart_1 = require("./util/multipart");
const view_1 = require("./view");
function colToString(collection) {
    if (collection_1.isArangoCollection(collection)) {
        return String(collection.name);
    }
    else
        return String(collection);
}
const DATABASE_NOT_FOUND = 1228;
class Database {
    constructor(config) {
        this._connection = new connection_1.Connection(config);
    }
    get name() {
        return this._connection.getDatabaseName() || null;
    }
    route(path, headers) {
        return new route_1.Route(this._connection, path, headers);
    }
    acquireHostList() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._connection.getDatabaseName()) {
                throw new Error("Cannot acquire host list with absolute URL");
            }
            const urls = yield this._connection.request({ path: "/_api/cluster/endpoints" }, res => res.body.endpoints.map((endpoint) => endpoint.endpoint));
            this._connection.addToHostList(urls);
        });
    }
    close() {
        this._connection.close();
    }
    // Database manipulation
    useDatabase(databaseName) {
        this._connection.setDatabaseName(databaseName);
        return this;
    }
    useBearerAuth(token) {
        this._connection.setHeader("authorization", `Bearer ${token}`);
        return this;
    }
    useBasicAuth(username = "root", password = "") {
        this._connection.setHeader("authorization", `Basic ${btoa_1.btoa(`${username}:${password}`)}`);
        return this;
    }
    get() {
        return this._connection.request({ path: "/_api/database/current" }, res => res.body.result);
    }
    exists() {
        return this.get().then(() => true, err => {
            if (error_1.isArangoError(err) && err.errorNum === DATABASE_NOT_FOUND) {
                return false;
            }
            throw err;
        });
    }
    createDatabase(databaseName, users) {
        return this._connection.request({
            method: "POST",
            path: "/_api/database",
            body: { users, name: databaseName }
        }, res => res.body);
    }
    listDatabases() {
        return this._connection.request({ path: "/_api/database" }, res => res.body.result);
    }
    listUserDatabases() {
        return this._connection.request({ path: "/_api/database/user" }, res => res.body.result);
    }
    dropDatabase(databaseName) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/database/${databaseName}`
        }, res => res.body);
    }
    // Collection manipulation
    collection(collectionName) {
        return new collection_1.DocumentCollection(this._connection, collectionName);
    }
    edgeCollection(collectionName) {
        return new collection_1.EdgeCollection(this._connection, collectionName);
    }
    listCollections(excludeSystem = true) {
        return this._connection.request({
            path: "/_api/collection",
            qs: { excludeSystem }
        }, res => this._connection.arangoMajor <= 2
            ? res.body.collections
            : res.body.result);
    }
    collections(excludeSystem = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = yield this.listCollections(excludeSystem);
            return collections.map((data) => collection_1.constructCollection(this._connection, data));
        });
    }
    truncate(excludeSystem = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = yield this.listCollections(excludeSystem);
            return yield Promise.all(collections.map((data) => this._connection.request({
                method: "PUT",
                path: `/_api/collection/${data.name}/truncate`
            }, res => res.body)));
        });
    }
    // Views
    arangoSearchView(viewName) {
        return new view_1.ArangoSearchView(this._connection, viewName);
    }
    listViews() {
        return this._connection.request({ path: "/_api/view" }, res => res.body.result);
    }
    views() {
        return __awaiter(this, void 0, void 0, function* () {
            const views = yield this.listViews();
            return views.map((data) => view_1.constructView(this._connection, data));
        });
    }
    // Graph manipulation
    graph(graphName) {
        return new graph_1.Graph(this._connection, graphName);
    }
    listGraphs() {
        return this._connection.request({ path: "/_api/gharial" }, res => res.body.graphs);
    }
    graphs() {
        return __awaiter(this, void 0, void 0, function* () {
            const graphs = yield this.listGraphs();
            return graphs.map((data) => this.graph(data._key));
        });
    }
    transaction(collections, action, params, options) {
        if (typeof params === "number") {
            options = params;
            params = undefined;
        }
        if (typeof options === "number") {
            options = { lockTimeout: options };
        }
        if (typeof collections === "string") {
            collections = { write: [collections] };
        }
        else if (Array.isArray(collections)) {
            collections = { write: collections.map(colToString) };
        }
        else if (collection_1.isArangoCollection(collections)) {
            collections = { write: colToString(collections) };
        }
        else if (collections && typeof collections === "object") {
            collections = Object.assign({}, collections);
            if (collections.read) {
                if (!Array.isArray(collections.read)) {
                    collections.read = colToString(collections.read);
                }
                else
                    collections.read = collections.read.map(colToString);
            }
            if (collections.write) {
                if (!Array.isArray(collections.write)) {
                    collections.write = colToString(collections.write);
                }
                else
                    collections.write = collections.write.map(colToString);
            }
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/transaction",
            body: Object.assign({ collections,
                action,
                params }, options)
        }, res => res.body.result);
    }
    query(query, bindVars, opts) {
        if (aql_query_1.isAqlQuery(query)) {
            opts = bindVars;
            bindVars = query.bindVars;
            query = query.query;
        }
        else if (aql_query_1.isAqlLiteral(query)) {
            query = query.toAQL();
        }
        const _a = opts || {}, { allowDirtyRead = undefined, timeout = undefined } = _a, extra = __rest(_a, ["allowDirtyRead", "timeout"]);
        return this._connection.request({
            method: "POST",
            path: "/_api/cursor",
            body: Object.assign({}, extra, { query, bindVars }),
            allowDirtyRead,
            timeout
        }, res => new cursor_1.ArrayCursor(this._connection, res.body, res.host, allowDirtyRead));
    }
    explain(query, bindVars, opts) {
        if (aql_query_1.isAqlQuery(query)) {
            opts = bindVars;
            bindVars = query.bindVars;
            query = query.query;
        }
        else if (aql_query_1.isAqlLiteral(query)) {
            query = query.toAQL();
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/explain",
            body: { options: opts, query, bindVars }
        }, res => res.body);
    }
    parse(query) {
        if (aql_query_1.isAqlQuery(query)) {
            query = query.query;
        }
        else if (aql_query_1.isAqlLiteral(query)) {
            query = query.toAQL();
        }
        return this._connection.request({
            method: "POST",
            path: "/_api/query",
            body: { query }
        }, res => res.body);
    }
    queryTracking() {
        return this._connection.request({
            method: "GET",
            path: "/_api/query/properties"
        }, res => res.body);
    }
    setQueryTracking(opts) {
        return this._connection.request({
            method: "PUT",
            path: "/_api/query/properties",
            body: opts
        }, res => res.body);
    }
    listRunningQueries() {
        return this._connection.request({
            method: "GET",
            path: "/_api/query/current"
        }, res => res.body);
    }
    listSlowQueries() {
        return this._connection.request({
            method: "GET",
            path: "/_api/query/slow"
        }, res => res.body);
    }
    clearSlowQueries() {
        return this._connection.request({
            method: "DELETE",
            path: "/_api/query/slow"
        }, () => undefined);
    }
    killQuery(queryId) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/query/${queryId}`
        }, () => undefined);
    }
    // Function management
    listFunctions() {
        return this._connection.request({ path: "/_api/aqlfunction" }, res => res.body);
    }
    createFunction(name, code) {
        return this._connection.request({
            method: "POST",
            path: "/_api/aqlfunction",
            body: { name, code }
        }, res => res.body);
    }
    dropFunction(name, group = false) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/aqlfunction/${name}`,
            body: { group }
        }, res => res.body);
    }
    // Service management
    listServices() {
        return this._connection.request({ path: "/_api/foxx" }, res => res.body);
    }
    installService(mount, source, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { configuration, dependencies } = opts, qs = __rest(opts, ["configuration", "dependencies"]);
            const req = yield multipart_1.toForm({
                configuration,
                dependencies,
                source
            });
            return yield this._connection.request(Object.assign({}, req, { method: "POST", path: "/_api/foxx", isBinary: true, qs: Object.assign({}, qs, { mount }) }), res => res.body);
        });
    }
    upgradeService(mount, source, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { configuration, dependencies } = opts, qs = __rest(opts, ["configuration", "dependencies"]);
            const req = yield multipart_1.toForm({
                configuration,
                dependencies,
                source
            });
            return yield this._connection.request(Object.assign({}, req, { method: "PATCH", path: "/_api/foxx/service", isBinary: true, qs: Object.assign({}, qs, { mount }) }), res => res.body);
        });
    }
    replaceService(mount, source, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { configuration, dependencies } = opts, qs = __rest(opts, ["configuration", "dependencies"]);
            const req = yield multipart_1.toForm({
                configuration,
                dependencies,
                source
            });
            return yield this._connection.request(Object.assign({}, req, { method: "PUT", path: "/_api/foxx/service", isBinary: true, qs: Object.assign({}, qs, { mount }) }), res => res.body);
        });
    }
    uninstallService(mount, opts = {}) {
        return this._connection.request({
            method: "DELETE",
            path: "/_api/foxx/service",
            qs: Object.assign({}, opts, { mount })
        }, () => undefined);
    }
    getService(mount) {
        return this._connection.request({
            path: "/_api/foxx/service",
            qs: { mount }
        }, res => res.body);
    }
    getServiceConfiguration(mount, minimal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._connection.request({
                path: "/_api/foxx/configuration",
                qs: { mount, minimal }
            }, res => res.body);
            if (!minimal ||
                !Object.keys(result).every((key) => result[key].title))
                return result;
            const values = {};
            for (const key of Object.keys(result)) {
                values[key] = result[key].current;
            }
            return values;
        });
    }
    updateServiceConfiguration(mount, cfg, minimal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._connection.request({
                method: "PATCH",
                path: "/_api/foxx/configuration",
                body: cfg,
                qs: { mount, minimal }
            }, res => res.body);
            if (minimal ||
                !result.values ||
                !Object.keys(result.values).every((key) => result.values[key].title)) {
                return result;
            }
            const result2 = yield this.getServiceConfiguration(mount, minimal);
            if (result.warnings) {
                for (const key of Object.keys(result2)) {
                    result2[key].warning = result.warnings[key];
                }
            }
            return result2;
        });
    }
    replaceServiceConfiguration(mount, cfg, minimal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._connection.request({
                method: "PUT",
                path: "/_api/foxx/configuration",
                body: cfg,
                qs: { mount, minimal }
            }, res => res.body);
            if (minimal ||
                !result.values ||
                !Object.keys(result.values).every((key) => result.values[key].title)) {
                return result;
            }
            const result2 = yield this.getServiceConfiguration(mount, minimal);
            if (result.warnings) {
                for (const key of Object.keys(result2)) {
                    result2[key].warning = result.warnings[key];
                }
            }
            return result2;
        });
    }
    getServiceDependencies(mount, minimal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._connection.request({
                path: "/_api/foxx/dependencies",
                qs: { mount, minimal }
            }, res => res.body);
            if (!minimal ||
                !Object.keys(result).every((key) => result[key].title))
                return result;
            const values = {};
            for (const key of Object.keys(result)) {
                values[key] = result[key].current;
            }
            return values;
        });
    }
    updateServiceDependencies(mount, cfg, minimal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._connection.request({
                method: "PATCH",
                path: "/_api/foxx/dependencies",
                body: cfg,
                qs: { mount, minimal }
            }, res => res.body);
            if (minimal ||
                !result.values ||
                !Object.keys(result.values).every((key) => result.values[key].title)) {
                return result;
            }
            const result2 = yield this.getServiceDependencies(mount, minimal);
            if (result.warnings) {
                for (const key of Object.keys(result2)) {
                    result2[key].warning = result.warnings[key];
                }
            }
            return result2;
        });
    }
    replaceServiceDependencies(mount, cfg, minimal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._connection.request({
                method: "PUT",
                path: "/_api/foxx/dependencies",
                body: cfg,
                qs: { mount, minimal }
            }, res => res.body);
            if (minimal ||
                !result.values ||
                !Object.keys(result.values).every((key) => result.values[key].title)) {
                return result;
            }
            const result2 = yield this.getServiceDependencies(mount, minimal);
            if (result.warnings) {
                for (const key of Object.keys(result2)) {
                    result2[key].warning = result.warnings[key];
                }
            }
            return result2;
        });
    }
    enableServiceDevelopmentMode(mount) {
        return this._connection.request({
            method: "POST",
            path: "/_api/foxx/development",
            qs: { mount }
        }, res => res.body);
    }
    disableServiceDevelopmentMode(mount) {
        return this._connection.request({
            method: "DELETE",
            path: "/_api/foxx/development",
            qs: { mount }
        }, res => res.body);
    }
    listServiceScripts(mount) {
        return this._connection.request({
            path: "/_api/foxx/scripts",
            qs: { mount }
        }, res => res.body);
    }
    runServiceScript(mount, name, args) {
        return this._connection.request({
            method: "POST",
            path: `/_api/foxx/scripts/${name}`,
            body: args,
            qs: { mount }
        }, res => res.body);
    }
    runServiceTests(mount, opts) {
        return this._connection.request({
            method: "POST",
            path: "/_api/foxx/tests",
            qs: Object.assign({}, opts, { mount })
        }, res => res.body);
    }
    getServiceReadme(mount) {
        return this._connection.request({
            path: "/_api/foxx/readme",
            qs: { mount }
        }, res => res.body);
    }
    getServiceDocumentation(mount) {
        return this._connection.request({
            path: "/_api/foxx/swagger",
            qs: { mount }
        }, res => res.body);
    }
    downloadService(mount) {
        return this._connection.request({
            method: "POST",
            path: "/_api/foxx/download",
            qs: { mount },
            expectBinary: true
        }, res => res.body);
    }
    commitLocalServiceState(replace = false) {
        return this._connection.request({
            method: "POST",
            path: "/_api/foxx/commit",
            qs: { replace }
        }, () => undefined);
    }
    version() {
        return this._connection.request({
            method: "GET",
            path: "/_api/version"
        }, res => res.body);
    }
    login(username = "root", password = "") {
        return this._connection.request({
            method: "POST",
            path: "/_open/auth",
            body: { username, password }
        }, res => {
            this.useBearerAuth(res.body.jwt);
            return res.body.jwt;
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map