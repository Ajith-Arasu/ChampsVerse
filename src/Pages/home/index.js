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
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");

  const statsData = [
    { label: "Total Users", value: "50,000", nav: null },
    { label: "Total Works", value: "8,000", nav: "work" },
    { label: "Total Books", value: "10,000", nav: "books" },
    { label: "Total Achievements", value: "2,500", nav: "achievements" },
  ];

  const handlestats = (nav) => {
    if (nav !== null) {
      navigate("/nav");
    }
  };

  const tabs = [
    "Home",
    "Contests",
    "Comments",
    "Deleted User",
    "Deleted Post",
    "Latest Works",
    "Events",
  ];

  const [activeTab, setActiveTab] = useState("Home");

  const handleTab = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab.toLowerCase().replace(/\s+/g, "")}`);
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
                onClick={() => handleTab(tab)}
                sx={{
                  color: activeTab === tab ? "yellow" : "white",
                  cursor: "pointer",
                  fontWeight: activeTab === tab ? "bold" : "normal",
                }}
              >
                {tab}
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

        <Typography
          style={{
            fontSize: "32px",
            fontFamily: "Baloo2",
            fontWeight: 800,
            color: "white",
          }}
        >
          Dashboard
        </Typography>
        <Box style={{ display: "flex", gap: "10px" }}>
          {statsData.map((stat, index) => (
            <Box
              sx={{
                width: "220px", // Set appropriate width
                height: "152px", // Set appropriate height
                backgroundImage: `url(${menuCard})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                cursor: 'pointer'
              }}
              onClick={() => {
                handlestats(stat.nav);
              }}
            >
              <Box
                style={{
                  display: "flex",
                }}
              >
                <img
                  src={cardIcon}
                  style={{
                    marginTop: "30px",
                    marginLeft: "30px",
                    marginRight: 0,
                    marginBottom: 0,
                  }}
                ></img>
                <Typography
                  style={{
                    marginTop: "40px",
                    fontSize: "12px",
                    color: "white",
                    marginLeft: "15%",
                  }}
                >{`10% vs last Month`}</Typography>
              </Box>
              <Box sx={{ marginTop: "5%" }}>
                <Typography
                  style={{
                    marginLeft: "30px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "white",
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  style={{
                    marginLeft: "30px",
                    fontSize: "32px",
                    fontWeight: "800",
                    color: "white",
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <QuestHome />
      </Box>
    </Box>
  );
};

export default Home;
