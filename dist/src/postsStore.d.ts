export declare const postsStore: {
    userId: null;
} & {
    cachedPosts: any;
} & {
    actions: {
        setUserId: (userId: any) => void;
    };
    $underive: (keys: "cachedPosts"[]) => void;
    $invalidate: (keys: "cachedPosts"[]) => void;
    $onAction: (subscriber: (context: {
        name: string;
        store: any;
        args: any[];
        after: (callback: (result: any) => void) => void;
        onError: (callback: (error: any) => void) => void;
    }) => void) => () => void;
};
