const arrowFunction = (state) => selectCondo(state)?.a?.b;
const arrowFunctionWithDefault = (state) => selectCondo(state)?.a?.b ?? Map();

function handleGetInAsVariable(state, action) {
  let shouldSuggest = state?.a?.b;
  return shouldSuggest;
}
function handleGetInAsVariableWithDefault(state, action) {
  let shouldSuggest = state?.a?.b ?? 'default';
  return shouldSuggest;
}

function handleGetInAsReturn(state, action) {
  return state?.a?.b;
}
function handleGetInAsReturnWithDefault(state, action) {
  return state?.a?.b ?? 'default';
}

const asProperty = (state) => ({
  propertyName: state?.a?.b,
});
const asPropertyWithDefault = (state) => ({
  propertyName: state?.a?.b ?? 'default',
});

const superNested = (state) => ({
  propertyName: state?.a?.b?.c?.d?.e,
});
const superNestedWithDefault = (state) => ({
  propertyName: state?.a?.b?.c?.d?.e ?? 'default',
});

const single = (state) => ({
  propertyName: state?.a,
});
const singleWithDefault = (state) => ({
  propertyName: state?.a ?? 'default',
});

const argumentNested = (state, action) => ({
  propertyName: state?.a?.b?.[action.c]?.d?.e,
});
const argumentNestedWithDefault = (state, action) => ({
  propertyName: state?.a?.b?.[action.c]?.d?.e ?? 'default',
});

const argumentNested1 = (state, action) => ({
  propertyName: state?.[action.c]?.d?.e,
});
const argumentNestedWithDefault1 = (state, action) => ({
  propertyName: state?.[action.c]?.d?.e ?? 'default',
});

const argumentNested2 = (state, action) => ({
  propertyName: state?.a?.b?.[action.c],
});
const argumentNestedWithDefault2 = (state, action) => ({
  propertyName: state?.a?.b?.[action.c] ?? 'default',
});