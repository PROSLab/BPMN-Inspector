declare const getExternals: (src: string, externals?: string | string[]) => any[] | ((value: string, index: number, array: string[]) => any);
export default getExternals;
