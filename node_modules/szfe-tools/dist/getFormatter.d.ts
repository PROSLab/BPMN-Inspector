declare const getFormatter: ({ separator, length, reverse, isNumber: isNumberFormat, }?: {
    separator?: string;
    length?: number;
    reverse?: boolean;
    isNumber?: boolean;
}) => (text: any) => string;
export default getFormatter;
