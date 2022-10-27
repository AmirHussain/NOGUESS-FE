import {
    GET_TOKENS,
    SET_TOKENS,
  } from '../types';
  
  export function getTokensFromStore() {
    return {
      type: GET_TOKENS,
    };
  }

  export function setTokensInStore(payload) {
    return {
      type: SET_TOKENS,
      payload,
    };
  }
    