export declare const counterStore: {
    count: number;
    first_name: string;
    last_name: string;
} & {
    doubleCount: number;
    full_name: string;
} & {
    actions: {
        inc(): void;
        asyncInc(): Promise<void>;
        dec(): void;
        incBy(num: number): void;
        decBy(num: number): void;
        rename(first_name: string, last_name: string): void;
    };
    $underive: (keys: ("doubleCount" | "full_name")[]) => void;
    $invalidate: (keys: ("doubleCount" | "full_name")[]) => void;
    $onAction: (subscriber: (context: {
        name: string;
        store: any;
        args: any[];
        after: (callback: (result: any) => void) => void;
        onError: (callback: (error: any) => void) => void;
    }) => void) => () => void;
};
export declare const inc: () => void, asyncInc: () => Promise<void>, dec: () => void, incBy: (num: number) => void, decBy: (num: number) => void, rename: (first_name: string, last_name: string) => void;
