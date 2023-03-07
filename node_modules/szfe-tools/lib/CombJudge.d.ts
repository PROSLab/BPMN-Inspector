interface Attr {
    [key: string]: any[];
}
export default class CombJubge {
    list: Object | any[];
    attr: Attr;
    attrKey: string[];
    constructor(list: Object | any[]);
    private have;
    adaptedAttr: (activeAttr: Object) => Object;
    find: (activeAttr: Object) => string | undefined;
}
export {};
