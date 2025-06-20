import { Typography, useMediaQuery } from "@mui/material";
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

  console.log("data", data);

  return (
    <Box>
      {data.map((item, index) => {
        const progressValue = (item.storage * 1024 * 1024) / maxStorageInBytes * 100;
        console.log("progressValue", progressValue)
        return (
          <Box
            key={index}
            style={{
              position: "relative",
              display: "inline-block",
              margin: "0 5%",
            }}
          >
            {/* The image */}
            <img
              src={storageContainer}
              style={{
                width: "100%",
                objectFit: "cover",
                display: "block",
              }}
              alt="Storage"
            />

            {/* Overlayed header on top of the image */}
            <Box
              style={{
                position: "absolute",
                width: `${progressValue}%`,
                top: "1px",
                left: 0,
                right: 0,
                padding: "8px 16px",
                height: "65px",
                display: "flex",
                borderRadius: "14px 0 0 14px",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(255, 255, 0, 0.85)",
              }}
            >
              <Typography>{item.username}</Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                left: "90%",
                width: "100%",
                right: "10px",
                display: "flex",
                borderRadius: "14px 0 0 14px",
                alignItems: "center",
                justifyContent: "space-between",
                top: "30%",
              }}
            >
              <Typography>{`1GB`}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
export default UsersStorageConsumption;
