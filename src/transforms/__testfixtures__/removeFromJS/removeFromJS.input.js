export const initialState = fromJS({
  numberOfListingsViewed: 0,
});
export const selectRemoteConfigs = (state) => selectMetaData(state).get('remoteConfigs', fromJS({}));
