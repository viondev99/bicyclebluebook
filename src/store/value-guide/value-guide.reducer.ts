import { combineReducers } from 'redux';
import familyReducer from './model/family.reducer';
import modelReducer from './model/model.reducer';
import brandReducer from './brand/brand.reducer';
import bicycleReducer from './bicycle/bicycle.reducer';
import recommendReducer from './recommend/recommend.reducer';
import ratingReducer from './rating/rating.reducer';
import baseComponentReducer from './baseComponent/baseComponent.reducer';

export default combineReducers({
  baseComponent: baseComponentReducer,
  bicycle: bicycleReducer,
  brand: brandReducer,
  model: modelReducer,
  family: familyReducer,
  recommend: recommendReducer,
  rating: ratingReducer,
});
