import "./Login.css";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import { Web3Button } from "@web3modal/react";
import React, { useEffect, useState } from "react";

// Import the CSS file

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    console.log(user)
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLogin = async () => {
    // Perform authentication logic here (e.g., check username and password)
    // For this example, we'll just log the entered credentials.
    loginWithRedirect();
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2 style={{ color: "black" }}>Passing Gas</h2>
        {/* <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleInputChange}
        /> */}
        <Button onClick={isAuthenticated ? logout : handleLogin} variant="contained" color="primary">
          {isAuthenticated ? "Logout" : "Login with Auth0"}
        </Button>
        <br />
        <br />
        <Web3Button />
      </div>
    </div>
  );
}

export default Login;
