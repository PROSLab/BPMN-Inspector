declare const loader: {
    show: ({ id }?: {
        id?: string | undefined;
    }) => void;
    hide: ({ id }?: {
        id?: string | undefined;
    }) => void;
};
export default loader;
