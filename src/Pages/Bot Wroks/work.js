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
import style from "../Bot Wroks/style.module.css";

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

        console.log("userData", userData);
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

  const Card = ({ data, handleClick, handleClickProfile, botWorks }) => {
    console.log("data0001", data);
    return (
      <>
        <Typography
          style={{
            fontSize: isMobile ? "24px" : "52px",
            textAlign: "center",
            margin: "10px",
          }}
        >
          Latest Works
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", width: "30%" }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                padding: "8px",
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "4px 0 0 4px",
              }}
            />
            <button
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderLeft: "none",
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "0 4px 4px 0",
                cursor: "pointer",
              }}
              onClick={() => {
                handleSearch();
              }}
            >
              Search
            </button>
          </div>
        </div>
        {isLoading && <Loader />}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            margin: "2% 2%",
          }}
        >
          {data.map((item, index) => {
            const workId = item.post_id;
            const currentRating = ratings[workId] ?? item.bot_stars;

            return (
              <div
                key={index}
                style={{
                  flex: isMobile
                    ? '"1 1 calc(100% / 2 - 21px)'
                    : "1 1 calc(100% / 5 - 21px)",
                  maxWidth: isMobile
                    ? "calc(100% / 2 - 16px)"
                    : "calc(100% / 5 - 16px)",
                  textAlign: "center",
                  height: isMobile ? "300px" : "400px",
                  width: isMobile ? "250px" : "350px",
                  border: "2px solid black",
                  boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  style={{ height: "80%", width: "100%", objectFit: "cover" }}
                  src={`${CDN_URL}/${
                    item.user_id ? item.user_id : item.userID
                  }/WORKS/IMAGES/medium/${
                    item.files[0].name ? item.files[0].name : item.filename
                  }`}
                ></img>

                <Box
                  style={{
                    display: "flex",
                    gap: "2px",
                  }}
                >
                  <Avatar
                    src={
                      item.defaultAvatar
                        ? `${CDN_URL}/APP/UserAvatars/${item.avatar}`
                        : `${CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
                    }
                    onClick={() => handleClickProfile(item.user_id, item)}
                    sx={{
                      height: isMobile ? 30 : 40,
                      width: isMobile ? 30 : 40,
                    }}
                  ></Avatar>
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "90%", 
                      display: "block",
                    }}
                  >
                    {item.firstname}
                  </Typography>
                </Box>
                <Rating
                  name="simple-controlled"
                  value={currentRating}
                  onChange={(event, newValue) => {
                    handleRating(newValue, item.post_id);
                  }}
                  style={{marginBottom: '5px'}}
                />
              </div>
            );
          })}
        </div>
      </>
    );
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
      console.log("post", post);
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

  console.log("data", data);
  return (
    <>
      <Card
        data={data}
        handleClick={handleClick}
        handleClickProfile={handleClickProfile}
      />
    </>
  );
};

export default Work;
