import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import menuCard from "../asserts/menu-card.png";
import cardIcon from "../asserts/cardIcon.png";
const DashboardCards = () => {
  const navigate = useNavigate();
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
  return (
    <Box>
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
              cursor: "pointer",
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
    </Box>
  );
};
export default DashboardCards;
