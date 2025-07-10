import {
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import searchbar from "../../asserts/searchBar.png";
import searchBtn from "../../asserts/searchBtn.png";
import menuCard from "../../asserts/menu-card.png";
import cardIcon from "../../asserts/cardIcon.png";
import profileIcon from "../../asserts/adminProfileIcon.png";
import QuestHome from "./quest";
import menuBG from "../../asserts/menuBg.png";
import logo from "../../asserts/Logo-CV.png";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardCards from "../../component/dashboardcards";
import LatestWorks from "../LatestWorks/index";
import Comments from "../comments/comments";
// import Contests from "../../Pages/Contests/index";
import menuIcon from "../../asserts/menuIcon.png";
import CreateQuest from "../../Pages/Creation/quest";
import btnBg from "../../asserts/btnBg.png";

const Home = () => {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");
  const location = useLocation();
  const isLatestWorks = location.pathname === "/latestworks";
  const isHome = location.pathname === "/home";
  const isComments = location.pathname === "/comments";
  const isContests = location.pathname === "/contests";
  const isMobile = useMediaQuery("(max-width:600px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const isCreateQuest = location.pathname === "/createQuest";

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

  const statsData = [
    { label: "Total Users", value: "50,000", nav: null },
    { label: "Total Works", value: "8,000", nav: "works" },
    { label: "Total Books", value: "10,000", nav: "books" },
    { label: "Total Achievements", value: "2,500", nav: "achievements" },
  ];

  const handlestats = (nav) => {
    if (nav !== null) {
      navigate(`/${nav}`);
    }
  };

  const tabs = [
    { display: "Home", value: "home" },
    { display: "Contests", value: "contests" },
    { display: "Comments", value: "comments" },
    { display: "Deleted User", value: "deleteduser" },
    { display: "Deleted Post", value: "deletedpost" },
    { display: "Latest Works", value: "latestworks" },
    { display: "Events", value: "events" },
  ];

  const [activeTab, setActiveTab] = useState("home");

  const handleTab = (value) => {
    setActiveTab(value);
    navigate(`/${value}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : "25%",
          height: isMobile ? "30%" : "100%",
          display: isMobile && "flex",
          justifyContent: isMobile && "space-between",
          alignItems: isMobile && "center",
          flexDirection: isMobile && "column",
        }}
      >
        {isMobile && (
          <>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{ width: "200px", height: "20%", marginTop: "15px" }}
              />

              <Box
                component="img"
                src={menuIcon}
                alt="menuIcon"
                sx={{ width: "100px" }}
                onClick={handleOpenMenu}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                id="basic-menu"
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem key="work" onClick={() => handleClick("works")}>
                  Works
                </MenuItem>
                <MenuItem key="books" onClick={() => handleClick("books")}>
                  Books
                </MenuItem>
                <MenuItem
                  key="contests"
                  onClick={() => handleClick("contests")}
                >
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
                <MenuItem onClick={() => handleClick("events")}>
                  Events
                </MenuItem>
                <MenuItem onClick={() => handleClick("createContest/Quest")}>
                  Create Contest / Quest
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
          </>
        )}
        {!isMobile && (
          <Box
            sx={{
              width: "125%",
              height: "750px",
              backgroundImage: `url(${menuBG})`,
              backgroundSize: "100% 109%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              marginLeft: "-15%",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ width: "160px", marginTop: "5%", marginLeft: "15%" }}
            />
            <Box
              sx={{
                marginLeft: "30%",
                display: "flex",
                flexDirection: "column",
                color: "white",
                fontSize: "12px",
                gap: "20px",
                marginTop: "15%",
              }}
            >
              {tabs.map((tab) => (
                <Typography
                  key={tab}
                  onClick={() => handleTab(tab.value)}
                  sx={{
                    color: activeTab === tab.value ? "yellow" : "white",
                    cursor: "pointer",
                    fontWeight: activeTab === tab.value ? "bold" : "normal",
                  }}
                >
                  {tab.display}
                </Typography>
              ))}
            </Box>
            <Box
              sx={{
                width: "140px",
                height: "47px",
                backgroundImage: `url(${btnBg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                margin: "5% 25%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/createQuest");
              }}
            >
              + create
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ width: "80%" }}>
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              gap: "3px",
              justifyContent: "space-between",
            }}
          >
            <Box style={{ display: "flex" }}>
              <Box
                sx={{
                  width: "550px",
                  height: "40px",
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

        {isHome && (
          <>
            <DashboardCards />
            <QuestHome />
          </>
        )}
        {isComments && <Comments />}
        {isLatestWorks && <LatestWorks />}
        {isCreateQuest && <CreateQuest />}
        {/*{isContests && <Contests />} */}
      </Box>
    </Box>
  );
};

export default Home;
