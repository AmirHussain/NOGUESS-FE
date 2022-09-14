import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/index';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'session',
  storage: storage,
  whitelist: ['user'], // which reducer want to store in persitent storage
};
const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(pReducer, composeWithDevTools(applyMiddleware(reduxThunk)));
const persistor = persistStore(store);
if (window.Cypress) {
  // we are running in Cypress
  // so do something different here
  window.env = 'test';
  window.cypressStore = store;
}
export { persistor, store };
