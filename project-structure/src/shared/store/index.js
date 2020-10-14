import { combineReducers } from 'redux';
import menu from './reducers/menu';
import main from './reducers/main';


export default combineReducers({
  menu,
  main
});
