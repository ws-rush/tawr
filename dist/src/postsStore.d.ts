export declare const postsStore: {
    userId: number;
} & {
    posts: Promise<any>;
} & {
    $state: {
        userId: number;
    };
    actions: {
        setUserId(userId: number): void;
    };
};
