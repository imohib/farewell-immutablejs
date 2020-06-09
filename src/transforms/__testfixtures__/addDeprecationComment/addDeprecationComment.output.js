import combineReducers from 'redux-immutable/dist/combineReducers';
// ImmutableJS usage is deprecated
// Please, do not copy & paste or use this snippet as reference :)
// How to refactor? See https://github.com/quintoandar/farewell-immutablejs/blob/master/MIGRATION.md
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import Raven from 'raven-js';
