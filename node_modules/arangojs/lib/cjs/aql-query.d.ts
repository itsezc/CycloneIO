import { ArangoCollection } from "./collection";
export interface AqlQuery {
    query: string;
    bindVars: {
        [key: string]: any;
    };
}
export interface GeneratedAqlQuery extends AqlQuery {
    _source: () => {
        strings: string[];
        args: AqlValue[];
    };
}
export interface AqlLiteral {
    toAQL: () => string;
}
export declare type AqlValue = ArangoCollection | GeneratedAqlQuery | AqlLiteral | string | number | boolean | null | undefined | object | any[];
export declare function isAqlQuery(query: any): query is AqlQuery;
export declare function isGeneratedAqlQuery(query: any): query is GeneratedAqlQuery;
export declare function isAqlLiteral(literal: any): literal is AqlLiteral;
export declare function aql(templateStrings: TemplateStringsArray, ...args: AqlValue[]): GeneratedAqlQuery;
export declare namespace aql {
    const literal: (value: string | number | boolean | AqlLiteral | null | undefined) => AqlLiteral;
    const join: (values: AqlValue[], sep?: string) => GeneratedAqlQuery;
}
//# sourceMappingURL=aql-query.d.ts.map