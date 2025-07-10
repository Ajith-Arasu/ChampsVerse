import searchbar from "../asserts/searchBar.png";
import searchBtn from "../asserts/searchBtn.png";
import {
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
    Menu,
  MenuItem,
} from "@mui/material";
import profileIcon from "../asserts/adminProfileIcon.png";
import { useState } from "react";
import logo from "../asserts/Logo-CV.png";
import { useLocation, useNavigate } from "react-router-dom";
import menuIcon from "../asserts/menuIcon.png";

const Header = () => {
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isLatestWorks = location.pathname === "/latestworks";
  const isMobile = useMediaQuery("(max-width:600px)");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

   const handleClick = (page) => {
    navigate(`/${page}`);
    handleCloseMenu();
  };

  return (
    <Box>
      {" "}
      {isMobile && (
        <Box
          sx={{
            margin: "0 5%",
            display: "flex",

            flexDirection: "column",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: isMobile ? "150px" : "100px",
                height: "auto",
                cursor: "pointer",
                marginTop: "-6%",
              }}
              onClick={() => navigate("/home")}
            ></Box>

            <Box
              component="img"
              src={menuIcon}
              alt="menuIcon"
              sx={{ width: isMobile ? "80px" : "100px" }}
              onClick={handleOpenMenu}
            ></Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              id="basic-menu"
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem key="work" onClick={() => handleClick("createQuest")}>
                Create Quest
              </MenuItem>
              <MenuItem key="work" onClick={() => handleClick("works")}>
                Works
              </MenuItem>
              
              <MenuItem key="books" onClick={() => handleClick("books")}>
                Books
              </MenuItem>
              
              <MenuItem key="contests" onClick={() => handleClick("contests")}>
                Contests
              </MenuItem>
              
              <MenuItem key="quests" onClick={() => handleClick("quests")}>
                Quest
              </MenuItem>
              
              <MenuItem
                key="storage"
                onClick={() => handleClick("storage-consumption")}
              >
                Storage consumption
              </MenuItem>
              ,
              <MenuItem onClick={() => handleClick("deleteduser")}>
                Deleted User
              </MenuItem>
              <MenuItem onClick={() => handleClick("deletedpost")}>
                Deleted Post
              </MenuItem>
              <MenuItem onClick={() => handleClick("latestworks")}>
                Latest Works
              </MenuItem>
              <MenuItem onClick={() => handleClick("comments")}>
                Comments
              </MenuItem>
              <MenuItem onClick={() => handleClick("achievements")}>
                Achievements
              </MenuItem>
              <MenuItem onClick={() => handleClick("events")}>Events</MenuItem>
              <MenuItem onClick={() => handleClick("createQuest")}>
                Create Quest
              </MenuItem>
            </Menu>
          </Box>
          <Box
            style={{
              display: "flex",
              boxShadow: `
               inset 0 0 5px rgba(255, 255, 255, 0.2),
               inset 0 0 10px rgba(255, 255, 255, 0.3),
               inset 0 0 15px rgba(255, 255, 255, 0.4),
               inset 0 0 20px rgba(255, 255, 255, 0.5)
             `,
              borderRadius: "12px",
              margin: "-10px 0%",
              height: "50px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "15px",
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
                    fontSize: "12px",
                    color: "white",
                    padding: "15px",
                  },
                }}
              />
            </Box>
            <Button>
              <img
                src={searchBtn}
                style={{ height: "auto", width: "100px" }}
              ></img>
            </Button>
          </Box>
        </Box>
      )}
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            gap: "3px",
            justifyContent: "space-between",
            marginLeft: "5%",
          }}
        >
          {!isLatestWorks && (
            <Box
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
            />
          )}
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
      )}
    </Box>
  );
};
export default Header;
