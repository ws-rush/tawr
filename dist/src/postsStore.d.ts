export declare const postsStore: {
    userId: null;
} & {
    posts: Promise<any>;
} & {
    setUserId(userId: any): void;
} & {
    $underive: (keys: "posts"[]) => void;
    $invalidate: (keys: "posts"[]) => void;
};
