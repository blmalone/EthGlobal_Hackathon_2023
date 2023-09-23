import Login from "./Login";
import React, { Component } from "react";

class Homepage extends Component {
  constructor() {
    super();
    this.setState = {
      authenticated: true,
    };
  }
  render() {
    return (
      <div>
        <Login />
      </div>
    );
  }
}

export default Homepage;
