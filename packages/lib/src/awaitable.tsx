import {
  ReactNode,
  Suspense,
  use,
  Component,
  ErrorInfo,
} from "react";

// Error Boundary Component
class ErrorBoundary extends Component<
  {
    fallback: (error: Error) => ReactNode;
    children: ReactNode;
  },
  {
    error: Error | null;
  }
> {
  constructor(props: {
    fallback: (error: Error) => ReactNode;
    children: ReactNode;
  }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error);
    }

    return this.props.children;
  }
}

// Content component that uses the promise
function AwaitableContent<T>({
  resolve,
  children,
}: Omit<AwaitableProps<T>, "fallback" | "error">) {
  const value = use(resolve);
  return <>{children(value)}</>;
}

interface AwaitableProps<T> {
  resolve: Promise<T>;
  fallback?: ReactNode;
  error?: (error: Error) => ReactNode;
  children: (value: T) => ReactNode;
}

// Main Awaitable component
export function Awaitable<T>({
  resolve,
  fallback = null,
  error = (err) => <div>Error: {err.message}</div>,
  children,
}: AwaitableProps<T>) {
  return (
    <ErrorBoundary fallback={error}>
      <Suspense fallback={fallback}>
        <AwaitableContent resolve={resolve} children={children} />
      </Suspense>
    </ErrorBoundary>
  );
}
