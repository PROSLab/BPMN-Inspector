declare const pipe: <T>(...handlers: Function[]) => (arg: any) => T;
export default pipe;
