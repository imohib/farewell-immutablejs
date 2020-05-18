a.gallery.shown = true;
state.appData.cookies = cookies;
prevState.info.error = true;
b.listings.available.houses = fromJS(getHouseIds(action.payload.availableListings));
state[action.field].value = action.value;
state.value[action.field] = action.value;
prevState.mode = AlertStates.successDialog;
state[path] = fromJS(action.itemKey);