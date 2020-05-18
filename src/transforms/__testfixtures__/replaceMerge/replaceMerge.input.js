const newState = state.merge({
  a: true,
  b: [mockList],
});
const newState1 = resultingState.merge(fromJS({
  a: 10,
}));
const newState2 = prioritary.merge(nonPrioritary);
