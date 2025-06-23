import { Box, TextField, Button, Typography } from "@mui/material";
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
import DashboardCards from "../../component/sideMenu";
import LatestWorks from "../LatestWorks/index";

const Home = () => {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");
  const location = useLocation();
  const isLatestWorks = location.pathname === "/latestworks";
  const isHome = location.pathname === "/home";

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
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ width: "25%" }}>
        <Box
          sx={{
            width: "125%", // Set appropriate width
            height: "750px", // Set appropriate height
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
            sx={{ width: "200px", marginTop: "5%", marginLeft: "15%" }}
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
        </Box>
      </Box>
      <Box sx={{ width: "80%" }}>
        <Box
          sx={{ display: "flex", gap: "3px", justifyContent: "space-between" }}
        >
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

        {isHome && (
          <>
            <DashboardCards />
            <QuestHome />
          </>
        )}

        {isLatestWorks && <LatestWorks />}
      </Box>
    </Box>
  );
};

export default Home;
