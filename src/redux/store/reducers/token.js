import {
    GET_TOKENS,
    SET_TOKENS,
} from '../types';

const initialState = {
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case SET_TOKENS:
            return initialState;

        case GET_TOKENS:
            return {
                ...state,
                ...payload
            };

        default:
            return state;
    };
};
