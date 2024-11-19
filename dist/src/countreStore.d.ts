export declare const counterStore: {
    count: number;
    first_name: string;
    last_name: string;
} & {
    doubleCount: number;
    full_name: string;
} & {
    $state: {
        count: number;
        first_name: string;
        last_name: string;
    };
    actions: {
        inc(): void;
        asyncInc(): Promise<void>;
        dec(): void;
        incBy(num: number): void;
        decBy(num: number): void;
        rename(first_name: string, last_name: string): void;
    };
};
export declare const inc: () => void, asyncInc: () => Promise<void>, dec: () => void, incBy: (num: number) => void, decBy: (num: number) => void, rename: (first_name: string, last_name: string) => void;
