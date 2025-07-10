import { Typography, useMediaQuery, LinearProgress } from "@mui/material";
import Box from "@mui/material/Box";
import storageContainer from "../../asserts/userStoragebg.png";
import ApiCall from "../API/api";
import { useEffect, useState } from "react";

const UsersStorageConsumption = () => {
  const [pageKey, setPageKey] = useState("");
  const { getStorageConsumption, getUserDetails } = ApiCall();
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [data, setData] = useState([]);
  const maxStorageInBytes = 1024 * 1024 * 1024;
  const isMobile = useMediaQuery("(max-width:600px)");

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
  }, [nextPage]);


  return (
    <Box sx={{marginTop: isMobile? "10%": "0"}}>
      <Typography
        sx={{
          fontSize: isMobile? "21px":"32px",
          fontWeight: 800,
          fontFamily: "Baloo2",
          color: 'white',
          marginLeft: isMobile?"4%":'2%'
        }}
      >
        All Users (1245)
      </Typography>
      {data.map((item, index) => {
        const progressValue =
          ((item.storage * 1024 * 1024) / maxStorageInBytes) * 100;

        return (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: "95%",
              height: isMobile?"40px":"55px",
              margin: isMobile?"5px auto":"20px auto",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {/* Background LinearProgress */}
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "transparent", // transparent track
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "yellow", // filled/progressed part
                },
              }}
            />

            {/* Foreground content with box shadow */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                boxShadow: `
              inset 0 0 5px rgba(255, 255, 255, 0.2),
              inset 0 0 10px rgba(255, 255, 255, 0.3),
              inset 0 0 15px rgba(255, 255, 255, 0.4),
              inset 0 0 20px rgba(255, 255, 255, 0.5)
            `,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                position: "relative",
                zIndex: 1,
                color: "white",
              }}
            >
              <Typography
                sx={{
                  fontSize: isMobile?"12px":"20px",
                  fontWeight: 800,
                  fontFamily: "Baloo2",
                }}
              >{`${index + 1}) ${item.username}`}</Typography>
              <Typography
                sx={{
                  fontSize: isMobile?"10px":"20px",
                  fontWeight: 800,
                  fontFamily: "Baloo2",
                }}
              >{`${item.storage}MB / 1GB`}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
export default UsersStorageConsumption;
