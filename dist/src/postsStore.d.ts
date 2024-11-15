export declare const postsStore: {
    userId: null;
} & {
    posts: Promise<any>;
} & {
    actions: {
        setUserId(userId: any): void;
    };
    $underive: (keys: "posts"[]) => void;
    $invalidate: (keys: "posts"[]) => void;
    $onAction: (subscriber: (context: {
        name: string;
        store: any;
        args: any[];
        after: (callback: (result: any) => void) => void;
        onError: (callback: (error: any) => void) => void;
    }) => void) => () => void;
};
