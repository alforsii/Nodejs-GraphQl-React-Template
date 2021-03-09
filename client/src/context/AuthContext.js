import React from "react";

export const AuthContext = React.createContext({
  userId: null,
  token: null,
  state: {},
  login: (data) => {},
  logout: () => {},
  updateState: (date) => {},
});
