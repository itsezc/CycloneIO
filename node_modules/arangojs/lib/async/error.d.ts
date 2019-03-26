import ExtendableError from "./util/error";
export declare function isArangoError(err: any): err is ArangoError;
export declare class ArangoError extends ExtendableError {
    name: string;
    isArangoError: boolean;
    errorNum: number;
    code: number;
    statusCode: number;
    response: any;
    constructor(response: any);
}
export declare class HttpError extends ExtendableError {
    name: string;
    response: any;
    code: number;
    statusCode: number;
    constructor(response: any);
}
//# sourceMappingURL=error.d.ts.map