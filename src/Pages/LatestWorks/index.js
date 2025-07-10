import { useEffect, useState } from "react";
import ApiCall from "../API/api";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/loader";
import {
  Box,
  Avatar,
  Rating,
  useMediaQuery,
  Typography,
  TextField,
} from "@mui/material";

const Work = ({ setUserDetails, setProfilePic }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reactions, setReactions] = useState({});
  const [value, setValue] = useState(0);
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  
  const {
    data: feedData,
    getPost,
    addBadges,
    getBadges,
    getUserDetails,
    sendRating,
  } = ApiCall();
  const [count, setCount] = useState(20);
  const [refresh, setRefreshPage] = useState(false);
  const [ratings, setRatings] = useState({});
  const isMobile = useMediaQuery("(max-width:600px)");
  const [searchText, setSearchText] = useState("");

  const handleRating = async (value, workid) => {
    setRatings((prev) => ({ ...prev, [workid]: value }));

    const body = {
      ids: [
        {
          work_id: workid,
          work_type: "POST",
          star_rating: value,
        },
      ],
    };

    const response = await sendRating(body);

    if (response.statusCode === 200) {
      fetchData();
    } else {
      console.error("Failed to submit rating");
    }
  };

  const fetchData = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);

    try {
      if (pageKey !== null) {
        let result = await feedData(pageKey, count);
        const ids = result.data.map((item) => item.post_id).join(",");
        const userIds = result.data.map((item) => item.user_id).join(",");
        const userData = await getUserDetails(userIds);
        if (result?.page) {
          setPageKey(result?.page);
        } else {
          setPageKey(null);
        }

        let res = await getPost(ids);
        const formatData = transformedData(result.data);
        const badgesData = await getBadges(formatData);
        const updatedPosts = appendBadgesToPosts(
          res.data,
          badgesData.data,
          userData
        );
        const reorderedPostData = result.data
          .map((feedItem) =>
            updatedPosts.find((post) => post.post_id === feedItem.post_id)
          )
          .filter((post) => post !== undefined);
        setData((prev) => [...prev, ...reorderedPostData]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setData([]);
    const post = await getPost(searchText);
    setData(post.data);
  };

  const appendBadgesToPosts = (posts, badges, userData) => {
    return posts.map((post) => {
      const matchedBadge = badges.find(
        (badge) => badge.post_id === post.post_id
      );
      if (matchedBadge) {
        if (matchedBadge.badge) {
          post.badge = matchedBadge.badge;
        } else {
          post.badge = null;
        }
      }
      const foundItem = userData.find((item) => item.uid === post.user_id);
      if (foundItem) {
        post.avatar = foundItem.avatar;
        post.defaultAvatar = foundItem.defaultAvatar;
        post.firstname = foundItem.firstname;
      }
      return post;
    });
  };

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

  useEffect(() => {
    fetchData();
  }, [nextPage, value]);

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

  const handleClick = async (index, type) => {
    const resultBD = await addBadges(
      data[index].user_id,
      data[index].post_id,
      type,
      data[index].files[0].isPortrait
    );
    if (resultBD.statusCode === 200) {
      let requestbody = {
        ids: [
          {
            user_id: data[index].user_id,
            post_id: data[index].post_id,
          },
        ],
      };
      let singleItemBadge = await getBadges(requestbody);
      const badgeMap = singleItemBadge.data.reduce((acc, item) => {
        acc[item.post_id] = item.badge;
        return acc;
      }, {});

      const updatedData = data.map((item) => {
        if (badgeMap[item.post_id]) {
          return {
            ...item,
            badge: badgeMap[item.post_id],
          };
        }
        return item;
      });
      setData(updatedData);
    }
  };

  const handleClickProfile = async (userId) => {
    try {
      const userDetails = await getUserDetails(userId);
      setUserDetails(userDetails);
      setProfilePic(userDetails[0].avatar);
      navigate("/profile", { state: { userDetails } });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          marginLeft: isMobile ? "5%" : "2%",
          marginTop: isMobile ? "10%" : "3%",
        }}
      >
        <Typography
          style={{
            fontSize: isMobile ? "21px" : "32px",
            fontWeight: 800,
            color: "white",
          }}
        >
          Latest Works
        </Typography>
        {isLoading && <Loader />}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? "5px" : "15px",
            marginTop: "2%",
            width: isMobile ? "100vw" : "100%",
          }}
        >
          {data.map((item, index) => {
            const avtimg = item.defaultAvatar
              ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${item.avatar}`
              : `${process.env.REACT_APP_CDN_URL}/${item.user_id}/PROFILE/IMAGES/medium/${item.avatar}`;
            const workId = item.post_id;
            const currentRating = ratings[workId] ?? item.bot_stars;
            return (
              <div
                key={index}
                style={{
                  flex: isMobile
                    ? "1 1 calc(50% - 10px)"
                    : "1 1 calc(100% / 5 - 21px)",
                  maxWidth: isMobile
                    ? "calc(50% - 10px)"
                    : "calc(100% / 5 - 16px)",
                  textAlign: "center",
                  height: isMobile ? "180px" : "208px",
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
                  <Rating
                    name="simple-controlled"
                    value={currentRating}
                    onChange={(event, newValue) => {
                      handleRating(newValue, item.post_id);
                    }}
                    style={{ marginBottom: "5px" }}
                  />
                </Box>
              </div>
            );
          })}
        </div>
      </div>
    </Box>
  );
};

export default Work;
