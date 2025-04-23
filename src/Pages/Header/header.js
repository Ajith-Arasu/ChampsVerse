import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
  Menu,
  MenuItem,
  useMediaQuery
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import style from "../Header/style.module.css";
import menu from "../../asserts/menu.png";
import { useState } from "react";

const Header = ({ userDetails }) => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (page) => {
    navigate(`/${page}`);
    handleCloseMenu();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
       
          <img src="/cv.png" alt="CV" style={{ width: isMobile?'250px': '250px'}} />
       

        {/* Tab Sections */}
        {!isMobile && <>
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
          onClick={() => handleClick("quests")}
        >
          <img
            src={
              location.pathname === "/quests"
                ? "/backGroundTab.png"
                : "/emptySection.png"
            }
            alt="Deleted Post"
            style={{ width: "85%" }}
          />
          <div className={style["centered"]}>Quest</div>
        </div>
        </>}

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

        <Box sx={{ marginLeft: "auto" }}>
          <Button onClick={handleOpenMenu}>
            <img src={menu} alt="Menu" style={{ height: "35px" }} />
          </Button>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          id="basic-menu"
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {isMobile && <>
         <MenuItem onClick={() => handleClick("work")}>
            Works
          </MenuItem>
          <MenuItem onClick={() => handleClick("books")}>
            Books
          </MenuItem>
          <MenuItem onClick={() => handleClick("contests")}>
            Contests
          </MenuItem>
          <MenuItem onClick={() => handleClick("quests")}>
            Quest
          </MenuItem>
          <MenuItem onClick={() => handleClick("storage-consumption")}>
            Storage consumption
          </MenuItem> </>}
          <MenuItem onClick={() => handleClick("deleted-user")}>
            Deleted User
          </MenuItem>
          <MenuItem onClick={() => handleClick("deleted-post")}>
            Deleted Post
          </MenuItem>
          <MenuItem onClick={() => handleClick("bot-works")}>
            Bot Works
          </MenuItem>
          <MenuItem onClick={() => handleClick("comments")}>
            Comments
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
