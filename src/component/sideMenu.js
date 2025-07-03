import {
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import menuCard from "../asserts/menu-card.png";
import cardIcon from "../asserts/cardIcon.png";
const DashboardCards = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const statsData = [
    { label: "Total Users", value: "50,000", nav: null },
    { label: "Total Works", value: "8,000", nav: "works" },
    { label: "Total Books", value: "10,000", nav: "books" },
    { label: "Total Achievements", value: "2,500", nav: "achievements" },
  ];

  const handlestats = (nav) => {
    console.log("nav", nav);
    if (nav !== null) {
      navigate(`/${nav}`);
    }
  };
  return (
    <Box>
      <Typography
        style={{
          fontSize: isMobile? "19px":"32px",
          fontFamily: "Baloo2",
          fontWeight: 800,
          color: "white",
          margin: isMobile && '8% 3%'
        }}
      >
        Dashboard
      </Typography>
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap", // allow items to wrap to next row
          gap: isMobile ? "5px" : "10px",
          justifyContent: isMobile ? "center" : "flex-start",
          margin: "0 10px",
          width: isMobile && "120%",
        }}
      >
        {statsData.map((stat, index) => (
          <Box
            key={index}
            sx={{
              width: isMobile ? "220px" : "220px",
              maxWidth: isMobile ? "calc(100% / 2 - 5px)" : "220px",
              height: isMobile? "130px":"152px",
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
                  height:isMobile && '26px',
                  width: isMobile && '26px'
                }}
              />
              <Typography
                style={{
                  marginTop: "40px",
                  fontSize:isMobile? '8px': "12px",
                  color: "white",
                  marginLeft: "15%",
                }}
              >{`10% vs last Month`}</Typography>
            </Box>
            <Box sx={{ marginTop: "5%" }}>
              <Typography
                style={{
                  marginLeft: "30px",
                  fontSize: isMobile ? "8px":"12px",
                  fontWeight: "500",
                  color: "white",
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                style={{
                  marginLeft: "30px",
                  fontSize: isMobile ? "20px":"32px",
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
