import Login from "./Login";
import NftInteraction from "./NftInteraction";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import { React, useEffect, useState } from "react";
import { Web3Button } from "@web3modal/react";
import { useAccount, } from 'wagmi'
import ImageCard from "./ImageCard";

function Homepage() {

  const { isConnected: metamaskAuthenticated } = useAccount()
  const { user, logout, isAuthenticated: worldcoinAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    console.log(`metamaskAuthenticated changed: ${metamaskAuthenticated}`)
  }, [metamaskAuthenticated])

  useEffect(() => {

    const onUseEffect = async () => {
      console.log(`worldcoinAuthenticated: ${worldcoinAuthenticated}`)
      console.log(`user`)
      console.log(user)

      // const token = await getAccessTokenSilently()  
      // console.log("token")
      // console.log(token)

      // const userInfo = await fetch('https://id.worldcoin.org/userinfo', {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // })

      // console.log("userInfo")
      // console.log(userInfo)
    }

    onUseEffect()
  }, [worldcoinAuthenticated])

  const getPage = () => {
    if (worldcoinAuthenticated && metamaskAuthenticated) {
      return <NftInteraction />
    } else if (worldcoinAuthenticated) {
      return (
        <div>
          <Web3Button />
          <br />
          <br />
          <Button onClick={logout} variant="contained" color="primary"> Logout </Button>
          <br />
          <br />
          <Button onClick={logout} variant="contained" color="primary"> Logout Worldcoin </Button>
        </div>
      )
    } else {
      return (
        <div>
          <Login />
        </div>
      )
    }
  }

  return (
    <div>{getPage()}</div>
  );
}

export default Homepage;
