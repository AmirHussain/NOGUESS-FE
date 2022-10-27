import { combineReducers } from 'redux';

//reducers
import user from './user';
import token from './token';

export default combineReducers({
    user,
    token
});
