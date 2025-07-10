import { Radio, Typography, useMediaQuery, Box, Button } from "@mui/material";
import React from "react";
import ApiCall from "../API/api";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Loader from "../Loader/loader";

const Events = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { getLatestActivity, getUserDetails } = ApiCall();
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pagekey, setPagekey] = useState("");
  const [data, setData] = useState([]);

  const ACTION_MESSAGES = {
    MCON_SUB: { name: "Micro-Contest submitted", color: "#8BC34A" },
    POST_CRT: { name: "Work Created", color: "#FFF59D" },
    COMMENT: { name: "Commented", color: "#00BCD4" },
    CLUB_ASSOC: { name: "Unlocked a Club", color: "#607D8B" },
    LIKE: { name: "Liked", color: "#EF5350" },
    BOOK_CRT: { name: "Book Created", color: "#FFE082" },
    USER_CRT: { name: "User Created", color: "#FFCC80" },
    POST_DEDI: { name: "Dedicated a post", color: "#BCAAA4" },
    REACT_L1: { name: "Reacted", color: "#F48FB1" },
    REACT_L2: { name: "Reacted", color: "#F48FB1" },
    REACT_L3: { name: "Reacted", color: "#F48FB1" },
    REACT_L4: { name: "Reacted", color: "#F48FB1" },
    CON_SUB: { name: "contest Submitted", color: "#4CAF50" },
    LOGIN: { name: "Loggend In", color: "green" },
    LOGOUT: { name: "Logged out", color: "grey" },
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();
  const currentMonthName = months[date.getMonth()];
  const currentYear = new Date().getFullYear();

  const prevMonthIndex = (date.getMonth() - 1 + 12) % 12;
  const previousMonthName = months[prevMonthIndex];

  const [selectedType, setSelectedType] = useState(currentMonthName);

  const selectedMonthIndex = months.indexOf(selectedType);
  const selectedMonthFormatted = `M${selectedMonthIndex + 1}`;
  const month = `${currentYear}-${selectedMonthFormatted}`;

  const changeMonth = (event) => {
    setSelectedType(event.target.value);
    setData([]);
    setPagekey("");
  };

  const fetchData = async () => {
    if (isLoading || pagekey === null) return;
    setIsLoading(true);
    try {
      if (pagekey !== null) {
        const result = await getLatestActivity(pagekey, month);
        const userIds = result.data.map((item) => item.user_id).join(",");
        const userData = await getUserDetails(userIds);
        let userMap = {};

        if (userData && Array.isArray(userData)) {
          userMap = userData.reduce((map, user) => {
            map[user.uid] = user;
            return map;
          }, {});
        }
        // Append handle and firstname to activity
        const updatedActivity = result.data.map((act) => {
          const user = userMap[act.user_id];
          if (user) {
            return {
              ...act,
              handle: user.handle,
              firstname: user.firstname,
            };
          }
          return act;
        });

        if (result?.page) {
          setPagekey(result?.page);
        } else {
          setPagekey(null);
        }

        setData((prev) => [...prev, ...updatedActivity]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [nextPage, selectedType]);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;

    if (
      scrollTop + windowHeight >= documentHeight - 5 &&
      !isLoading &&
      pagekey !== null
    ) {
      setNextPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleViewWorks = () => {};

  return (
    <Box sx={{ margin: "3%" }}>
      <Typography
        style={{
          fontSize: isMobile ? "21px" : "32px",
          margin: isMobile ? "5% 2%" : "3% 0",
          color: "white",
        }}
      >
        Latest Events
      </Typography>
      {isLoading && <Loader></Loader>}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "2%",
        }}
      >
        {data.map((item) => (
          <Box
            sx={{
              boxShadow: `
  inset 0 0 30px rgba(225, 225, 225, 0.5),
  inset 0 0 40px rgba(225, 225, 225, 0.3)
`,
              width: "202px",
              height: isMobile ? "140px" : "157px",
              borderRadius: "40px",
              flex: isMobile
                ? "flex: 1 1 calc(100% / 2 - 10px) "
                : "1 1 calc(100% / 6 - 10px)",
              maxWidth: isMobile
                ? "calc(100% / 2 - 16px)"
                : "calc(100% / 6 - 10px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "5px",
              backgroundColor: ACTION_MESSAGES[item.act_type]?.color,
            }}
          >
            <Typography
              style={{
                textAlign: "center",
                color: "white",
                fontSize: "17px",
                fontFamily: "Baloo2",
                fontWeight: 800,
                marginTop: "5%",
              }}
            >
              {`${item.firstname} `}
            </Typography>
            <Typography
              style={{
                textAlign: "center",
                background:
                  "linear-gradient(232.05deg, #FFDD01 19.84%, #FFB82A 92.22%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                fontFamily: "Baloo2",
                fontSize: "17px",
              }}
            >
              {ACTION_MESSAGES[item.act_type]?.name}
            </Typography>
            <a
              style={{
                mt: "5%",
                backdropFilter: "blur(80px)",
                backgroundColor: "tranparent",
                borderRadius: "20px",
                color: "white",
                px: 3,
                py: 1,
                boxShadow: `
      inset 0 0 15px rgba(255, 255, 255, 0.1),
      inset 0 0 25px rgba(255, 255, 255, 0.05)
    `,
                padding: "5px",
                fontFamily: "Baloo2",
                fontSize: "10px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
              href={`${process.env.REACT_APP_PUBLIC_URL}/work/${item.work_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Works
            </a>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default Events;
