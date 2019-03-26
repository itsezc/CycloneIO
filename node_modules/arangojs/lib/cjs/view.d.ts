import { Connection } from "./connection";
export declare enum ViewType {
    ARANGOSEARCH_VIEW = "arangosearch"
}
export interface ArangoView {
    isArangoView: true;
    name: string;
}
export interface ArangoViewResponse {
    name: string;
    id: string;
    type: ViewType;
}
interface ArangoSearchViewCollectionLink {
    analyzers?: string[];
    fields?: {
        [key: string]: ArangoSearchViewCollectionLink | undefined;
    };
    includeAllFields?: boolean;
    trackListPositions?: boolean;
    storeValues?: "none" | "id";
}
export interface ArangoSearchViewProperties {
    cleanupIntervalStep: number;
    consolidationIntervalMsec: number;
    writebufferIdle: number;
    writebufferActive: number;
    writebufferSizeMax: number;
    consolidationPolicy: {
        type: "bytes_accum" | "tier";
        threshold?: number;
        segments_min?: number;
        segments_max?: number;
        segments_bytes_max?: number;
        segments_bytes_floor?: number;
        lookahead?: number;
    };
    links: {
        [key: string]: ArangoSearchViewCollectionLink | undefined;
    };
}
export interface ArangoSearchViewPropertiesResponse extends ArangoViewResponse, ArangoSearchViewProperties {
    type: ViewType.ARANGOSEARCH_VIEW;
}
export interface ArangoSearchViewPropertiesOptions {
    cleanupIntervalStep?: number;
    consolidationIntervalMsec?: number;
    writebufferIdle?: number;
    writebufferActive?: number;
    writebufferSizeMax?: number;
    consolidationPolicy?: {
        type: "bytes_accum";
        threshold?: number;
    } | {
        type: "tier";
        lookahead?: number;
        segments_min?: number;
        segments_max?: number;
        segments_bytes_max?: number;
        segments_bytes_floor?: number;
    };
    links?: {
        [key: string]: ArangoSearchViewCollectionLink | undefined;
    };
}
export declare abstract class BaseView implements ArangoView {
    isArangoView: true;
    name: string;
    abstract type: ViewType;
    protected _connection: Connection;
    constructor(connection: Connection, name: string);
    get(): Promise<ArangoViewResponse>;
    exists(): Promise<boolean>;
    rename(name: string): Promise<any>;
    drop(): Promise<any>;
}
export declare class ArangoSearchView extends BaseView {
    type: ViewType;
    create(properties?: ArangoSearchViewPropertiesOptions): Promise<ArangoSearchViewPropertiesResponse>;
    properties(): Promise<ArangoSearchViewPropertiesResponse>;
    setProperties(properties?: ArangoSearchViewPropertiesOptions): Promise<ArangoSearchViewPropertiesResponse>;
    replaceProperties(properties?: ArangoSearchViewPropertiesOptions): Promise<ArangoSearchViewPropertiesResponse>;
}
export declare function constructView(connection: Connection, data: any): ArangoView;
export {};
//# sourceMappingURL=view.d.ts.map