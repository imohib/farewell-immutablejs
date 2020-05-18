export const initialState = {
  numberOfListingsViewed: 0,
};
export const selectRemoteConfigs = (state) => selectMetaData(state).get('remoteConfigs', {});
