import EventBus from './EventBus';
export interface I18nConfig {
    types: {
        resources: Object;
    }[];
    defaultType: string;
    fallback?: I18n[] | Object;
}
export default class I18n {
    static instances: any[];
    static language: any;
    static eventBus: EventBus;
    /**
     * [template 简易字符串模板函数]
     * e.g: template('hello {{name}}', { name: 'CJY' }) ==> 'hello CJY'
     * @param  {[字符串]} str  [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    static template: (str: string, data: any) => string;
    static load: (...loaders: any[]) => import("./memoize").CachedFunction;
    static applyLanguage: (language: any) => Promise<void>;
    resources: {};
    language: any;
    eventBus: EventBus;
    config: I18nConfig;
    constructor(config: I18nConfig);
    applyLanguage: (language: any) => Promise<void>;
    translate: (str: any, options?: {}) => any;
    fallbackTranslate: (str: any, options: any, namespace: any) => any;
    t: (str: any, options?: {}) => any;
}
