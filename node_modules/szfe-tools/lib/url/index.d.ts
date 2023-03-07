export declare const paramEscape: (...args: any[]) => any;
export declare function param(name: string, url?: any, decode?: (value: any) => any): any;
export declare const allParamEscape: (...args: any[]) => {};
export declare function allParam(url?: any, decode?: (value: any) => any): {};
export declare function generateParamStr(paramObj: Object, encode?: Function): string;
declare const _default: {
    paramEscape: (...args: any[]) => any;
    param: typeof param;
    allParamEscape: (...args: any[]) => {};
    allParam: typeof allParam;
    generateParamStr: typeof generateParamStr;
};
export default _default;
