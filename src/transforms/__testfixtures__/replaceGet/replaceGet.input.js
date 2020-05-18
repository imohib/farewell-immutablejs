export const selectOverlaySide = (state) => selectOverlay(state).get('side');
export const selectAlert = (state) => state.get('alert', fromJS({}));

export const makeSelectHomes = (id) => createSelector(
  selectHomesList,
  (homesList) => homesList.get(id).toJS()
);

const haveCondominiumPage = condoInfo && condoInfo.get('name');

const makeSelectHouseInfo = () => createSelector(
  selectHouseInfo, (houseInfo) => ({
    city: houseInfo.get('address').get('city'),
    isApartment: isApartment(info.get('type')),
  })
);