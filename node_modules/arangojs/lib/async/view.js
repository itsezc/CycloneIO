"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
var ViewType;
(function (ViewType) {
    ViewType["ARANGOSEARCH_VIEW"] = "arangosearch";
})(ViewType = exports.ViewType || (exports.ViewType = {}));
const VIEW_NOT_FOUND = 1203;
class BaseView {
    constructor(connection, name) {
        this.isArangoView = true;
        this.name = name;
        this._connection = connection;
    }
    get() {
        return this._connection.request({ path: `/_api/view/${this.name}` }, res => res.body);
    }
    exists() {
        return this.get().then(() => true, err => {
            if (error_1.isArangoError(err) && err.errorNum === VIEW_NOT_FOUND) {
                return false;
            }
            throw err;
        });
    }
    async rename(name) {
        const result = await this._connection.request({
            method: "PUT",
            path: `/_api/view/${this.name}/rename`,
            body: { name }
        }, res => res.body);
        this.name = name;
        return result;
    }
    drop() {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/view/${this.name}`
        }, res => res.body);
    }
}
exports.BaseView = BaseView;
class ArangoSearchView extends BaseView {
    constructor() {
        super(...arguments);
        this.type = ViewType.ARANGOSEARCH_VIEW;
    }
    create(properties = {}) {
        return this._connection.request({
            method: "POST",
            path: "/_api/view",
            body: {
                properties,
                name: this.name,
                type: this.type
            }
        }, res => res.body);
    }
    properties() {
        return this._connection.request({ path: `/_api/view/${this.name}/properties` }, res => res.body);
    }
    setProperties(properties = {}) {
        return this._connection.request({
            method: "PATCH",
            path: `/_api/view/${this.name}/properties`,
            body: properties
        }, res => res.body);
    }
    replaceProperties(properties = {}) {
        return this._connection.request({
            method: "PUT",
            path: `/_api/view/${this.name}/properties`,
            body: properties
        }, res => res.body);
    }
}
exports.ArangoSearchView = ArangoSearchView;
function constructView(connection, data) {
    if (data.type && data.type !== ViewType.ARANGOSEARCH_VIEW) {
        throw new Error(`Unknown view type "${data.type}"`);
    }
    return new ArangoSearchView(connection, data.name);
}
exports.constructView = constructView;
//# sourceMappingURL=view.js.map