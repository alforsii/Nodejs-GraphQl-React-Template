import React, { Component } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyModal from "../modal/MyModal";
import Signup from "./Signup";
import "./Login.css";

export default class Login extends Component {
  state = {
    signupForm: false,
  };
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
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
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
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Req failed!");
        }
        return res.json();
      })
      .then((res) => {
        // console.log(data);
        // this.props.updateState({ isLoggedIn: true });
        // console.log("🚀 ~ this.props", this.props);
        this.context.login(res.data.login);

        this.props.history.push("/");
      })
      .catch((err) => console.log(err));
  };

  openSignupForm = () => {
    this.setState((prevState) => ({
      ...prevState,
      signupForm: true,
    }));
  };
  closeSignupForm = () => {
    this.setState((prevState) => ({
      ...prevState,
      signupForm: false,
    }));
  };
  render() {
    return (
      <React.Fragment>
        {/* {this.state.signupForm && <Backdrop />} */}
        {this.state.signupForm && (
          <MyModal>
            <Signup closeSignupForm={this.closeSignupForm} />
          </MyModal>
        )}

        <div className="container">
          <form
            style={{ marginTop: "150px" }}
            onSubmit={this.handleLoginSubmit}
          >
            {this.context.state.message && this.context.state.message}
            <div className="row">
              <div className="col s12 m6 offset-m3">
                <div className="">
                  <div className="row">
                    <div className="input-field col s12 m10 offset-m1">
                      <h4>Login</h4>
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
                    <div className="col s8 offset-s2">
                      <button type="submit" className="btn blue">
                        Login
                      </button>
                      <span>Create account?</span>
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
          </form>
        </div>
      </React.Fragment>
    );
  }
}

// // 2. Another way of setting contextType for the class component
// Login.contextType = AuthContext;
