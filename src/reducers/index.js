import { combineReducers } from 'redux';
import userAuth from './userAuth-reducers';
import userProfile from './userProfile-reducers';
import googlePlaces from './googlePlaces-reducers';

export default combineReducers({
  userAuth,
  userProfile,
  googlePlaces,
});