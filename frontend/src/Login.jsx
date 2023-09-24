import "./Login.css";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import React, { useEffect } from "react";

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
        <h2 style={{ color: "black" }}>Passing Gas</h2>
        <Button onClick={handleLogin} variant="contained" color="primary">
          Login with Auth0
        </Button>
      </div>
    </div>
  );
}

export default Login;
