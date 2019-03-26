import { Connection } from "./connection";
export declare class ArrayCursor {
    extra: any;
    count: number;
    private _connection;
    private _result;
    private _hasMore;
    private _id;
    private _host?;
    private _allowDirtyRead?;
    constructor(connection: Connection, body: any, host?: number, allowDirtyRead?: boolean);
    private _drain;
    private _more;
    all(): Promise<any>;
    next(): Promise<any | undefined>;
    hasNext(): boolean;
    each(fn: (value: any, index: number, self: ArrayCursor) => boolean | void): Promise<boolean>;
    every(fn: (value: any, index: number, self: ArrayCursor) => boolean): Promise<boolean>;
    some(fn: (value: any, index: number, self: ArrayCursor) => boolean): Promise<boolean>;
    map<T>(fn: (value: any, index: number, self: ArrayCursor) => T): Promise<T[]>;
    reduce<T>(fn: (accu: T, value: any, index: number, self: ArrayCursor) => T, accu?: T): Promise<T | undefined>;
}
//# sourceMappingURL=cursor.d.ts.map