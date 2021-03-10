import React, { Component } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyModal from "../modal/MyModal";
import Signup from "./Signup";
import axios from "axios";
import { myToaster } from "../../auth/helpers";

import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }
  // 1. One way of setting contextType for the class component
  static contextType = AuthContext;

  handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    // console.log(email, password);

    if (email.trim().length === 0 || password.trim().length === 0) {
      myToaster("Enter email and password to login!", "yellow");
      // this.context.updateState({
      //   errMessage: "Enter email and password to Login!",
      // });
      return;
    }

    let requestBody = {
      query: `
        query Login($email:String!,$password:String!){
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
            message
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    axios
      .post("http://localhost:3001/graphql", requestBody)
      .then((res) => {
        console.log(res);

        const msg = res.data.data.login?.message;
        if (res.status === 200 && msg) {
          myToaster(msg, "yellow");
          return;
          // this.context.updateState({
          //   errMessage: msg,
          // });
        }

        // success => login
        this.context.login(res.data.data.login);
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err);

        myToaster("Something went wrong! 😕", "yellow");
        // this.context.updateState({
        //   errMessage: "Something went wrong! 😕",
        // });
        this.clearForm();
      });
  };

  componentWillUnmount = () => {
    this.clearForm();
    this.context.updateState({ message: "" });
    console.log("LOGIN CLEARED");
  };

  clearForm = () => {
    this.emailEl.current.value = "";
    this.passwordEl.current.value = "";
  };

  openSignupForm = () => {
    this.context.updateState({
      signupForm: true,
    });
    // this.setState((prevState) => ({
    //   ...prevState,
    //   signupForm: true,
    // }));
  };
  closeSignupForm = () => {
    this.context.updateState({
      signupForm: false,
    });
    // this.setState((prevState) => ({
    //   ...prevState,
    //   signupForm: false,
    // }));
  };
  render() {
    return (
      <React.Fragment>
        {/* {this.state.signupForm && <Backdrop />} */}
        {this.context.state.signupForm && (
          <MyModal>
            <Signup closeSignupForm={this.closeSignupForm} />
          </MyModal>
        )}

        <div className="container">
          <form
            style={{ marginTop: "150px" }}
            onSubmit={this.handleLoginSubmit}
          >
            <span>
              {this.context.state.message && this.context.state.message}
            </span>
            <div className="row">
              <div className="col s12 m6 offset-m3">
                <div className="">
                  <div className="row">
                    <div className="input-field col s12 m10 offset-m1">
                      <h4 className="blue-text">Login</h4>
                    </div>
                    <div className=" col s12 m10 offset-m1">
                      <input
                        id="email"
                        className="validate"
                        type="text"
                        ref={this.emailEl}
                        placeholder="Email"
                      />
                      {/* <label htmlFor="email">Email</label> */}
                    </div>
                    <div className=" col s12 m10 offset-m1">
                      <input
                        id="password"
                        type="password"
                        className="validate"
                        ref={this.passwordEl}
                        placeholder="Password"
                      />
                      {/* <label htmlFor="password">Password</label> */}
                    </div>
                    <div className="col s12 offset-s2">
                      <div>
                        <button
                          style={{ padding: "0 40px" }}
                          type="submit"
                          className="btn blue"
                        >
                          Login
                        </button>
                      </div>
                      <div>
                        <span>Don't have an account?</span>
                        <span
                          style={{ cursor: "pointer" }}
                          className="red-text"
                          onClick={this.openSignupForm}
                        >
                          {" Signup"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

// // 2. Another way of setting contextType for the class component
// Login.contextType = AuthContext;
