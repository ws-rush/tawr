import { ReactNode } from 'react';
interface AwaitableProps<T> {
    resolve: Promise<T>;
    fallback?: ReactNode;
    error?: (error: Error) => ReactNode;
    children: (value: T) => ReactNode;
}
export declare function Awaitable<T>({ resolve, fallback, error, children, }: AwaitableProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
