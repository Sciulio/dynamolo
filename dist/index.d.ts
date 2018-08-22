export declare type tLogger = (...args: any[]) => void;
export declare type tArgsConfig = {
    rootPath: string;
    exportDefault: boolean;
    exporter?: <T>(module: any) => T;
    catchSingleExports: boolean;
    logInfo: tLogger;
    logError: tLogger;
};
export declare function load<T>(pattern: string, config?: tArgsConfig): any[];
export declare function load<T>(pattern: string, cback?: (def: T) => void, config?: tArgsConfig): void;
export declare function loadAsync<T>(pattern: string, _config?: tArgsConfig): Promise<{}>;
