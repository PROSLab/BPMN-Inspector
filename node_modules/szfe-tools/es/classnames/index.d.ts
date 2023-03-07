declare function classnames(...args: any[]): string;
declare namespace classnames {
    var bind: (mapper?: ClassNameMapper) => (...args: any[]) => string;
}
export default classnames;
interface ClassNameMapper {
    [key: string]: string;
}
