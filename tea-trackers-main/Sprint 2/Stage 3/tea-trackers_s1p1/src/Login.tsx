// Login.tsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { UserContext } from "./UserContext";
import { UserService } from "./services/UserService";
import { config } from "./config";



const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPassword, setShowpassword] = useState(false);

  const handleLogin = async (
    username: string,
    password: string
  ): Promise<string> => {
    try {
      const userService = new UserService(config.API_URL);
      const response = await userService.checkUser(username, password);
      if (response) {
        try {
          const user = await userService.getUser(username);
          setUser(user.data);
          localStorage.setItem("username", username);
          return "success";
        } catch {
          return "error";
        }
      } else {
        return "error";
      }
    } catch (error) {
      console.error("API request failed", error);
      return "error";
    }
  };

  const handleLoginClick = async () => {
    // Call the handleLogin function passed as a prop
    const loginResult = await handleLogin(email, password);

    if (loginResult === "success") {
      // Navigate to the dashboard upon successful login
      console.log("Success");
      console.log("user", user)
      navigate("/dashboard");
    } else {
      // Handle unsuccessful login (display an alert, etc.)
      console.error(`Failed to log in with error ${loginResult}`);
      alert("Wrong credentials. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLoginClick();
    }
  };

  const handleShowPassword = () => {
    // Toggle the visibility of the password field
    setShowpassword(!showPassword);
  };

  return (
    <div style={{ display: "flex", flexGrow: "inherit" }}>
      <Stack
        style={{
          width: "50%",
          height: "100vh",
          padding: "auto",
          backgroundColor: "midnightblue",
          color: "white",
        }}
      >
        <Typography
          variant="h2"
          marginTop={"10%"}
          textAlign={"left"}
          paddingLeft={"5%"}
          fontWeight={800}
        >
          Bienvenue sur Tea Trackers
          <img
            alt="Tea Trackers"
            src="/assets/logo.png"
            style={{ height: "5.5rem", transform: "translate(0.5rem, 0.7rem)" }}
          />
        </Typography>
        <Typography
          variant="subtitle1"
          style={{
            marginTop: "5rem",
            textAlign: "center",
            paddingRight: "35%",
            fontWeight: 400,
            fontStyle: "italic",
          }}
        >
          Le gestionnaire de produits d'IMT Mines Albi
        </Typography>
      </Stack>
      <Stack style={{ width: "25%", margin: "auto" }}>
        <Typography variant="h5" fontWeight={300}>
          Connexion Utilisateur
        </Typography>
        {/* <Typography variant="h6" alignSelf='left'>Username: *</Typography> */}
        <TextField
          style={{ marginTop: "50px" }}
          variant="standard"
          required={true}
          label="username"
          type="string"
          autoFocus={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
        ></TextField>

        {/* <Typography variant="h6">Password: *</Typography> */}
        <TextField
          style={{ marginTop: "20px" }}
          variant="standard"
          required={true}
          type={showPassword ? "text" : "password"}
          label="Mot de Passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></TextField>
        {/* Add a box that adds a link that sends an email for lost password */}
        <Box
          style={{
            display: "flex",
            marginTop: "20px",
            justifyContent: "space-between",
          }}
        >
          <a href="">
            <Typography variant="subtitle2" fontWeight={200}>
              Mot de passe oublié ?
            </Typography>
          </a>
          <a href="">
            <Typography variant="subtitle2" fontWeight={200}>
              Pas encore de compte ?
            </Typography>
          </a>
        </Box>
        <Button
          style={{ marginTop: "30px" }}
          variant="contained"
          onClick={handleLoginClick}
        >
          Se Connecter
        </Button>
      </Stack>
    </div>
  );

  // return (
  //   <div className="Login">
  //     <div className="Loginbox">
  //       <div className="LoginHeader">Login</div>
  //       <div className="inputs">
  //         <input
  //           className="email"
  //           placeholder="Enter your email"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //         />
  //         <input
  //           className="password"
  //           placeholder="Enter your password"
  //           type="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //       </div>
  //       <div style={{ display: "flex", justifyContent: "center" }}>
  //         <button className="submitbutton" onClick={handleLoginClick}>
  //           Login
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Login;
