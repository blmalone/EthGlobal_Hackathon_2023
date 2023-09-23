import "./Login.css";
import React, { Component } from "react";

// Import the CSS file

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = () => {
    // Perform authentication logic here (e.g., check username and password)
    // For this example, we'll just log the entered credentials.
    console.log("Username:", this.state.username);
    console.log("Password:", this.state.password);
  };

  render() {
    return (
      <div className="login-container">
        <div className="form-container">
          <h2 style={{ color: "black" }}>Login</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <button onClick={this.handleLogin}>Login</button>
        </div>
      </div>
    );
  }
}

export default Login;
