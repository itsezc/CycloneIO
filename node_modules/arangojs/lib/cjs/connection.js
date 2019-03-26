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
const querystring_1 = require("querystring");
const error_1 = require("./error");
const request_1 = require("./util/request");
const sanitizeUrl_1 = require("./util/sanitizeUrl");
const LinkedList = require("linkedlist/lib/linkedlist");
const MIME_JSON = /\/(json|javascript)(\W|$)/;
const LEADER_ENDPOINT_HEADER = "x-arango-endpoint";
function isSystemError(err) {
    return (Object.getPrototypeOf(err) === Error.prototype &&
        err.hasOwnProperty("code") &&
        err.hasOwnProperty("errno") &&
        err.hasOwnProperty("syscall"));
}
class Connection {
    constructor(config = {}) {
        this._activeTasks = 0;
        this._arangoVersion = 30000;
        this._databaseName = "_system";
        this._queue = new LinkedList();
        this._hosts = [];
        this._urls = [];
        if (typeof config === "string")
            config = { url: config };
        else if (Array.isArray(config))
            config = { url: config };
        if (config.arangoVersion !== undefined) {
            this._arangoVersion = config.arangoVersion;
        }
        if (config.isAbsolute) {
            this._databaseName = false;
        }
        this._agent = config.agent;
        this._agentOptions = request_1.isBrowser
            ? Object.assign({}, config.agentOptions) : Object.assign({ maxSockets: 3, keepAlive: true, keepAliveMsecs: 1000 }, config.agentOptions);
        this._maxTasks = this._agentOptions.maxSockets || 3;
        if (this._agentOptions.keepAlive)
            this._maxTasks *= 2;
        this._headers = Object.assign({}, config.headers);
        this._loadBalancingStrategy = config.loadBalancingStrategy || "NONE";
        this._useFailOver = this._loadBalancingStrategy !== "ROUND_ROBIN";
        if (config.maxRetries === false) {
            this._shouldRetry = false;
            this._maxRetries = 0;
        }
        else {
            this._shouldRetry = true;
            this._maxRetries = config.maxRetries || 0;
        }
        const urls = config.url
            ? Array.isArray(config.url)
                ? config.url
                : [config.url]
            : ["http://localhost:8529"];
        this.addToHostList(urls);
        if (this._loadBalancingStrategy === "ONE_RANDOM") {
            this._activeHost = Math.floor(Math.random() * this._hosts.length);
            this._activeDirtyHost = Math.floor(Math.random() * this._hosts.length);
        }
        else {
            this._activeHost = 0;
            this._activeDirtyHost = 0;
        }
    }
    get _databasePath() {
        return this._databaseName === false ? "" : `/_db/${this._databaseName}`;
    }
    _runQueue() {
        if (!this._queue.length || this._activeTasks >= this._maxTasks)
            return;
        const task = this._queue.shift();
        let host = this._activeHost;
        if (task.host !== undefined) {
            host = task.host;
        }
        else if (task.allowDirtyRead) {
            host = this._activeDirtyHost;
            this._activeDirtyHost = (this._activeDirtyHost + 1) % this._hosts.length;
            task.options.headers["x-arango-allow-dirty-read"] = "true";
        }
        else if (this._loadBalancingStrategy === "ROUND_ROBIN") {
            this._activeHost = (this._activeHost + 1) % this._hosts.length;
        }
        this._activeTasks += 1;
        this._hosts[host](task.options, (err, res) => {
            this._activeTasks -= 1;
            if (err) {
                if (!task.allowDirtyRead &&
                    this._hosts.length > 1 &&
                    this._activeHost === host &&
                    this._useFailOver) {
                    this._activeHost = (this._activeHost + 1) % this._hosts.length;
                }
                if (!task.host &&
                    this._shouldRetry &&
                    task.retries < (this._maxRetries || this._hosts.length - 1) &&
                    isSystemError(err) &&
                    err.syscall === "connect" &&
                    err.code === "ECONNREFUSED") {
                    task.retries += 1;
                    this._queue.push(task);
                }
                else {
                    task.reject(err);
                }
            }
            else {
                const response = res;
                if (response.statusCode === 503 &&
                    response.headers[LEADER_ENDPOINT_HEADER]) {
                    const url = response.headers[LEADER_ENDPOINT_HEADER];
                    const [index] = this.addToHostList(url);
                    task.host = index;
                    if (this._activeHost === host) {
                        this._activeHost = index;
                    }
                    this._queue.push(task);
                }
                else {
                    response.host = host;
                    task.resolve(response);
                }
            }
            this._runQueue();
        });
    }
    _buildUrl({ absolutePath = false, basePath, path, qs }) {
        let pathname = "";
        let search;
        if (!absolutePath) {
            pathname = this._databasePath;
            if (basePath)
                pathname += basePath;
        }
        if (path)
            pathname += path;
        if (qs) {
            if (typeof qs === "string")
                search = `?${qs}`;
            else
                search = `?${querystring_1.stringify(qs)}`;
        }
        return search ? { pathname, search } : { pathname };
    }
    addToHostList(urls) {
        const cleanUrls = (Array.isArray(urls) ? urls : [urls]).map(url => sanitizeUrl_1.sanitizeUrl(url));
        const newUrls = cleanUrls.filter(url => this._urls.indexOf(url) === -1);
        this._urls.push(...newUrls);
        this._hosts.push(...newUrls.map((url) => request_1.createRequest(url, this._agentOptions, this._agent)));
        return cleanUrls.map(url => this._urls.indexOf(url));
    }
    get arangoMajor() {
        return Math.floor(this._arangoVersion / 10000);
    }
    getDatabaseName() {
        return this._databaseName;
    }
    getActiveHost() {
        return this._activeHost;
    }
    setDatabaseName(databaseName) {
        if (this._databaseName === false) {
            throw new Error("Can not change database from absolute URL");
        }
        this._databaseName = databaseName;
    }
    setHeader(key, value) {
        this._headers[key] = value;
    }
    close() {
        for (const host of this._hosts) {
            if (host.close)
                host.close();
        }
    }
    request(_a, getter) {
        var { host, method = "GET", body, expectBinary = false, isBinary = false, allowDirtyRead = false, timeout = 0, headers } = _a, urlInfo = __rest(_a, ["host", "method", "body", "expectBinary", "isBinary", "allowDirtyRead", "timeout", "headers"]);
        return new Promise((resolve, reject) => {
            let contentType = "text/plain";
            if (isBinary) {
                contentType = "application/octet-stream";
            }
            else if (body) {
                if (typeof body === "object") {
                    body = JSON.stringify(body);
                    contentType = "application/json";
                }
                else {
                    body = String(body);
                }
            }
            const extraHeaders = Object.assign({}, this._headers, { "content-type": contentType, "x-arango-version": String(this._arangoVersion) });
            this._queue.push({
                retries: 0,
                host,
                allowDirtyRead,
                options: {
                    url: this._buildUrl(urlInfo),
                    headers: Object.assign({}, extraHeaders, headers),
                    timeout,
                    method,
                    expectBinary,
                    body
                },
                reject,
                resolve: (res) => {
                    const contentType = res.headers["content-type"];
                    let parsedBody = undefined;
                    if (res.body.length && contentType && contentType.match(MIME_JSON)) {
                        try {
                            parsedBody = res.body;
                            parsedBody = JSON.parse(parsedBody);
                        }
                        catch (e) {
                            if (!expectBinary) {
                                if (typeof parsedBody !== "string") {
                                    parsedBody = res.body.toString("utf-8");
                                }
                                e.response = res;
                                reject(e);
                                return;
                            }
                        }
                    }
                    else if (res.body && !expectBinary) {
                        parsedBody = res.body.toString("utf-8");
                    }
                    else {
                        parsedBody = res.body;
                    }
                    if (parsedBody &&
                        parsedBody.hasOwnProperty("error") &&
                        parsedBody.hasOwnProperty("code") &&
                        parsedBody.hasOwnProperty("errorMessage") &&
                        parsedBody.hasOwnProperty("errorNum")) {
                        res.body = parsedBody;
                        reject(new error_1.ArangoError(res));
                    }
                    else if (res.statusCode && res.statusCode >= 400) {
                        res.body = parsedBody;
                        reject(new error_1.HttpError(res));
                    }
                    else {
                        if (!expectBinary)
                            res.body = parsedBody;
                        resolve(getter ? getter(res) : res);
                    }
                }
            });
            this._runQueue();
        });
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map