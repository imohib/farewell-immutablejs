const newState = {
  ...state,
  a: true,
  b: [mockList]
};
const newState1 = {
  ...resultingState,

  ...fromJS({
    a: 10,
  })
};
const newState2 = {
  ...prioritary,
  ...nonPrioritary
};
