export const selectOverlaySide = (state) => selectOverlay(state)?.side;
export const selectAlert = (state) => state?.alert ?? fromJS({});

export const makeSelectHomes = (id) => createSelector(
  selectHomesList,
  (homesList) => homesList?.[id].toJS()
);

const haveCondominiumPage = condoInfo && condoInfo?.name;

const makeSelectHouseInfo = () => createSelector(
  selectHouseInfo, (houseInfo) => ({
    city: houseInfo.get('address')?.city,
    isApartment: isApartment(info?.type),
  })
);