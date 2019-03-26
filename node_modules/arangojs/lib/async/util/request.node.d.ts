/// <reference types="node" />
import { ClientRequest, IncomingMessage } from "http";
import { Url } from "url";
import { Errback } from "./types";
export declare type ArangojsResponse = IncomingMessage & {
    request: ClientRequest;
    body?: any;
    host?: number;
};
export declare type ArangojsError = Error & {
    request: ClientRequest;
};
export interface RequestOptions {
    method: string;
    url: Url;
    headers: {
        [key: string]: string;
    };
    body: any;
    expectBinary: boolean;
    timeout?: number;
}
export interface RequestFunction {
    (opts: RequestOptions, cb: Errback<ArangojsResponse>): void;
    close?: () => void;
}
export declare const isBrowser = false;
export declare function createRequest(baseUrl: string, agentOptions: any, agent: any): RequestFunction;
//# sourceMappingURL=request.node.d.ts.map