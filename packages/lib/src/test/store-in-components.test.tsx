import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { defineStore } from '../store';
import React, { useEffect } from 'react';

describe('Store in Components', () => {
  describe('Basic Store Usage', () => {
    const [useCounterStore, store] = defineStore({
      state: () => ({ count: 0 }),
      getters: {
        doubled: (store) => store.count * 2
      },
      actions: {
        increment() {
          this.count++;
        }
      }
    });

    const Counter = () => {
      const snapshot = useCounterStore();
      return (
        <div>
          <span data-testid="count">Count: {snapshot.count}</span>
          <span data-testid="doubled">Doubled: {snapshot.doubled}</span>
        </div>
      );
    };

    it('renders initial state', () => {
      render(<Counter />);
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
      expect(screen.getByTestId('doubled')).toHaveTextContent('Doubled: 0');
    });

    it('updates when store changes directly', () => {
      render(<Counter />);
      act(() => {
        store.count = 5;
      });
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 5');
      expect(screen.getByTestId('doubled')).toHaveTextContent('Doubled: 10');
    });
  });

  describe('Store Underive and Invalidate', () => {
    const [useCalcStore, store] = defineStore({
      state: () => ({ base: 1 }),
      getters: {
        doubled: (store) => store.base * 2,
        quadrupled: (store) => store.doubled * 2,
        octupled: (store) => store.quadrupled * 2
      }
    });

    const Calculator = () => {
      const snapshot = useCalcStore();
      return (
        <div>
          <span data-testid="base">Base: {snapshot.base}</span>
          <span data-testid="doubled">Doubled: {snapshot.doubled}</span>
          <span data-testid="quadrupled">Quadrupled: {snapshot.quadrupled}</span>
          <span data-testid="octupled">Octupled: {snapshot.octupled}</span>
        </div>
      );
    };

    it('handles underive in components', () => {
      render(<Calculator />);
      
      // Initial values
      expect(screen.getByTestId('base')).toHaveTextContent('Base: 1');
      expect(screen.getByTestId('doubled')).toHaveTextContent('Doubled: 2');
      expect(screen.getByTestId('quadrupled')).toHaveTextContent('Quadrupled: 4');
      expect(screen.getByTestId('octupled')).toHaveTextContent('Octupled: 8');

      // Underive doubled and quadrupled
      act(() => {
        store.$underive(['doubled', 'quadrupled']);
        store.base = 2;
      });

      // doubled and quadrupled should keep old values, octupled should use underived values
      expect(screen.getByTestId('base')).toHaveTextContent('Base: 2');
      expect(screen.getByTestId('doubled')).toHaveTextContent('Doubled: 2');
      expect(screen.getByTestId('quadrupled')).toHaveTextContent('Quadrupled: 4');
      expect(screen.getByTestId('octupled')).toHaveTextContent('Octupled: 8');
    });

    it('handles invalidate after underive in components', () => {
      // Reset store state and render
      store.base = 1;
      render(<Calculator />);

      // Initial values should be base=1
      expect(screen.getByTestId('base')).toHaveTextContent('Base: 1');
      expect(screen.getByTestId('doubled')).toHaveTextContent('Doubled: 2');
      expect(screen.getByTestId('quadrupled')).toHaveTextContent('Quadrupled: 4');
      expect(screen.getByTestId('octupled')).toHaveTextContent('Octupled: 8');

      // Perform all operations in one act
      act(() => {
        store.$underive(['doubled', 'quadrupled']);
        store.base = 2;
        store.$invalidate(['doubled', 'quadrupled']);
      });

      // Verify final state after all operations
      expect(screen.getByTestId('base')).toHaveTextContent('Base: 2');
      expect(screen.getByTestId('doubled')).toHaveTextContent('Doubled: 4');
      expect(screen.getByTestId('quadrupled')).toHaveTextContent('Quadrupled: 8');
    });

    it('handles partial getter chain underive in components', () => {
      render(<Calculator />);

      act(() => {
        store.base = 1;
        store.$underive(['doubled']); // Only underive doubled
        store.base = 2;
      });

      expect(screen.getByTestId('base')).toHaveTextContent('Base: 2');
      expect(screen.getByTestId('doubled')).toHaveTextContent('Doubled: 2'); // Keeps old value
      expect(screen.getByTestId('quadrupled')).toHaveTextContent('Quadrupled: 4'); // Uses underived doubled
      expect(screen.getByTestId('octupled')).toHaveTextContent('Octupled: 8'); // Uses underived values
    });
  });

  describe('Multiple Components', () => {
    const [useSharedStore, store] = defineStore({
      state: () => ({ value: 'initial' }),
      actions: {
        setValue(newValue: string) {
          this.value = newValue;
        }
      }
    });

    const DisplayA = () => {
      const shared = useSharedStore();
      return <div data-testid="display-a">A: {shared.value}</div>;
    };

    const DisplayB = () => {
      const shared = useSharedStore();
      return <div data-testid="display-b">B: {shared.value}</div>;
    };

    const Controls = () => {
      return (
        <button 
          onClick={() => store.setValue('updated')}
          data-testid="update-button"
        >
          Update
        </button>
      );
    };

    it('syncs state across components', () => {
      render(
        <>
          <DisplayA />
          <DisplayB />
          <Controls />
        </>
      );

      expect(screen.getByTestId('display-a')).toHaveTextContent('A: initial');
      expect(screen.getByTestId('display-b')).toHaveTextContent('B: initial');

      fireEvent.click(screen.getByTestId('update-button'));

      expect(screen.getByTestId('display-a')).toHaveTextContent('A: updated');
      expect(screen.getByTestId('display-b')).toHaveTextContent('B: updated');
    });
  });

  describe('Store Actions in Components', () => {
    const [useActionStore, store] = defineStore({
      state: () => ({ count: 0 }),
      actions: {
        increment() {
          this.count++;
        },
        add(value: number) {
          this.count += value;
        }
      }
    });

    const ActionComponent = () => {
      const counter = useActionStore();
      return (
        <div>
          <span data-testid="count">Count: {counter.count}</span>
          <button 
            onClick={() => store.increment()}
            data-testid="increment"
          >
            Increment
          </button>
          <button 
            onClick={() => store.add(5)}
            data-testid="add-five"
          >
            Add 5
          </button>
        </div>
      );
    };

    it('handles actions correctly', () => {
      render(<ActionComponent />);
      
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
      
      fireEvent.click(screen.getByTestId('increment'));
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
      
      fireEvent.click(screen.getByTestId('add-five'));
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 6');
    });
  });

  describe('Snapshot Immutability', () => {
    const [useImmutableStore] = defineStore({
      state: () => ({ count: 0, nested: { value: 1 } })
    });

    const ImmutableComponent = () => {
      const immutable = useImmutableStore();
      return (
        <div>
          <button
            onClick={() => {
              immutable.count = 1;
              immutable.nested.value = 2;
            }}
            data-testid="mutate"
          >
            Try Mutate
          </button>
          <span data-testid="values">{immutable.count},{immutable.nested.value}</span>
        </div>
      );
    };

    it('prevents direct mutations of snapshot', () => {
      render(<ImmutableComponent />);
      
      expect(screen.getByTestId('values')).toHaveTextContent('0,1');
      
      fireEvent.click(screen.getByTestId('mutate'));
      // Values should remain unchanged since snapshot is immutable
      expect(screen.getByTestId('values')).toHaveTextContent('0,1');
    });
  });

  describe('Selective Re-rendering', () => {
    const [useSelectiveStore, store] = defineStore({
      state: () => ({ 
        count: 0,
        name: 'test'
      })
    });

    it('only re-renders components that access changed state', async () => {
      const CountWrapper = () => {
        const snapshot = useSelectiveStore();
        const renderCount = React.useRef(0);
        renderCount.current++;
        return (
          <div data-testid="count-wrapper">
            <div data-testid="count-renders">{renderCount.current}</div>
            <div>Count: {snapshot.count}</div>
          </div>
        );
      };

      const NameWrapper = () => {
        const snapshot = useSelectiveStore();
        const renderCount = React.useRef(0);
        renderCount.current++;
        return (
          <div data-testid="name-wrapper">
            <div data-testid="name-renders">{renderCount.current}</div>
            <div>Name: {snapshot.name}</div>
          </div>
        );
      };

      render(
        <>
          <CountWrapper />
          <NameWrapper />
        </>
      );

      // Initial render
      expect(screen.getByTestId('count-renders')).toHaveTextContent('1');
      expect(screen.getByTestId('name-renders')).toHaveTextContent('1');

      // Update count
      act(() => {
        store.count = 1;
      });
      expect(screen.getByTestId('count-renders')).toHaveTextContent('2');
      expect(screen.getByTestId('name-renders')).toHaveTextContent('1'); // Shouldn't re-render

      // Update name
      act(() => {
        store.name = 'updated';
      });
      expect(screen.getByTestId('count-renders')).toHaveTextContent('2'); // Shouldn't re-render
      expect(screen.getByTestId('name-renders')).toHaveTextContent('2');
    });
  });

  describe('Nested State', () => {
    const [useNestedStore, store] = defineStore({
      state: () => ({
        user: {
          profile: {
            name: 'John',
            settings: {
              theme: 'light',
              notifications: true
            }
          },
          stats: {
            visits: 0
          }
        }
      }),
      getters: {
        userTheme: (store) => store.user.profile.settings.theme,
        displayName: (store) => `User: ${store.user.profile.name}`
      },
      actions: {
        updateTheme(theme: string) {
          this.user.profile.settings.theme = theme;
        },
        incrementVisits() {
          this.user.stats.visits++;
        }
      }
    });

    const UserProfile = () => {
      const snapshot = useNestedStore();
      return (
        <div>
          <div data-testid="name">{snapshot.user.profile.name}</div>
          <div data-testid="theme">{snapshot.user.profile.settings.theme}</div>
          <div data-testid="visits">{snapshot.user.stats.visits}</div>
          <div data-testid="display-name">{snapshot.displayName}</div>
        </div>
      );
    };

    it('reads nested state correctly', () => {
      render(<UserProfile />);
      
      expect(screen.getByTestId('name')).toHaveTextContent('John');
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('visits')).toHaveTextContent('0');
      expect(screen.getByTestId('display-name')).toHaveTextContent('User: John');
    });

    it('updates nested state through direct mutation', () => {
      render(<UserProfile />);

      act(() => {
        store.user.profile.name = 'Jane';
        store.user.profile.settings.theme = 'dark';
      });

      expect(screen.getByTestId('name')).toHaveTextContent('Jane');
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('display-name')).toHaveTextContent('User: Jane');
    });

    it('updates nested state through actions', () => {
      render(<UserProfile />);

      act(() => {
        store.updateTheme('system');
        store.incrementVisits();
        store.incrementVisits();
      });

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('visits')).toHaveTextContent('2');
    });

    it('maintains reactivity for deeply nested updates', () => {
      const renderCounts = {
        name: 0,
        theme: 0,
        visits: 0
      };

      const NestedWrapper = () => {
        const snapshot = useNestedStore();

        useEffect(() => {
          ++renderCounts.name;
        }, [snapshot.user.profile.name]);

        useEffect(() => {
          ++renderCounts.theme;
        }, [snapshot.user.profile.settings.theme]);

        useEffect(() => {
          ++renderCounts.visits;
        }, [snapshot.user.stats.visits]);

        return (
          <div>
            <div>{snapshot.user.profile.name}</div>
            <div>{snapshot.user.profile.settings.theme}</div>
            <div>{snapshot.user.stats.visits}</div>
          </div>
        );
      };

      render(<NestedWrapper />);

      // Initial render
      expect(renderCounts.name).toBe(1);
      expect(renderCounts.theme).toBe(1);
      expect(renderCounts.visits).toBe(1);

      // Update nested name
      act(() => {
        store.user.profile.name = 'New Jane';
      });

      expect(renderCounts.name).toBe(2);
      expect(renderCounts.theme).toBe(1); // Unchanged
      expect(renderCounts.visits).toBe(1); // Unchanged

      // Update deeply nested theme
      act(() => {
        store.user.profile.settings.theme = 'dark';
      });
      expect(renderCounts.name).toBe(2); // Unchanged
      expect(renderCounts.theme).toBe(2);
      expect(renderCounts.visits).toBe(1); // Unchanged

      // Update nested visits through action
      act(() => {
        store.incrementVisits();
      });
      expect(renderCounts.name).toBe(2); // Unchanged
      expect(renderCounts.theme).toBe(2); // Unchanged
      expect(renderCounts.visits).toBe(2);
    });
  });

  describe('Dependent Getters in Components', () => {
    const [useDependentStore, store] = defineStore({
      state: () => ({ 
        firstName: 'John',
        lastName: 'Doe',
        age: 25
      }),
      getters: {
        fullName: (store) => `${store.firstName} ${store.lastName}`,
        displayName: (store) => `${store.fullName} (${store.age})`,
        greeting: (store) => `Hello, ${store.displayName}!`
      }
    });

    const GreetingDisplay = () => {
      const snapshot = useDependentStore();
      return (
        <div>
          <div data-testid="full-name">{snapshot.fullName}</div>
          <div data-testid="display-name">{snapshot.displayName}</div>
          <div data-testid="greeting">{snapshot.greeting}</div>
        </div>
      );
    };

    it('updates through getter dependency chain', () => {
      render(<GreetingDisplay />);
      
      // Initial values
      expect(screen.getByTestId('full-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('display-name')).toHaveTextContent('John Doe (25)');
      expect(screen.getByTestId('greeting')).toHaveTextContent('Hello, John Doe (25)!');

      // Update first name - should update all dependent getters
      act(() => {
        store.firstName = 'Jane';
      });
      expect(screen.getByTestId('full-name')).toHaveTextContent('Jane Doe');
      expect(screen.getByTestId('display-name')).toHaveTextContent('Jane Doe (25)');
      expect(screen.getByTestId('greeting')).toHaveTextContent('Hello, Jane Doe (25)!');

      // Update age - should only affect displayName and greeting
      act(() => {
        store.age = 30;
      });
      expect(screen.getByTestId('full-name')).toHaveTextContent('Jane Doe');
      expect(screen.getByTestId('display-name')).toHaveTextContent('Jane Doe (30)');
      expect(screen.getByTestId('greeting')).toHaveTextContent('Hello, Jane Doe (30)!');
    });

    it('handles selective updates in getter chain', async () => {
      // Reset store state
      act(() => {
        store.firstName = 'John';
        store.lastName = 'Doe';
        store.age = 25;
      });

      const renderCounts = {
        fullName: 0,
        displayName: 0,
        greeting: 0
      };

      const GreetingWrapper = () => {
        const snapshot = useDependentStore();

        useEffect(() => {
          renderCounts.fullName++;
        }, [snapshot.fullName]);

        useEffect(() => {
          renderCounts.displayName++;
        }, [snapshot.displayName]);

        useEffect(() => {
          renderCounts.greeting++;
        }, [snapshot.greeting]);

        return (
          <div>
            <div data-testid="full-name">{snapshot.fullName}</div>
            <div data-testid="display-name">{snapshot.displayName}</div>
            <div data-testid="greeting">{snapshot.greeting}</div>
          </div>
        );
      };

      render(<GreetingWrapper />);

      // Initial render
      expect(renderCounts.fullName).toBe(1);
      expect(renderCounts.displayName).toBe(1);
      expect(renderCounts.greeting).toBe(1);

      // Update lastName - should affect all getters
      act(() => {
        store.lastName = 'Smith';
      });

      expect(renderCounts.fullName).toBe(2);
      expect(renderCounts.displayName).toBe(2);
      expect(renderCounts.greeting).toBe(2);

      // Update age - should only affect displayName and greeting
      act(() => {
        store.age = 35;
      });

      expect(renderCounts.fullName).toBe(2); // No change
      expect(renderCounts.displayName).toBe(3);
      expect(renderCounts.greeting).toBe(3);
    });
  });
});
