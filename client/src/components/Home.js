import React from "react";
import { AuthContext } from "../context/AuthContext";

export default function Main() {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <div style={{ marginTop: "70px" }}>
            <h2>Home page</h2>
          </div>
        );
      }}
    </AuthContext.Consumer>
  );
}
