export declare const counterStore: {
    count: number;
    first_name: string;
    last_name: string;
} & {
    doubleCount: number;
    full_name: string;
} & {
    inc(this: {
        count: number;
        first_name: string;
        last_name: string;
    }): void;
    dec(this: {
        count: number;
        first_name: string;
        last_name: string;
    }): void;
    incBy(this: {
        count: number;
        first_name: string;
        last_name: string;
    }, num: number): void;
    decBy(this: {
        count: number;
        first_name: string;
        last_name: string;
    }, num: number): void;
    rename(this: {
        count: number;
        first_name: string;
        last_name: string;
    }, first_name: string, last_name: string): void;
};
