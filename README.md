# Farewell ImmutableJS

![](https://github.com/quintoandar/farewell-immutablejs/workflows/Node.js%20CI/badge.svg)
![](https://github.com/quintoandar/farewell-immutablejs/workflows/Node.js%20Package/badge.svg)

Codemods to migrate [Immutable.js](https://github.com/immutable-js/immutable-js) to ES6.

Check out the [migration guide](MIGRATION.md) for the motivations and step-by-step instructions.

Never heard of codemods? Here is a quick summary from [facebook/codemod](https://github.com/facebook/codemod):

> codemod is a tool/library to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention.

## How to use

```bash
# installing globally
npm install -g @quintoandar/farewell-immutablejs
farewell-immutablejs

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

### Add deprecation comment

Large codebases might be stuck in a "transitional period" for a considerable amount of time when removing Immutable.

If you have already started to remove it, but are worried about other developers using old code as example and adding the library to new features, 
consider adding these deprecation messages:

```diff
+ // ImmutableJS usage is deprecated
+ // Please, do not copy & paste or use this snippet as reference :)
+ // How to refactor? See https://guidelines.quintoandar.com.br/#/pwa/removing-immutable
import { fromJS } from 'immutable';
```

**Suggestion**: skip test files when running this codemod. 
Most likely, they will be refactored together with the corresponding application code, so it would just generate more clutter.

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

## Contributing

The codemod implementation is based on [jscodeshift](https://github.com/facebook/jscodeshift), so check out their API documentation.
