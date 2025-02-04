## TODO

- Edit API as `useSnapshot(store, options: { value: {}, strategy: 'merge' | 'replace', reset: boolean })`with `$reset` API
- Add query part with caching (take in mind stop getters and queries if not mounted or in another scenarios)
- Add documentation
- Support global tawr instance like pinia
- Support plugins with add later: `useStore.$onAction`
- Support optimistic updates
- Add `.$asyncAction.inc.{status, isError, isPending}` for async actions
- Study HoC as alternative for `useSnapshot` hook