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
class Route {
    constructor(connection, path = "", headers = {}) {
        if (!path)
            path = "";
        else if (path.charAt(0) !== "/")
            path = `/${path}`;
        this._connection = connection;
        this._path = path;
        this._headers = headers;
    }
    route(path, headers) {
        if (!path)
            path = "";
        else if (path.charAt(0) !== "/")
            path = `/${path}`;
        return new Route(this._connection, this._path + path, Object.assign({}, this._headers, headers));
    }
    request(_a) {
        var { method, path, headers = {} } = _a, opts = __rest(_a, ["method", "path", "headers"]);
        if (!path)
            opts.path = "";
        else if (this._path && path.charAt(0) !== "/")
            opts.path = `/${path}`;
        else
            opts.path = path;
        opts.basePath = this._path;
        opts.headers = Object.assign({}, this._headers, headers);
        opts.method = method ? method.toUpperCase() : "GET";
        return this._connection.request(opts);
    }
    _request1(method, ...args) {
        let path = "";
        let qs;
        let headers;
        if (args[0] === undefined || typeof args[0] === "string") {
            path = args.shift();
        }
        if (args[0] === undefined || typeof args[0] === "object") {
            qs = args.shift();
        }
        if (args[0] === undefined || typeof args[0] === "object") {
            headers = args.shift();
        }
        return this.request({ method, path, qs, headers });
    }
    _request2(method, ...args) {
        let path = "";
        let body = undefined;
        let qs;
        let headers;
        if (args[0] === undefined || typeof args[0] === "string") {
            path = args.shift();
        }
        body = args.shift();
        if (args[0] === undefined || typeof args[0] === "object") {
            qs = args.shift();
        }
        if (args[0] === undefined || typeof args[0] === "object") {
            headers = args.shift();
        }
        return this.request({ method, path, body, qs, headers });
    }
    delete(...args) {
        return this._request1("DELETE", ...args);
    }
    get(...args) {
        return this._request1("GET", ...args);
    }
    head(...args) {
        return this._request1("HEAD", ...args);
    }
    patch(...args) {
        return this._request2("PATCH", ...args);
    }
    post(...args) {
        return this._request2("POST", ...args);
    }
    put(...args) {
        return this._request2("PUT", ...args);
    }
}
exports.Route = Route;
//# sourceMappingURL=route.js.map