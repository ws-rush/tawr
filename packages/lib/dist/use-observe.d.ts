type ObservableValue<T> = T extends Array<infer U> ? U[] : T;
export declare function useObserve<T>(value: T): ObservableValue<T>;
export {};
