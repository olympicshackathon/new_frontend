import { combineReducers } from 'redux';
import userAuth from './userAuth-reducers';
import userProfile from './userProfile-reducers';
import googlePlaces from './googlePlaces-reducers';
import currentLocation from './currentLocation-reducers';

export default combineReducers({
  userAuth,
  userProfile,
  googlePlaces,
  currentLocation,
});