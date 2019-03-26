/// <reference types="node" />
export declare type Fields = {
    [key: string]: any;
};
export declare type MultipartRequest = {
    headers?: {
        [key: string]: string;
    };
    body: Buffer | FormData;
};
export declare function toForm(fields: Fields): Promise<MultipartRequest>;
//# sourceMappingURL=multipart.d.ts.map