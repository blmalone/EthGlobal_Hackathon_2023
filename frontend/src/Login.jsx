import "./Login.css";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import ImageCard from "./ImageCard";

// Import the CSS file

function Login() {
  const { user, loginWithRedirect } = useAuth0();

  useEffect(() => {
    console.log(user);
  }, []);

  const handleLogin = async () => {
    // Perform authentication logic here (e.g., check username and password)
    // For this example, we'll just log the entered credentials.
    loginWithRedirect();
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <ImageCard imageUrl='https://i.ibb.co/52cL5Qk/Gas-Pass-Logo.png'></ImageCard>
        <br/>
        <Button onClick={handleLogin} variant="contained" color="primary">
          Login with Auth0
        </Button>
      </div>
    </div>
  );
}

export default Login;
