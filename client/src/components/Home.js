import React from "react";
import { AuthContext } from "../context/AuthContext";

export default function Main() {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <div>
            <h2>Home page</h2>
            <button onClick={context.logout}>logout</button>
          </div>
        );
      }}
    </AuthContext.Consumer>
  );
}
