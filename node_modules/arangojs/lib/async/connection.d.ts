import { ArangojsResponse } from "./util/request";
export declare type LoadBalancingStrategy = "NONE" | "ROUND_ROBIN" | "ONE_RANDOM";
export declare type RequestOptions = {
    host?: number;
    method?: string;
    body?: any;
    expectBinary?: boolean;
    isBinary?: boolean;
    allowDirtyRead?: boolean;
    headers?: {
        [key: string]: string;
    };
    timeout?: number;
    absolutePath?: boolean;
    basePath?: string;
    path?: string;
    qs?: string | {
        [key: string]: any;
    };
};
export declare type Config = string | string[] | Partial<{
    url: string | string[];
    isAbsolute: boolean;
    arangoVersion: number;
    loadBalancingStrategy: LoadBalancingStrategy;
    maxRetries: false | number;
    agent: any;
    agentOptions: {
        [key: string]: any;
    };
    headers: {
        [key: string]: string;
    };
}>;
export declare class Connection {
    private _activeTasks;
    private _agent?;
    private _agentOptions;
    private _arangoVersion;
    private _databaseName;
    private _headers;
    private _loadBalancingStrategy;
    private _useFailOver;
    private _shouldRetry;
    private _maxRetries;
    private _maxTasks;
    private _queue;
    private _hosts;
    private _urls;
    private _activeHost;
    private _activeDirtyHost;
    constructor(config?: Config);
    private readonly _databasePath;
    private _runQueue;
    private _buildUrl;
    addToHostList(urls: string | string[]): number[];
    readonly arangoMajor: number;
    getDatabaseName(): string | false;
    getActiveHost(): number;
    setDatabaseName(databaseName: string): void;
    setHeader(key: string, value: string): void;
    close(): void;
    request<T = ArangojsResponse>({ host, method, body, expectBinary, isBinary, allowDirtyRead, timeout, headers, ...urlInfo }: RequestOptions, getter?: (res: ArangojsResponse) => T): Promise<T>;
}
//# sourceMappingURL=connection.d.ts.map