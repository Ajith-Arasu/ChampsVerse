import searchbar from "../asserts/searchBar.png";
import searchBtn from "../asserts/searchBtn.png";
import { Box, TextField, Button, Typography } from "@mui/material";
import profileIcon from "../asserts/adminProfileIcon.png";
import { useState } from "react";
import logo from "../asserts/Logo-CV.png";
import { useLocation, useNavigate } from "react-router-dom";


const Header = () => {
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isLatestWorks = location.pathname === '/latestworks'
  
  return (
    <Box>
      {" "}
      
      <Box
        sx={{
          display: "flex",
          gap: "3px",
          justifyContent: "space-between",
          marginLeft: "5%",
        }}
      >
        {!isLatestWorks && <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: "190px",
            height: "48px",
            cursor: "pointer",
            marginTop: "1%",
          }}
          onClick={() => navigate("/home")}
        />}
        <Box style={{ display: "flex" }}>
          <Box
            sx={{
              width: "550px", // Set appropriate width
              height: "40px", // Set appropriate height
              backgroundImage: `url(${searchbar})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              mt: 3,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              placeholder="Search Something"
              variant="standard"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "16px",
                  color: "white",
                  padding: "30px",
                },
              }}
            ></TextField>
          </Box>
          <Button>
            <img
              src={searchBtn}
              style={{ height: "auto", width: "135px" }}
            ></img>
          </Button>
        </Box>

        <img
          src={profileIcon}
          style={{ width: "52px", height: "52px", margin: "20px 10px" }}
        ></img>
      </Box>
    </Box>
  );
};
export default Header;
