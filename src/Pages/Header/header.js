import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import style from "../Header/style.module.css";
import menu from "../../asserts/menu.png";
import { useState } from "react";

const Header = ({ userDetails }) => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const navigate = useNavigate();

  // Use anchorEl to anchor the menu to the menu button
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (page) => {
    navigate(`/${page}`);
    handleCloseMenu();
  };

  // Open menu by setting anchorEl from the event target
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu by setting anchorEl to null
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background:
          "linear-gradient(78.47deg, #FC3561 -7.11%, #FDB365 107.74%)",
      }}
    >
      <Toolbar>
        <Typography variant="h6">
          <img src="/cv.png" alt="CV" />
        </Typography>

        {/* Tab Sections */}
        <div
          className={style["tab-Section"]}
          onClick={() => handleClick("work")}
        >
          <img
            src={
              location.pathname === "/work"
                ? "/backGroundTab.png"
                : "/emptySection.png"
            }
            alt="Works"
            style={{ width: "85%" }}
          />
          <div className={style["centered"]}>Works</div>
        </div>
        <div
          className={style["tab-Section"]}
          style={{ marginLeft: "2px" }}
          onClick={() => handleClick("books")}
        >
          <img
            src={
              location.pathname === "/books"
                ? "/backGroundTab.png"
                : "/emptySection.png"
            }
            alt="Books"
            style={{ width: "85%" }}
          />
          <div className={style["centered"]}>Books</div>
        </div>
        <div
          className={style["tab-Section"]}
          style={{ marginLeft: "2px" }}
          onClick={() => handleClick("contests")}
        >
          <img
            src={
              location.pathname === "/contests"
                ? "/backGroundTab.png"
                : "/emptySection.png"
            }
            alt="Contests"
            style={{ width: "85%" }}
          />
          <div className={style["centered"]}>Contests</div>
        </div>
        <div
          className={style["tab-Section"]}
          style={{ marginLeft: "2px" }}
          onClick={() => handleClick("storage-consumption")}
        >
          <img
            src={
              location.pathname === "/storage-consumption"
                ? "/backGroundTab.png"
                : "/emptySection.png"
            }
            alt="Storage"
            style={{ width: "85%" }}
          />
          <div className={style["centered"]}>Storage</div>
        </div>
        <div
          className={style["tab-Section"]}
          style={{ marginLeft: "2px" }}
          onClick={() => handleClick("deleted-post")}
        >
          <img
            src={
              location.pathname === "/deleted-post"
                ? "/backGroundTab.png"
                : "/emptySection.png"
            }
            alt="Deleted Post"
            style={{ width: "85%" }}
          />
          <div className={style["centered"]}>Deleted Post</div>
        </div>

        <Box sx={{ flexGrow: 1 }} />

        {isProfilePage && (
          <Box
            className="profile-info"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Avatar
              src={
                userDetails[0].defaultAvatar
                  ? `https://dcp5pbxslacdh.cloudfront.net/APP/UserAvatars/${userDetails[0].avatar}`
                  : `https://dcp5pbxslacdh.cloudfront.net/${userDetails[0].uid}/PROFILE/IMAGES/filetype/${userDetails[0].avatar}`
              }
              alt="Profile"
              sx={{ height: 45, width: 45 }}
            />
            <Typography variant="h4" style={{ textAlign: "right" }}>
              {userDetails[0].firstname}
            </Typography>
          </Box>
        )}

        {/* Menu Button */}
        <Box sx={{ marginLeft: "auto" }}>
          <Button onClick={handleOpenMenu}>
            <img src={menu} alt="Menu" style={{ height: "35px" }} />
          </Button>
        </Box>

        {/* Menu anchored to the menu button */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          id="basic-menu"
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => handleClick("deleted-user")}>
            Deleted User
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
