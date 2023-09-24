import Login from "./Login";
import NftInteraction from "./NftInteraction";
import React, { Component } from "react";

class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: true,
    };
  }
  render() {
    return <div>{this.state.authenticated ? <NftInteraction /> : <Login />}</div>;
  }
}

export default Homepage;
