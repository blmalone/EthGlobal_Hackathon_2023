import Login from "./Login";
import NftInteraction from "./NftInteraction";
import CustomButton from "./WalletConnectButton";
import { useWeb3Modal } from "@web3modal/react";
import React, { Component } from "react";
import { useAccount, useDisconnect } from "wagmi";

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
