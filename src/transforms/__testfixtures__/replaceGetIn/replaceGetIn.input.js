const arrowFunction = (state) => selectCondo(state).getIn(['a', 'b']);
const arrowFunctionWithDefault = (state) => selectCondo(state).getIn(['a', 'b'], Map());

function handleGetInAsVariable(state, action) {
  let shouldSuggest = state.getIn(['a', 'b']);
  return shouldSuggest;
}
function handleGetInAsVariableWithDefault(state, action) {
  let shouldSuggest = state.getIn(['a', 'b'], 'default');
  return shouldSuggest;
}

function handleGetInAsReturn(state, action) {
  return state.getIn(['a', 'b']);
}
function handleGetInAsReturnWithDefault(state, action) {
  return state.getIn(['a', 'b'], 'default');
}

const asProperty = (state) => ({
  propertyName: state.getIn(['a', 'b']),
});
const asPropertyWithDefault = (state) => ({
  propertyName: state.getIn(['a', 'b'], 'default'),
});

const superNested = (state) => ({
  propertyName: state.getIn(['a', 'b', 'c', 'd', 'e']),
});
const superNestedWithDefault = (state) => ({
  propertyName: state.getIn(['a', 'b', 'c', 'd', 'e'], 'default'),
});

const single = (state) => ({
  propertyName: state.getIn(['a']),
});
const singleWithDefault = (state) => ({
  propertyName: state.getIn(['a'], 'default'),
});

const argumentNested = (state, action) => ({
  propertyName: state.getIn(['a', 'b', action.c, 'd', 'e']),
});
const argumentNestedWithDefault = (state, action) => ({
  propertyName: state.getIn(['a', 'b', action.c, 'd', 'e'], 'default'),
});

const argumentNested1 = (state, action) => ({
  propertyName: state.getIn([action.c, 'd', 'e']),
});
const argumentNestedWithDefault1 = (state, action) => ({
  propertyName: state.getIn([action.c, 'd', 'e'], 'default'),
});

const argumentNested2 = (state, action) => ({
  propertyName: state.getIn(['a', 'b', action.c]),
});
const argumentNestedWithDefault2 = (state, action) => ({
  propertyName: state.getIn(['a', 'b', action.c], 'default'),
});