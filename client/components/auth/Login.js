import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

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
        console.log("🚀 ~ res", res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Req failed!");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <form className="auth-form" onSubmit={this.handleLoginSubmit}>
        <div className="form-control">
          <label htmlFor="email"></label>
          <input id="email" placeholder="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password"></label>
          <input id="password" placeholder="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Login</button>
          <button>Go to Signup</button>
        </div>
      </form>
    );
  }
}
