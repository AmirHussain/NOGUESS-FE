import { createStore, combineReducers } from 'redux';
import { USER } from '../redux/store_types';
import userStore from "./userStore";
import { persistStore, persistReducer } from 'redux-persist'
import storage from "redux-persist/lib/storage";
const reducer = combineReducers({
    [USER]: userStore
})

const persistConfig = {
    key: 'root',
    storage,
}
const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer)
export const persistor = persistStore(store)

export default { store, persistor }