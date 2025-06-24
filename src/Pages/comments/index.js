import { Typography, Box, Avatar, Button } from "@mui/material";
import { useEffect, useState } from "react";
import ApiCall from "../API/api";
import CommentBg from "../../asserts/commentBg.png";
import approveBtn from "../../asserts/approve.png";
import rejectBtn from "../../asserts/reject.png";
import tabBtn from "../../asserts/tabSwitch.png";

const Comments = () => {
  const { getCommentsList, approveComments } = ApiCall();
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [data, setData] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [checkedItems, setCheckedItems] = useState([]);
  const [disable, setDisable] = useState(false);
  const [selectedType, setSelectedType] = useState("unapproved");

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
      let result = await getCommentsList(type, pageKey);
      setData((prev) => [...prev, ...result.data]);
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
    <Box sx={{ margin: "0 0", overflow: "hidden" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <Typography
            sx={{
              fontSize: "32px",
              fontFamily: "Baloo2",
              marginTop: "6px",
              color: "white",
            }}
          >
            Pending Comments{" "}
            <span sx={{ fontSize: "24px", fontFamily: "Baloo2" }}>(23)</span>
          </Typography>
          <Button
            sx={{
              backgroundImage:
                selectedType === "unapproved" ? `url(${tabBtn})` : "none",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "133px",
              height: "71px",
              color: "white",
              fontFamily: "Baloo2",
              fontSize: "18px",
              textTransform: "none",
              boxShadow: "none",
              cursor: "pointer",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
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
              width: "133px",
              height: "71px",
              color: "white",
              fontFamily: "Baloo2",
              fontSize: "18px", // Optional: Customize text size
              textTransform: "none", // Keeps the label as-is (no uppercase)
              boxShadow: "none", // Remove default MUI shadow
              cursor: "pointer",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => handleTab("approved")}
          >
            Approved
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          <Button onClick={() => handleApprove(1)}>
            <img src={approveBtn}></img>
          </Button>
          <Button onClick={() => handleApprove(0)}>
            <img src={rejectBtn}></img>
          </Button>
        </Box>
      </Box>

      {data.map((item, index) => (
        <Box
          sx={{
            width: "95%",
            height: "54px",
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
            margin: "20px",
            backgroundColor: colorMap[item.apprv_sts],
          }}
        >
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Box
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
              onClick={() => handleSelectItem(item.comment_id)}
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
            <Typography color="white">{item.text}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginRight: "5%",
            }}
          >
            <Avatar sx={{ width: "36px", height: "36px" }} />
            <Typography color="white">Rubashree</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
export default Comments;
