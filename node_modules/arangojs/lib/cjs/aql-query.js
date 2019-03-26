"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("./collection");
function isAqlQuery(query) {
    return Boolean(query && query.query && query.bindVars);
}
exports.isAqlQuery = isAqlQuery;
function isGeneratedAqlQuery(query) {
    return isAqlQuery(query) && typeof query._source === "function";
}
exports.isGeneratedAqlQuery = isGeneratedAqlQuery;
function isAqlLiteral(literal) {
    return Boolean(literal && typeof literal.toAQL === "function");
}
exports.isAqlLiteral = isAqlLiteral;
function aql(templateStrings, ...args) {
    const strings = [...templateStrings];
    const bindVars = {};
    const bindVals = [];
    let query = strings[0];
    for (let i = 0; i < args.length; i++) {
        const rawValue = args[i];
        let value = rawValue;
        if (isGeneratedAqlQuery(rawValue)) {
            const src = rawValue._source();
            if (src.args.length) {
                query += src.strings[0];
                args.splice(i, 1, ...src.args);
                strings.splice(i, 2, strings[i] + src.strings[0], ...src.strings.slice(1, src.args.length), src.strings[src.args.length] + strings[i + 1]);
            }
            else {
                query += rawValue.query + strings[i + 1];
                args.splice(i, 1);
                strings.splice(i, 2, strings[i] + rawValue.query + strings[i + 1]);
            }
            i -= 1;
            continue;
        }
        if (rawValue === undefined) {
            query += strings[i + 1];
            continue;
        }
        if (isAqlLiteral(rawValue)) {
            query += `${rawValue.toAQL()}${strings[i + 1]}`;
            continue;
        }
        const index = bindVals.indexOf(rawValue);
        const isKnown = index !== -1;
        let name = `value${isKnown ? index : bindVals.length}`;
        if (collection_1.isArangoCollection(rawValue)) {
            name = `@${name}`;
            value = rawValue.name;
        }
        if (!isKnown) {
            bindVals.push(rawValue);
            bindVars[name] = value;
        }
        query += `@${name}${strings[i + 1]}`;
    }
    return {
        query,
        bindVars,
        _source: () => ({ strings, args })
    };
}
exports.aql = aql;
(function (aql) {
    aql.literal = (value) => {
        if (isAqlLiteral(value)) {
            return value;
        }
        return {
            toAQL() {
                if (value === undefined) {
                    return "";
                }
                return String(value);
            }
        };
    };
    aql.join = (values, sep = " ") => {
        if (!values.length) {
            return aql ``;
        }
        if (values.length === 1) {
            return aql `${values[0]}`;
        }
        return aql(["", ...Array(values.length - 1).fill(sep), ""], ...values);
    };
})(aql = exports.aql || (exports.aql = {}));
//# sourceMappingURL=aql-query.js.map