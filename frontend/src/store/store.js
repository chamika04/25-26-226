import React from 'react';

// Minimal auth store stub to satisfy `useAuthStore` imports.
const _state = {
  auth: { username: '' },
};

function setUsername(username) {
  _state.auth.username = username;
}

// Named export used throughout the app
export function useAuthStore(selector) {
  // selector is a function like state => state.setUsername or state => state.auth
  try {
    return selector({ auth: _state.auth, setUsername });
  } catch (e) {
    return undefined;
  }
}

// default export kept for compatibility
const store = {
  getState: () => ({ ..._state }),
  setUsername,
};

export default store;
