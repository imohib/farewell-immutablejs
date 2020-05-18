a.setIn(['gallery', 'shown'], true);
state.setIn(['appData', 'cookies'], cookies);
prevState.setIn(['info', 'error'], true);
b.setIn(['listings', 'available', 'houses'], fromJS(getHouseIds(action.payload.availableListings)));
state.setIn([action.field, 'value'], action.value);
state.setIn(['value', action.field], action.value);
prevState.setIn(['mode'], AlertStates.successDialog);
state.setIn([path], fromJS(action.itemKey));