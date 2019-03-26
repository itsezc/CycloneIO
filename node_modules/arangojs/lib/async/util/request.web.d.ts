import { ArangojsResponse, RequestOptions } from "./request.node";
import { Errback } from "./types";
export declare const isBrowser = true;
export declare function createRequest(baseUrl: string, agentOptions: any): ({ method, url, headers, body, timeout, expectBinary }: RequestOptions, cb: Errback<ArangojsResponse>) => void;
//# sourceMappingURL=request.web.d.ts.map