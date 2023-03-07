declare const curry: <T>(fn: Function) => (...args: any[]) => T;
export default curry;
