# Removing ImmutableJS

## But why?

[Redux documentation](https://redux.js.org/recipes/using-immutablejs-with-redux) offers a comprehensive explanation of pros and cons of using ImmutableJS. The following is a more personalized pro and con list that takes QuintoAndar’s projects into account.

### Pros

- Guarantee of immutability on runtime
- Functional interface supporting complex operations
- Good documentation

### Cons

- Large bundle size ([61kb minified](https://bundlephobia.com/result?p=immutable@4.0.0-rc.4))
- Bad performance on commonly used methods ([see this Github from leandrotk](https://github.com/leandrotk/javascript-immutable-data-benchmarks))
- Inefficient tree-shaking support
- We don’t really benefit from its structural sharing ([see this codesandbox to understand why](https://codesandbox.io/s/immutablejs-structural-sharing-4glih?file=/index.test.js))
- In most apps we keep components with pure JS data structures because the ideal usage makes Immutable highly coupled with the application
- Low traceability of what data structure is vanilla and what is Immutable
- Steep ramp-up vs vanilla JS
- Lacking support from the community (last release on 2018)

## How to remove it

To reduce the amount of repeated work, install the [farewell-immutablejs](https://github.com/quintoandar/farewell-immutablejs) package. It contains codemods that perform static changes. In the repo there is a list of what it can and can’t do. Use it as an additional guide.
Note that it is not a silver bullet so please check every change.

### Remove redux-immutable

In case the project is using the [redux-immutable](https://github.com/gajus/redux-immutable) package, it should be the first change to be made.

#### Remove it from package.json

```bash
npm remove redux-immutable
```

This first change is about removing the Immutable dependency from the global store object.

Replace the `combineReducer` from `redux-immutable` to the `redux` one:

```diff
- import { combineReducers } from 'redux-immutable`;
+ import { combineReducers } from 'redux';

const appReducer = combineReducers({
  user: userReducer,
  // ... more reducers
  ...asyncReducers,
});
```

In case the project has SSR, the hydration may not work with the `combineReducer` from `redux`. (see [redux#2058](https://github.com/reduxjs/redux/issues/2058) and [redux#2427](https://github.com/reduxjs/redux/issues/2427#issuecomment-304499200)). For this case, use `redux-immer`:

```diff
- import { combineReducers } from 'redux-immutable`;
+ import produce from 'immer';
+ import { combineReducers } from 'redux-immer';

- const appReducer = combineReducers({
+ const appReducer = combineReducers(produce, {
  user: userReducer,
  // ... more reducers
  ...asyncReducers,
});
```

#### Refactor root node selectors

The second change is about refactoring all the root selectors from the store.

```jsx
// With Immutable, the global store object is represented by:
store = fromJS({
  user: fromJS({ // note that the fromJS here is because we initialize the reducer states with `fromJS`
    name: '',
  }),
})
// And its associated selectors would be:
const selectUser = (state) => state.get('user')

// After performing the combineReducers change, the store object becomes:
store = {
  user: fromJS({}),
}
// Then it is **required** to change the root selector to:
const selectUser = (state) => state.user
```

Note 1: Nested selectors are left unchanged in this first refactor because the reducer state is initialized with `fromJS`:


```diff
- const selectUser = (state) => state.get('user')
+ const selectUser = (state) => state.user

# Left unchanged
const selectUserName = (state) => selectUser(state).get('name');
```

Note 2: In case the root selector isn’t encapsulated throughout the application, search for nested set methods (*setIn*, *updateIn*, *mergeIn*, *removeIn*, *mergeDeep*) outside the reducer context.
```diff
- const aRandomSelectorOutsideTheUserSelector = store.getState().getIn(['user', 'name']);
+ const aRandomSelectorOutsideTheUserSelector = store.getState().user.get('name');

# or even better
- const aRandomSelectorOutsideTheUserSelector = store.getState().getIn(['user', 'name']);
+ const aRandomSelectorOutsideTheUserSelector = selectUserName(store.getState());
```

Note 3: Expect tests to break after this change. Usually the store is mocked with an Immutable object. Use the *nestFromJS* codemod on the test files to change the store object.

```diff
# Selector tests pass the global store as an argument, so we need to descend the fromJS a level:

- expect(selectUserName(fromJS({ user: { name: 'Brandão' } }))).toEqual('Brandão');
+ expect(selectUserName({ user: fromJS({ name: 'Brandão' }) })).toEqual('Brandão');
```

### Introduce Immer

Quoting [Immer docs](https://immerjs.github.io/immer/docs/introduction):
> Immer (German for: always) is a tiny package that allows you to work with immutable state in a more convenient way. It is based on the copy-on-write mechanism.

#### Why

Removing Immutable would create two problems:

1. Possibility of mutating state
2. ES6 pattern for immutability doesn’t provide structural sharing and that would hurt performance

Immer helps us to solve both potential problems by:

1. Providing an immutable data structure
2. Taking care of structural sharing while supporting vanilla JS ([see this codesandox](https://codesandbox.io/s/immer-structural-sharing-lpbs2?file=/index.test.js))

Typing the state with TypeScript would also prevent state mutability. Immer doesn't get in the way of adopting TypeScript and even helps the migration as it supports mutating readonly interfaces ([check the TypeScript section on Immer](https://immerjs.github.io/immer/docs/typescript)).

### Remove Immutable for each container

For each container folder, follow these steps.

#### Wrap the reducer with Immer producer

```diff
+ import producer from 'immer';

- function reducer(state = initialState, action) {
+ function reducer(draft, action) {
  // ...
}

- export default reducer;
+ export default producer(reducer, initialState);
```

Note that the initial state should be declared as the second argument on producer.
Also changing the `state` argument to `draft` is a good practice.

#### Drop immutable imports using the codemod

```diff
- import { fromJS } from 'immutable';
```

#### Remove fromJS calls and toJS calls using the codemod

```diff
- const a = fromJS({ value: 1 });
+ const a = { value: 1 };

- const js = state.toJS();
+ const js = state;
```

#### Replace get and getIn calls using the codemod

```diff
- const a = state.get('value', 10);
+ const a = state?.value ?? 10;
```

```diff
- const a = state.getIn(['b', 'c'], 10);
+ const a = state?.b?.c ?? 10;
```

#### Replace set, setIn and merge

They can be replaced using codemods but require some maintenance after it.
Sometimes, with nested structures, it is easier to change the implementation from the spread operator to use a more imperative approach:

```diff
- function reducer(state = initialState, action) {
+ function reducer(draft, action) {
  // ...
  case SET_USER_NAME:
-    return state.setIn(['user', 'name'], action.username);
+    draft.user.name = action.username;
+    return draft;
  // ...
}
```

#### Use the unsupported methods reference as a guide

Refer to the [Unsupported methods](https://github.com/quintoandar/farewell-immutablejs#unsupported-methods) section and search the methods listed there to manually refactor them.
