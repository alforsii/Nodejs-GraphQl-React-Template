import React, { Component } from "react";
import { AuthContext } from "../../context/AuthContext";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.firstNameEl = React.createRef();
    this.lastNameEl = React.createRef();
    this.state = {
      errMessage: "",
    };
  }
  // 1. One way of setting contextType for the class component
  static contextType = AuthContext;

  componentWillUnmount = () => {};

  handleSignupSubmit = (e) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    const firstName = this.firstNameEl.current.value;
    const lastName = this.lastNameEl.current.value;
    // console.log(email, password);

    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      firstName.trim().length === 0 ||
      lastName.trim().length === 0
    ) {
      return this.setState((prevState) => ({
        ...prevState,
        errMessage: "All fields are mandatory!",
      }));
    }
    let requestBody = {
      query: `
        mutation {
          signup(data: { email:"${email}",password: "${password}",firstName:"${firstName}",lastName:"${lastName}"}) {
            _id
            email
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
        console.log(res);
        // this.props.updateState({ isLoggedIn: true });
        // console.log("🚀 ~ this.props", this.props);
        this.context.updateState({
          message: "Signup successful, please login now!",
        });
        this.props.closeSignupForm();
      })
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <form style={{ width: "500px" }} onSubmit={this.handleSignupSubmit}>
        <span style={{ padding: 10 }} className="red-text">
          {this.state.errMessage && this.state.errMessage}
        </span>
        <div
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
          }}
          className="row"
        >
          <div className="col s12">
            <div className="">
              <div className="row">
                <div className="input-field col s12 m10 offset-m1">
                  <h4>Signup</h4>
                </div>
                <div className="input-field col s12 m10 offset-m1">
                  <input
                    id="email"
                    className="validate"
                    type="email"
                    ref={this.emailEl}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="input-field col s12 m10 offset-m1">
                  <input
                    id="password"
                    type="password"
                    className="validate"
                    ref={this.passwordEl}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="input-field col s12 m10 offset-m1">
                  <input
                    id="firstName"
                    type="text"
                    className="validate"
                    ref={this.firstNameEl}
                  />
                  <label htmlFor="firstName">First Name</label>
                </div>
                <div className="input-field col s12 m10 offset-m1">
                  <input
                    id="lastName"
                    type="text"
                    className="validate"
                    ref={this.lastNameEl}
                  />
                  <label htmlFor="lastName">lastName</label>
                </div>
                <div className="col s8 offset-s2">
                  <button
                    onClick={this.props.closeSignupForm}
                    className="btn btn-flat noHover"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn blue">
                    Signup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
