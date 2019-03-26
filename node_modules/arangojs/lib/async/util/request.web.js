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
const url_1 = require("url");
const joinPath_1 = require("./joinPath");
const xhr_1 = require("./xhr");
exports.isBrowser = true;
function omit(obj, keys) {
    const result = {};
    for (const key of Object.keys(obj)) {
        if (keys.includes(key))
            continue;
        result[key] = obj[key];
    }
    return result;
}
function createRequest(baseUrl, agentOptions) {
    const _a = url_1.parse(baseUrl), { auth } = _a, baseUrlParts = __rest(_a, ["auth"]);
    const options = omit(agentOptions, [
        "keepAlive",
        "keepAliveMsecs",
        "maxSockets"
    ]);
    return function request({ method, url, headers, body, timeout, expectBinary }, cb) {
        const urlParts = Object.assign({}, baseUrlParts, { pathname: url.pathname
                ? baseUrlParts.pathname
                    ? joinPath_1.joinPath(baseUrlParts.pathname, url.pathname)
                    : url.pathname
                : baseUrlParts.pathname, search: url.search
                ? baseUrlParts.search
                    ? `${baseUrlParts.search}&${url.search.slice(1)}`
                    : url.search
                : baseUrlParts.search });
        if (!headers["authorization"]) {
            headers["authorization"] = `Basic ${btoa(auth || "root:")}`;
        }
        let callback = (err, res) => {
            callback = () => undefined;
            cb(err, res);
        };
        const req = xhr_1.default(Object.assign({ responseType: expectBinary ? "blob" : "text" }, options, { url: url_1.format(urlParts), withCredentials: true, useXDR: true, body,
            method,
            headers,
            timeout }), (err, res) => {
            if (!err) {
                if (!res.body)
                    res.body = "";
                callback(null, res);
            }
            else {
                const error = err;
                error.request = req;
                callback(error);
            }
        });
    };
}
exports.createRequest = createRequest;
//# sourceMappingURL=request.web.js.map