"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizeUrl(url) {
    const raw = url.match(/^(tcp|ssl|tls)((?::|\+).+)/);
    if (raw)
        url = (raw[1] === "tcp" ? "http" : "https") + raw[2];
    const unix = url.match(/^(?:(https?)\+)?unix:\/\/(\/.+)/);
    if (unix)
        url = `${unix[1] || "http"}://unix:${unix[2]}`;
    return url;
}
exports.sanitizeUrl = sanitizeUrl;
//# sourceMappingURL=sanitizeUrl.js.map