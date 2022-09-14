import {
    LOGOUT_USER,
    LOGIN_USER,
  } from '../types';
  
  export function loginUser(payload) {
    return {
      type: LOGIN_USER,
      payload,
    };
  }

  export function logoutUser() {
    window.localStorage.clear();
    return {
      type: LOGOUT_USER,
    };
  }
    