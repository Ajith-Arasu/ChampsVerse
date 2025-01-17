import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import style from "../StorageConsumption/style.module.css";
import apiCall from "../API/api";
import { useEffect, useState } from "react";

const StorageConsumption = () => {
  const [pageKey, setPageKey] = useState("");
  const { getStorageConsumption, getUserDetails } = apiCall();
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [data, setData] = useState([]);
  const maxStorageInBytes = 1024 * 1024 * 1024;

  const getData = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);

    try {
      if (pageKey !== null) {
        const result = await getStorageConsumption(pageKey);
        const userIds = result.data.map((item) => item.user_id).join(",");
        const userData = await getUserDetails(userIds);

        const StorageData = formatData(result.data, userData);
        setData((prev) => [...prev, ...StorageData]);
        
        if (result?.page) {
          setPageKey(result?.page);
        } else {
          setPageKey(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatData = (result, userData) => {
    return result.map((item) => {
      const userDetail = userData.find((user) => user.uid === item.user_id);
      return {
        username: userDetail?.firstname || "Unknown",
        storage: item ? item.size_in_mb : 0,
      };
    });
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;

    if (
      scrollTop + windowHeight >= documentHeight - 5 &&
      !isLoading &&
      pageKey !== null
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

  useEffect(() => {
    getData();
  }, [nextPage]); // Fetch data when nextPage changes

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {data.map((item, index) => {
        const progressValue = (item.storage * 1024 * 1024) / maxStorageInBytes * 100;
        return (
          <Box className={style["bar"]} key={index}>
            <Box className={style["bar-span"]}>
              <LinearProgress
                variant="determinate"
                color="inherit"
                value={progressValue}
                sx={{
                  height: "52px",
                  backgroundColor: "#E8D5FF", // unused bar color
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#7E31E1", // used bar color
                  },
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 10px",
                  color: "white",
                }}
              >
                <Typography variant="h6">{item.username}</Typography>
                <Typography variant="h5">{`${item.storage}Mb / 1GB`}</Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default StorageConsumption;
