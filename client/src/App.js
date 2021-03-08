import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./components/auth/Login";
import Navbar from "./components/nav/Navbar";
import Home from "./components/Home";

import { AuthContext } from "./context/AuthContext";
import "./App.css";

export default class App extends Component {
  state = {
    isLoggedIn: false,
    token: null,
    userId: null,
    tokenExpiration: null,
  };

  componentDidMount() {
    // const authUser = JSON.parse(localStorage.getItem("authUser"));
    // if (authUser?.userId) {
    //   this.setState({ isLoggedIn: true, ...authUser });
    // }
    this.isLoggedIn();
  }

  // static contextType= AuthContext

  isLoggedIn = () => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (!authUser || !authUser?.token) {
      return;
    }
    console.log("🚀 ~~ authUser", authUser);
    const requestBody = {
      query: `
       query {
         isLoggedIn(token:"${authUser?.token}") {
           token
           userId
           tokenExpiration
         }
       }
      `,
    };
    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("🚀 .then ~ res", res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Req failed!");
        }
        return res.json();
      })
      .then((res) => {
        if (res.data?.isLoggedIn && res.data.isLoggedIn?.token) {
          this.login(res.data.isLoggedIn);
          // this.setState((prevState) => ({
          //   ...prevState,
          //   isLoggedIn: true,
          //   userId: res.data?.isLoggedIn?._id,
          // }));
        }
      })
      .catch((err) => console.log(err));
  };

  login = (data) => {
    this.setState({
      isLoggedIn: true,
      ...data,
    });

    localStorage.setItem("authUser", JSON.stringify(data));
    console.log(this.state);
  };
  logout = () => {
    this.setState({
      isLoggedIn: false,
      token: null,
      userId: null,
    });
    localStorage.clear();
  };

  updateState = (data) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
    console.log(this.state);
  };
  render() {
    return (
      <>
        <AuthContext.Provider
          value={{
            userId: this.state.userId,
            token: this.state.token,
            login: this.login,
            logout: this.logout,
          }}
        >
          <Navbar />
          <Switch>
            {!this.state.isLoggedIn && <Redirect from="/" to="/login" exact />}
            {this.state.isLoggedIn && (
              <Route path="/" component={(props) => <Home {...props} />} />
            )}
            {!this.state.isLoggedIn && (
              <Route
                path="/login"
                component={(props) => (
                  <Login {...props} updateState={this.updateState} />
                )}
              />
            )}
          </Switch>
        </AuthContext.Provider>
      </>
    );
  }
}
