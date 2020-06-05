# Farewell ImmutableJS

![](https://github.com/quintoandar/farewell-immutablejs/workflows/Node.js%20CI/badge.svg)
![](https://github.com/quintoandar/farewell-immutablejs/workflows/Node.js%20Package/badge.svg)

Codemods to migrate [Immutable.js](https://github.com/immutable-js/immutable-js) to ES6.

Never heard of codemods? Here is a quick summary from [facebook/codemod](https://github.com/facebook/codemod):

> codemod is a tool/library to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention.

## How to use

```bash
# installing globally
npm install -g @quintoandar/farewell-immutablejs
@quintoandar/farewell-immutablejs

# or using npx
npx @quintoandar/farewell-immutablejs
```

Use the `--help` flag or refer to the [help file](./src/bin/help.txt).

## Features

### Drop immutable import

```diff
- import { fromJS } from 'immutable';
```

### Remove .fromJS()

```diff
- const a = fromJS({ value: 1 });
+ const a = { value: 1 };
```

### Remove .toJS()

```diff
- const js = state.toJS();
+ const js = state;
```

### Replace .get()

```diff
// without default value
- const a = state.get('value');
+ const a = state?.value;

// with default value
- const a = state.get('value', 10);
+ const a = state?.value ?? 10;

// recursive gets are ignored
// for cases like this, run twice
{
- value: state.get('a').get('b'),
+ value: state.get('a')?.b,
}
```

### Replace .getIn()

```diff
// without default value
- const a = state.getIn(['b', 'c']);
+ const a = state?.b?.c;

// with default value
- const a = state.getIn(['b', 'c'], 10);
+ const a = state?.b?.c ?? 10;
```

### Replace .set()

```diff
// with a literal key
- state.set('a', 10);
+ state.a = 10;
```

```diff
// with a variable key
- state.set(key, 10);
+ state[key] = 10;
```

### Replace .setIn()

```diff
- state.setIn(['a', 'b', c, 'd'], 10);
+ state.a.b.c.d = 10;
```

### Replace .merge()

```diff
- const newState = state.merge({ a: 10 });
+ const newState = { ...state, a: 10 };
```

## Unsupported methods

The methods below have either small cost-benefit to implement a codemod or are too difficult to implement given name collisions.

- contains
- includes
- some
- find
- withMutations
- removeIn
- sortBy
- remove
- first
- last
- add
- mergeIn
- mergeDeep
- update
- updateIn
- map
- filter
- reduce
