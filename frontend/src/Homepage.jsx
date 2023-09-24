import Login from "./Login";
import React, { Component } from "react";
import { fetchBlockNumber } from 'wagmi/actions'

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
