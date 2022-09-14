import {
    LOGOUT_USER,
    LOGIN_USER,
} from '../types';

const initialState = {
    role: null,
    email: null,
    nickname: null,
    token: null,
    loggedIn: false,
    isPatron: false,
    isVerified: false,
    joined: null,
    address: null,
    aboutMe: null,
    portfolioLink: null,
    firstTimeLogin: false,
    ethProviderName: 'jsonrpc',
    isOnCorrectNetwork: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case LOGOUT_USER:
            return initialState;

        case LOGIN_USER:
            return {
                ...state,
                ...payload,
                loggedIn: true,
            };

        default:
            return state;
    };
};
