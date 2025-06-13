import { Box, Button, TextField, Typography } from "@mui/material";
import background from "../../asserts/LoginPageBG.png";
import overlayImg from "../../asserts/fileds.png";
import loginBtn from "../../asserts/LoginBtn.png";
import logo from "../../asserts/Logo-CV.png";
import ApiCall from "../API/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = ApiCall();
  const navigate = useNavigate();

  const handleLogin =async () => {
    const credentials = {
      email: username.trim(),
      password: password.trim(),
    };

    if (!credentials.email || !credentials.password) {
      alert("Please enter both username and password");
      return;
    }

    console.log("credentials", credentials);

    login(credentials)
    .then((res) => {
      console.log("Login successful:", res); // res should not be undefined
      alert("Login Successful");
      navigate('/home')
    })
    .catch((err) => {
      console.error("Login failed:", err);
      alert("Login failed. Please check credentials.");
    });
    
  };

  const centerStyle = (top, left) => ({
    position: "absolute",
    top: top,
    left: left,
    transform: "translate(-50%, -50%)",
  });

  const overlayBoxStyle = {
    width: "390px",
    height: "54px",
    backgroundImage: `url(${overlayImg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: 2,
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* Logo */}
      <Box sx={centerStyle("10%", "12%")}>
        <Box component="img" src={logo} alt="Logo" sx={{ width: "230px" }} />
      </Box>

      {/* Login Text */}
      <Typography
        sx={{
          ...centerStyle("35%", "9%"),
          fontSize: "32px",
          fontWeight: 800,
          color: "white",
          fontFamily: "Baloo2",
        }}
      >
        Login
      </Typography>

      {/* Username Field */}
      <Box sx={centerStyle("50%", "20%")}>
        <Box sx={overlayBoxStyle}>
          <TextField
            variant="standard"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "16px",
                color: "white",
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
                  WebkitTextFillColor: "white !important",
                  backgroundColor: "transparent !important",
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Password Field */}
      <Box sx={centerStyle("65%", "20%")}>
        <Box sx={overlayBoxStyle}>
          <TextField
            variant="standard"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "16px",
                color: "white",
              },
            }}
          />
        </Box>
      </Box>

      {/* Login Button */}
      <Button
        sx={centerStyle("80%", "12%")}
        disableRipple
        onClick={handleLogin}
      >
        <Box component="img" src={loginBtn} alt="Login Button" />
      </Button>
    </Box>
  );
};

export default Login;
