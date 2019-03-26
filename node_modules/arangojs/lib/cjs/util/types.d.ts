export declare type Errback<T> = (err: Error | null, result?: T) => void;
export declare type Patch<T> = {
    [K in keyof T]?: T[K] | Patch<T[K]>;
};
//# sourceMappingURL=types.d.ts.map