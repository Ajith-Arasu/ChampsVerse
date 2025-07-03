import { Typography, Box, Avatar, Button, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import ApiCall from "../API/api";
import approveBtn from "../../asserts/approve.png";
import rejectBtn from "../../asserts/reject.png";
import tabBtn from "../../asserts/tabSwitch.png";

const Comments = () => {
  const { getCommentsList, approveComments, getUserDetails } = ApiCall();
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [data, setData] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [checkedItems, setCheckedItems] = useState([]);
  const [disable, setDisable] = useState(false);
  const [selectedType, setSelectedType] = useState("unapproved");
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleTab = (tab) => {
    setSelectedType(tab);
  };

  const handleSelectItem = (commentId) => {
    setCheckedItems((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const fetchData = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    const type = selectedType === "unapproved" ? 0 : 1;
    try {
      const result = await getCommentsList(type, pageKey);
      const userIds = result.data.map((item) => item.user_id).join(",");
      const userData = await getUserDetails(userIds);
      console.log("userData", userData);
      const appendPost = result.data.map((item) => {
        const user = userData.find((user) => user.uid === item.user_id);
        return {
          ...item,
          ...(user && {
            firstname: user.firstname,
            defaultAvatar: user.defaultAvatar,
            avatar: user.avatar,
          }),
        };
      });
      console.log("appendPost", appendPost);
      setData((prev) => [...prev, ...appendPost]);
      if (result?.page) {
        setPageKey(result?.page);
      } else {
        setPageKey(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (state) => {
    try {
      setDisable(true);
      const ids = checkedItems.join(",");
      const type = "post";
      const response = await approveComments(ids, state, type);

      setCheckedItems([]);

      setPageKey("");
      setNextPage(1);
      setData([]);

      setTimeout(() => {
        fetchData();
      }, 0);
    } catch (error) {
      console.error("Error during approval:", error);
    } finally {
      setDisable(false);
    }
  };

  const colorMap = {
    0: "#BB00BB",
    1: "#4CAF50",
    2: "#009688",
    3: "#FF9800",
    4: "#F44336",
    5: "#C62828",
    6: "#8E24AA",
    7: "#6A1B9A",
    8: "#D3D3D3",
    9: "grey",
  };

  const changeCommentType = (event) => {
    setSelectedType(event.target.value);
    setData([]);
    setPageKey("");
  };

  useEffect(() => {
    fetchData();
  }, [nextPage, selectedType, checkedItems]);

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

  return (
    <Box sx={{ width: "100vw", overflowX: "hidden", px: isMobile ? 1 : 2, marginTop: isMobile && '10%' }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontSize: isMobile ? "19px" : "32px",
              fontFamily: "Baloo2",
              color: "white",
              mt: "6px",
            }}
          >
            Comments{" "}
            <span style={{ fontSize: isMobile ? "15px" : "24px" }}>(23)</span>
          </Typography>
          <Button
            sx={{
              backgroundImage:
                selectedType === "unapproved" ? `url(${tabBtn})` : "none",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: isMobile ? "80px" : "133px",
              height: isMobile ? "45px" : "71px",
              color: "white",
              fontFamily: "Baloo2",
              fontSize: isMobile ? "12px" : "18px",
              textTransform: "none",
              boxShadow: "none",
              cursor: "pointer",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              mt:isMobile?'3%': '3%'
            }}
            onClick={() => handleTab("unapproved")}
          >
            Pending
          </Button>
          <Button
            sx={{
              backgroundImage:
                selectedType === "approved" ? `url(${tabBtn})` : "none",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: isMobile ? "85px" : "133px",
              height: isMobile ? "45px" : "71px",
              color: "white",
              fontFamily: "Baloo2",
              fontSize: isMobile ? "12px" : "18px",
              textTransform: "none",
              boxShadow: "none",
              cursor: "pointer",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              mt:isMobile?'3%': '3%'
            }}
            onClick={() => handleTab("approved")}
          >
            Approved
          </Button>
        </Box>
        {!isMobile && (
          <Box sx={{ display: "flex", gap: "5px" }}>
            <Button onClick={() => handleApprove(1)}>
              <img src={approveBtn} alt="approve" />
            </Button>
            <Button onClick={() => handleApprove(0)}>
              <img src={rejectBtn} alt="reject" />
            </Button>
          </Box>
        )}
      </Box>

      {data.map((item, index) => (
        <Box
          key={item.comment_id}
          sx={{
            width: "100%",
            px: isMobile ? 1 : 2,
            py: 1,
            my: 2,
            borderRadius: "10px",
            backgroundColor: colorMap[item.apprv_sts],
            display: "flex",
            alignItems: "center",
            boxShadow: `
          inset 0 0 5px rgba(255, 255, 255, 0.2),
          inset 0 0 10px rgba(255, 255, 255, 0.3),
          inset 0 0 15px rgba(255, 255, 255, 0.4),
          inset 0 0 20px rgba(255, 255, 255, 0.5)
        `,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Box
              onClick={() => handleSelectItem(item.comment_id)}
              sx={{
                width: "25px",
                height: "25px",
                border: "2.7px solid rgba(31, 29, 58, 0.4)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  background: checkedItems.includes(item.comment_id)
                    ? "linear-gradient(232.05deg, #FFDD01 19.84%, #FFB82A 92.22%)"
                    : "transparent",
                }}
              />
            </Box>
            <Typography color="white" sx={{ flex: 1 }}>
              {item.text}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: "100px",
            }}
          >
            <Avatar
              sx={{ width: "36px", height: "36px" }}
              src={
                item.defaultAvatar
                  ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${item.avatar}`
                  : `${process.env.REACT_APP_CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
              }
            />
            <Typography
              color="white"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 120,
              }}
            >
              {item.firstname}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
export default Comments;
