import { useState, useEffect } from "react";
import ApiCall from "../API/api";
import { useLocation } from "react-router-dom";
import { Avatar, Box, Typography, useMediaQuery } from "@mui/material";
import viewIcon from "../../asserts/view-icon.png";
import heartIcon from "../../asserts/heart-icon.png";
import commentIcon from "../../asserts/comment-icon.png";
import Loader from "../Loader/loader";

const Profile = () => {
  const [postDetails, setPostDetails] = useState([]);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { userId } = location.state;
  const { getPostByUserId, getPost, getBadges, addBadges, getUserDetails } =
    ApiCall();
  const [userData, setUserData] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetchData();
  }, []);

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
        const userDetails = await getUserDetails(userId);
        console.log("userdetails", userDetails);
        setUserData(userDetails);
        let postIds = await getPostByUserId(userId);
        const ids = postIds.map((item) => item.post_id).join(",");
        let res = await getPost(ids);
        console.log("res", res.data);

        const formatData = transformedData(postIds);
        const badgesData = await getBadges(formatData);
        // const updatedPosts = appendBadgesToPosts(res.data, badgesData.data);
        // setData((prev) => [...prev, ...updatedPosts]);
        const reorderedPostData = res.data
          .map((feedItem) => {
            const post = res.data.find(
              (post) => post.post_id === feedItem.post_id
            );
            if (!post) return undefined;

            const badge = badgesData.data.find(
              (badge) => badge.post_id === post.post_id
            );

            return {
              ...post,
              ...(badge && { badges: badge }),
            };
          })
          .filter((post) => post !== undefined);

        console.log("reorderedPostData", reorderedPostData);
        setPostDetails(reorderedPostData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function calculateAge(dobStr) {
    const [day, month, year] = dobStr.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  return (
    <Box sx={{ margin: isMobile?"8% 0":"3% 0", marginLeft: "5%" }}>
      {userData.map((user) => {
        const age = calculateAge(user.dob);
        return (
          <Box key={user.user_id}>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Avatar
                src={
                  user.defaultAvatar
                    ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${user.avatar}`
                    : `${process.env.REACT_APP_CDN_URL}/${user.uid}/PROFILE/IMAGES/medium/${user.avatar}`
                }
                alt="Profile"
                sx={{ height: isMobile ? 74 : 106, width: isMobile ? 74 : 106 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  color: "white",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: isMobile ? "20px" : "28px",
                    fontWeight: 800,
                    fontFamily: "Baloo2",
                  }}
                >
                  {user.firstname}
                </Typography>
                {isMobile && (
                  <>
                    <Typography
                      sx={{
                        fontSize: isMobile ? "13px" : "19px",
                        fontWeight: 500,
                        fontFamily: "Baloo2",
                      }}
                    >{`@${user.handle}`}</Typography>
                    <Typography
                      sx={{
                        fontSize: isMobile ? "11px" : "19px",
                        fontWeight: 500,
                        fontFamily: "Baloo2",
                      }}
                    >
                      {user.email}
                    </Typography>
                  </>
                )}
                <Box
                  sx={{
                    display: "flex",
                    gap: isMobile ? "10px" : "30px",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    margin: "0 8%",
                  }}
                >
                  {!isMobile && (
                    <Typography
                      sx={{
                        fontSize: isMobile ? "13px" : "19px",
                        fontWeight: 500,
                        fontFamily: "Baloo2",
                      }}
                    >{`@${user.handle}`}</Typography>
                  )}

                  {!isMobile && (
                    <Typography
                      sx={{
                        fontSize: isMobile ? "11px" : "19px",
                        fontWeight: 500,
                        fontFamily: "Baloo2",
                      }}
                    >
                      {user.email}
                    </Typography>
                  )}

                  <Typography
                    sx={{
                      fontSize: isMobile ? "11px" : "19px",
                      fontWeight: 500,
                      fontFamily: "Baloo2",
                    }}
                  >
                    {user.gender === 1 ? "Male" : "Female"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: isMobile ? "11px" : "19px",
                      fontWeight: 500,
                      fontFamily: "Baloo2",
                    }}
                  >
                    {age}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: isMobile ? "11px" : "19px",
                      fontWeight: 500,
                      fontFamily: "Baloo2",
                    }}
                  >
                    {user.dob}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: isMobile ? "10px" : "16px",
                    fontWeight: 400,
                    fontFamily: "Baloo2",
                    width: "100%",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {user.bio}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
      <Box sx={{ margin: "3% 0" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "2%",
          }}
        >
          <Typography
            sx={{
              fontSize: isMobile?"18px":"22px",
              fontWeight: 800,
              fontFamily: "Baloo2",
              color: "white",
            }}
          >
            Works
          </Typography>
          <Typography
            sx={{
              fontSize: isMobile?"8px":"10px",
              fontWeight: 400,
              fontFamily: "Baloo2",
              color: "white",
            }}
          >
            View All
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            flexWrap: "nowrap",
            overflowX: "auto",
            whiteSpace: "nowrap",
            width: "100%",
            marginTop: "2%",
          }}
        >
          {postDetails.map((item, index) => (
            <div
              key={index}
              style={{
                flexShrink: 0,
                textAlign: "center",
                height: isMobile ? "160px" : "208px",
                width: isMobile?'180px':"201px",
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
          ))}
        </Box>
      </Box>
      <Box>
        <Typography>Books</Typography>
      </Box>
    </Box>
  );
};
export default Profile;
