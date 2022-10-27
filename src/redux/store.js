import { createStore, combineReducers } from 'redux';
import { USER ,TOKENSTORE} from '../redux/store_types';
import userStore from "./userStore";
import { persistStore, persistReducer } from 'redux-persist'
import storage from "redux-persist/lib/storage";
import tokenStore from './tokenStore';
const reducer = combineReducers({
    [USER]: userStore,
    
    [TOKENSTORE]: tokenStore
})

const persistConfig = {
    key: 'root',
    storage,
}
const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer)
export const persistor = persistStore(store)

export default { store, persistor }