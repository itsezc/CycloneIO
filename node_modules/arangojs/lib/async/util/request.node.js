"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const https_1 = require("https");
const url_1 = require("url");
const btoa_1 = require("./btoa");
const joinPath_1 = require("./joinPath");
exports.isBrowser = false;
function createRequest(baseUrl, agentOptions, agent) {
    const baseUrlParts = url_1.parse(baseUrl);
    if (!baseUrlParts.protocol) {
        throw new Error(`Invalid URL (no protocol): ${baseUrl}`);
    }
    const isTls = baseUrlParts.protocol === "https:";
    let socketPath;
    if (baseUrl.startsWith(`${baseUrlParts.protocol}//unix:`)) {
        if (!baseUrlParts.pathname) {
            throw new Error(`Unix socket URL must be in the format http://unix:/socket/path, http+unix:///socket/path or unix:///socket/path not ${baseUrl}`);
        }
        const i = baseUrlParts.pathname.indexOf(":");
        if (i === -1) {
            socketPath = baseUrlParts.pathname;
            baseUrlParts.pathname = undefined;
        }
        else {
            socketPath = baseUrlParts.pathname.slice(0, i);
            baseUrlParts.pathname = baseUrlParts.pathname.slice(i + 1) || undefined;
        }
    }
    if (socketPath && !socketPath.replace(/\//g, "").length) {
        throw new Error(`Invalid URL (empty unix socket path): ${baseUrl}`);
    }
    if (!agent) {
        if (isTls)
            agent = new https_1.Agent(agentOptions);
        else
            agent = new http_1.Agent(agentOptions);
    }
    return Object.assign(function request({ method, url, headers, body, timeout }, callback) {
        let path = baseUrlParts.pathname
            ? url.pathname
                ? joinPath_1.joinPath(baseUrlParts.pathname, url.pathname)
                : baseUrlParts.pathname
            : url.pathname;
        const search = url.search
            ? baseUrlParts.search
                ? `${baseUrlParts.search}&${url.search.slice(1)}`
                : url.search
            : baseUrlParts.search;
        if (search)
            path += search;
        if (body && !headers["content-length"]) {
            headers["content-length"] = String(Buffer.byteLength(body));
        }
        if (!headers["authorization"]) {
            headers["authorization"] = `Basic ${btoa_1.btoa(baseUrlParts.auth || "root:")}`;
        }
        const options = { path, method, headers, agent };
        if (socketPath) {
            options.socketPath = socketPath;
        }
        else {
            options.host = baseUrlParts.hostname;
            options.port = baseUrlParts.port;
        }
        let called = false;
        try {
            const req = (isTls ? https_1.request : http_1.request)(options, (res) => {
                const data = [];
                res.on("data", chunk => data.push(chunk));
                res.on("end", () => {
                    const result = res;
                    result.request = req;
                    result.body = Buffer.concat(data);
                    if (called)
                        return;
                    called = true;
                    callback(null, result);
                });
            });
            if (timeout) {
                req.setTimeout(timeout);
            }
            req.on("timeout", () => {
                req.abort();
            });
            req.on("error", err => {
                const error = err;
                error.request = req;
                if (called)
                    return;
                called = true;
                callback(err);
            });
            if (body)
                req.write(body);
            req.end();
        }
        catch (e) {
            if (called)
                return;
            called = true;
            callback(e);
        }
    }, {
        close() {
            agent.destroy();
        }
    });
}
exports.createRequest = createRequest;
//# sourceMappingURL=request.node.js.map