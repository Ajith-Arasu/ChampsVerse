import { Radio, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import apiCall from "../API/api";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Events = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { getLatestActivity, getUserDetails } = apiCall();
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
    setPagekey('')
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
    console.log('useEffect called')
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

  return (
    <div>
      <Typography
        style={{ fontSize: "48px", textAlign: "center", margin: "2% 0" }}
      >
        Latest Events
      </Typography>
      <div style={{ margin: "0 5%" }}>
        <label>
          <input
            type="radio"
            value={previousMonthName}
            checked={selectedType === previousMonthName}
            onChange={changeMonth}
          ></input>
          {previousMonthName}
        </label>
        <label style={{ padding: "5px" }}>
          <input
            type="radio"
            value={currentMonthName}
            checked={selectedType === currentMonthName}
            onChange={changeMonth}
          ></input>
          {currentMonthName}
        </label>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "28px" : "12px",
          margin: isMobile ? "0 10%" : "5% 5%",
        }}
      >
        {data.map((item) => (
          <div
            style={{
              flex: isMobile
                ? "flex: 1 1 calc(100% / 2 - 10px) "
                : "1 1 calc(100% / 6 - 21px)",
              maxWidth: isMobile
                ? "calc(100% / 2 - 12px)"
                : "calc(100% / 6 - 12px)",
              textAlign: "center",
              height: isMobile ? "100px" : "120px",
              width: isMobile ? "400px" : "120px",
              backgroundColor: ACTION_MESSAGES[item.act_type]?.color,
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography style={{ textAlign: "center", color: "black" }}>
              {`${item.firstname} `}
            </Typography>
            <Typography style={{ textAlign: "center", color: "black" }}>
              {ACTION_MESSAGES[item.act_type]?.name}
            </Typography>

            <a
              href={`https://champsverse.com/work/${item.work_id}`}
              style={{ color: "black" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Works
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Events;
