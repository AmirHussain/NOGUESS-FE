import { createSlice } from "@reduxjs/toolkit";
import { USER } from './store_types';

export const userStore = createSlice({
    name: USER,
    initialState: {
        address: '',
        details: {}
    },
    reducers: {
        setUserDetails: (state, action) => {
            debugger
            console.log('state', state);
            console.log('action', action);
            state.address = action.payload.address;
            state.details = action.payload.details
        },
        clearUserDetails: (state) => {
            state.address = '';
            state.details = {}
        },

        setTokens: (state, action) => {
            debugger
            console.log('state', state);
            console.log('action', action);
            state.address = action.payload.address;
            state.details = action.payload.details
        },
        clearTokens: (state) => {
            state.address = '';
            state.details = {}
        }
    }
});

export const { setUserDetails, clearUserDetails } = userStore.actions;
export const selectUserAddress = state => state[USER]?.address;
export const selectUserDetails = state => state[USER]?.details;

export default userStore.reducer;