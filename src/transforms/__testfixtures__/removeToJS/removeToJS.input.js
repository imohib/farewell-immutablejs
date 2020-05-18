export const member = () => createSelector(
  selectHouse, (state) => state.getIn(['markers']).toJS()
);