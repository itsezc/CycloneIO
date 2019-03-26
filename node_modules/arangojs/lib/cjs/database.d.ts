/// <reference types="node" />
import { AqlLiteral, AqlQuery } from "./aql-query";
import { ArangoCollection, DocumentCollection, EdgeCollection } from "./collection";
import { Config } from "./connection";
import { ArrayCursor } from "./cursor";
import { Graph } from "./graph";
import { Route } from "./route";
import { ArangoSearchView, ArangoView, ViewType } from "./view";
export declare type TransactionCollections = string | ArangoCollection | (string | ArangoCollection)[] | {
    write?: string | ArangoCollection | (string | ArangoCollection)[];
    read?: string | ArangoCollection | (string | ArangoCollection)[];
};
export declare type TransactionOptions = {
    lockTimeout?: number;
    maxTransactionSize?: number;
    intermediateCommitCount?: number;
    intermediateCommitSize?: number;
    waitForSync?: boolean;
};
export declare type ServiceOptions = {
    [key: string]: any;
    configuration?: {
        [key: string]: any;
    };
    dependencies?: {
        [key: string]: any;
    };
};
export declare type QueryOptions = {
    allowDirtyRead?: boolean;
    count?: boolean;
    batchSize?: number;
    cache?: boolean;
    memoryLimit?: number;
    ttl?: number;
    timeout?: number;
    options?: {
        failOnWarning?: boolean;
        profile?: boolean;
        maxTransactionSize?: number;
        stream?: boolean;
        skipInaccessibleCollections?: boolean;
        maxWarningsCount?: number;
        intermediateCommitCount?: number;
        satteliteSyncWait?: number;
        fullCount?: boolean;
        intermediateCommitSize?: number;
        optimizer?: {
            rules?: string[];
        };
        maxPlans?: number;
    };
};
export declare type ExplainOptions = {
    optimizer?: {
        rules?: string[];
    };
    maxNumberOfPlans?: number;
    allPlans?: boolean;
};
export declare type ExplainPlan = {
    nodes: any[];
    rules: any[];
    collections: any[];
    variables: any[];
    estimatedCost: number;
    estimatedNrItems: number;
    initialize: boolean;
    isModificationQuery: boolean;
};
export declare type ExplainResult = {
    plan?: ExplainPlan;
    plans?: Array<ExplainPlan>;
    cacheable: boolean;
    warnings: any[];
    stats: {
        rulesExecuted: number;
        rulesSkipped: number;
        plansCreated: number;
    };
};
export declare type ParseResult = {
    parsed: boolean;
    collections: any[];
    bindVars: any[];
    ast: any[];
};
export declare type QueryTracking = {
    enabled: boolean;
    maxQueryStringLength: number;
    maxSlowQueries: number;
    slowQueryThreshold: number;
    trackBindVars: boolean;
    trackSlowQueries: boolean;
};
export declare type QueryTrackingOptions = {
    enabled?: boolean;
    maxQueryStringLength?: number;
    maxSlowQueries?: number;
    slowQueryThreshold?: number;
    trackBindVars?: boolean;
    trackSlowQueries?: boolean;
};
export declare type RunningQuery = {
    id: string;
    query: string;
    bindVars: any;
    runTime: number;
    started: string;
    state: string;
    stream: boolean;
};
export interface ViewDescription {
    id: string;
    name: string;
    type: ViewType;
}
export interface CreateDatabaseUser {
    username: string;
    passwd?: string;
    active?: boolean;
    extra?: {
        [key: string]: any;
    };
}
export declare class Database {
    private _connection;
    constructor(config?: Config);
    readonly name: string | null;
    route(path?: string, headers?: Object): Route;
    acquireHostList(): Promise<void>;
    close(): void;
    useDatabase(databaseName: string): this;
    useBearerAuth(token: string): this;
    useBasicAuth(username?: string, password?: string): this;
    get(): Promise<any>;
    exists(): Promise<boolean>;
    createDatabase(databaseName: string, users?: CreateDatabaseUser[]): Promise<any>;
    listDatabases(): Promise<any>;
    listUserDatabases(): Promise<any>;
    dropDatabase(databaseName: string): Promise<any>;
    collection(collectionName: string): DocumentCollection;
    edgeCollection(collectionName: string): EdgeCollection;
    listCollections(excludeSystem?: boolean): Promise<any>;
    collections(excludeSystem?: boolean): Promise<ArangoCollection[]>;
    truncate(excludeSystem?: boolean): Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
    arangoSearchView(viewName: string): ArangoSearchView;
    listViews(): Promise<ViewDescription[]>;
    views(): Promise<ArangoView[]>;
    graph(graphName: string): Graph;
    listGraphs(): Promise<any>;
    graphs(): Promise<Graph[]>;
    transaction(collections: TransactionCollections, action: string): Promise<any>;
    transaction(collections: TransactionCollections, action: string, params?: Object): Promise<any>;
    transaction(collections: TransactionCollections, action: string, params?: Object, options?: TransactionOptions): Promise<any>;
    transaction(collections: TransactionCollections, action: string, lockTimeout?: number): Promise<any>;
    transaction(collections: TransactionCollections, action: string, params?: Object, lockTimeout?: number): Promise<any>;
    query(query: string | AqlQuery | AqlLiteral): Promise<ArrayCursor>;
    query(query: AqlQuery, opts?: QueryOptions): Promise<ArrayCursor>;
    query(query: string | AqlLiteral, bindVars?: any, opts?: QueryOptions): Promise<ArrayCursor>;
    explain(query: string | AqlQuery | AqlLiteral): Promise<ExplainResult>;
    explain(query: AqlQuery, opts?: ExplainOptions): Promise<ExplainResult>;
    explain(query: string | AqlLiteral, bindVars?: any, opts?: ExplainOptions): Promise<ExplainResult>;
    parse(query: string | AqlQuery | AqlLiteral): Promise<ParseResult>;
    parse(query: AqlQuery): Promise<ParseResult>;
    parse(query: string | AqlLiteral): Promise<ParseResult>;
    queryTracking(): Promise<QueryTracking>;
    setQueryTracking(opts?: QueryTrackingOptions): Promise<QueryTracking>;
    listRunningQueries(): Promise<Array<RunningQuery>>;
    listSlowQueries(): Promise<any>;
    clearSlowQueries(): Promise<void>;
    killQuery(queryId: string): Promise<void>;
    listFunctions(): Promise<any>;
    createFunction(name: string, code: string): Promise<any>;
    dropFunction(name: string, group?: boolean): Promise<any>;
    listServices(): Promise<any>;
    installService(mount: string, source: any, opts?: ServiceOptions): Promise<any>;
    upgradeService(mount: string, source: any, opts?: ServiceOptions): Promise<any>;
    replaceService(mount: string, source: any, opts?: ServiceOptions): Promise<any>;
    uninstallService(mount: string, opts?: any): Promise<void>;
    getService(mount: string): Promise<any>;
    getServiceConfiguration(mount: string, minimal?: boolean): Promise<any>;
    updateServiceConfiguration(mount: string, cfg: any, minimal?: boolean): Promise<any>;
    replaceServiceConfiguration(mount: string, cfg: any, minimal?: boolean): Promise<any>;
    getServiceDependencies(mount: string, minimal?: boolean): Promise<any>;
    updateServiceDependencies(mount: string, cfg: any, minimal?: boolean): Promise<any>;
    replaceServiceDependencies(mount: string, cfg: {
        [key: string]: string;
    }, minimal?: boolean): Promise<any>;
    enableServiceDevelopmentMode(mount: string): Promise<any>;
    disableServiceDevelopmentMode(mount: string): Promise<any>;
    listServiceScripts(mount: string): Promise<any>;
    runServiceScript(mount: string, name: string, args: any): Promise<any>;
    runServiceTests(mount: string, opts: any): Promise<any>;
    getServiceReadme(mount: string): Promise<string | undefined>;
    getServiceDocumentation(mount: string): Promise<any>;
    downloadService(mount: string): Promise<Buffer | Blob>;
    commitLocalServiceState(replace?: boolean): Promise<void>;
    version(): Promise<any>;
    login(username?: string, password?: string): Promise<string>;
}
//# sourceMappingURL=database.d.ts.map