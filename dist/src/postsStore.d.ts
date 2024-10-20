export declare const postsStore: {
    userId: null;
} & {
    posts: Promise<any>;
} & {
    setUserId(this: {
        userId: null;
    }, userId: any): void;
} & import('../lib').GettersControl<(state: {
    userId: null;
}) => {
    posts: (get: <T extends object>(proxyObject: T) => T) => Promise<any>;
}>;
