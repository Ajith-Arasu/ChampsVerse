import { Typography, Box, Avatar, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import ApiCall from "../API/api";
import viewIcon from "../../asserts/view-icon.png";
import heartIcon from "../../asserts/heart-icon.png";
import commentIcon from "../../asserts/comment-icon.png";
import Loader from "../Loader/loader";
import { useNavigate } from "react-router-dom";

const Works = () => {
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const {
    data: feedData,
    getPost,
    addBadges,
    getBadges,
    getUserDetails,
    addWinnersCategory,
    ApproveQuestWork,
  } = ApiCall();

  const transformedData = (data) => {
    const transformed = {
      ids: data.map((item) => {
        return {
          user_id: item.user_id,
          post_id: item.post_id,
        };
      }),
    };
    return transformed;
  };

  const fetchData = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        let userData;
        let res;
        let result;

        result = await feedData(pageKey, 20);
        const ids = result.data.map((item) => item.post_id).join(",");
        const userIds = result.data.map((item) => item.user_id).join(",");
        userData = await getUserDetails(userIds);

        if (result?.page) {
          setPageKey(result?.page);
        } else {
          setPageKey(null);
        }
        res = await getPost(ids);
        const formatData = transformedData(result.data);
        const badgesData = await getBadges(formatData);

        const reorderedPostData = result.data
          .map((feedItem) => {
            const post = res.data.find(
              (post) => post.post_id === feedItem.post_id
            );
            if (!post) return undefined;

            const user = userData.find((user) => user.uid === post.user_id);
            const badge = badgesData.data.find(
              (badge) => badge.post_id === post.post_id
            );

            return {
              ...post,
              ...(user && {
                firstname: user.firstname,
                defaultAvatar: user.defaultAvatar,
                avatar: user.avatar,
              }),
              ...(badge && { badges: badge }),
            };
          })
          .filter((post) => post !== undefined);

        setData((prev) => [...prev, ...reorderedPostData]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
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
    fetchData();
  }, [nextPage]);

  return (
    <div style={{ marginLeft: "5%", marginTop: isMobile ? "10%" : "3%" }}>
      <Typography
        style={{
          fontSize: isMobile ? "21px" : "32px",
          fontWeight: 800,
          color: "white",
        }}
      >
        Works ({data.length})
      </Typography>
      {isLoading && <Loader />}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginTop: "2%",
        }}
      >
        {data.map((item, index) => {
          const avtimg = item.defaultAvatar
            ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${item.avatar}`
            : `${process.env.REACT_APP_CDN_URL}/${item.user_id}/PROFILE/IMAGES/medium/${item.avatar}`;
          return (
            <div
              key={index}
              style={{
                flex: isMobile
                  ? "1 1 calc(50% - 10px)"
                  : "1 1 calc(100% / 6 - 21px)",
                maxWidth: isMobile
                  ? "calc(50% - 10px)"
                  : "calc(100% / 6 - 16px)",
                textAlign: "center",
                height: isMobile ? "160px" : "208px",
                width: "201px",
                boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "20px",
                position: "relative",
                marginBottom: "2%",
              }}
            >
              <img
                style={{
                  height: "80%",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "20px 20px 0 0",
                }}
                src={`${process.env.REACT_APP_CDN_URL}/${
                  item.user_id ? item.user_id : item.userID
                }/WORKS/IMAGES/medium/${
                  item.files[0].name ? item.files[0].name : item.filename
                }`}
              ></img>

              <Box
                sx={{
                  position: "absolute",
                  top: "5px",
                  display: "flex",
                  gap: "5px",
                  marginLeft: "5px",
                  boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
                  width: "97%",
                  cursor: 'pointer'
                }}
                onClick={() => {
                  navigate("/profile", { state: { userId: item.user_id } });
                }}
              >
                <Avatar
                  src={
                    item.defaultAvatar
                      ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${item.avatar}`
                      : `${process.env.REACT_APP_CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
                  }
                  sx={{
                    height: isMobile ? 20 : 30,
                    width: isMobile ? 20 : 30,
                  }}
                ></Avatar>
                <Typography sx={{ fontSize: isMobile && "12px" }}>
                  {item.firstname}
                </Typography>
              </Box>
              <Box
                style={{
                  backdropFilter: "blur(180px)",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: "20%",
                  marginTop: "-5%",
                  borderRadius: " 0 0 20px 20px",
                }}
              >
                <Box sx={{ display: "flex", gap: "5px" }}>
                  <img
                    src={viewIcon}
                    style={{ width: isMobile ? "20px" : "25px" }}
                  ></img>
                  <Typography sx={{ fontSize: isMobile && "12px" }}>
                    {item.badges.views}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: "5px" }}>
                  <img
                    src={heartIcon}
                    style={{ width: isMobile ? "20px" : "25px" }}
                  ></img>
                  <Typography sx={{ fontSize: isMobile && "12px" }}>
                    {item.badges.likes}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: "5px" }}>
                  <img
                    src={commentIcon}
                    style={{ width: isMobile ? "20px" : "25px" }}
                  ></img>
                  <Typography sx={{ fontSize: isMobile && "12px" }}>
                    {item.badges.comments}
                  </Typography>
                </Box>
              </Box>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Works;
