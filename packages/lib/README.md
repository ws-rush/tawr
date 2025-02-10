## TODO

- [ ] Edit API as `useSnapshot(store, options: { value: {}, strategy: 'merge' | 'replace', reset: boolean })`with `$reset` API
- [-] Add query part
    - [x] baisc functionality, queryFn with states { value, isLoading, isFetching, error }
    - [ ] support `retry`, `selected`, `enabled` props
    - [ ] cache options
    - [ ] initial data and placeholder
    - [ ] mount options
- [ ] Add documentation
- [ ] Support global tawr instance like pinia
- [ ] Support plugins with add later: `useStore.$onAction`
- [ ] Support optimistic updates
- [ ] Add `.$asyncAction.inc.{status, isError, isPending}` for async actions
- [ ] Study HoC as alternative for `useSnapshot` hook