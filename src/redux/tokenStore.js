import { createSlice } from "@reduxjs/toolkit";
import { TOKENSTORE } from './store_types';

export const tokenStore = createSlice({
    name: TOKENSTORE,
    initialState: {},
    reducers: {
        setTokensInStore: (state, action) => {
            debugger
            state = action.payload
        },
        clearTokensFromStore: (state) => {
            state = {};
        }
    }
});

export const getTokensFromStore = state => state[TOKENSTORE];

export default tokenStore.reducer;