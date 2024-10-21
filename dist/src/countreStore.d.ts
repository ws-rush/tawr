export declare const counterStore: {
    count: number;
    first_name: string;
    last_name: string;
} & {
    doubleCount: number;
    full_name: string;
} & {
    inc(): void;
    dec(): void;
    incBy(num: number): void;
    decBy(num: number): void;
    rename(first_name: string, last_name: string): void;
} & {
    $underive: (keys: ("doubleCount" | "full_name")[]) => void;
    $invalidate: (keys: ("doubleCount" | "full_name")[]) => void;
};
