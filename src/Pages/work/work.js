import { useEffect, useState } from "react";
import ApiCall from "../API/api";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../card/index";
import Loader from "../Loader/loader";

const Work = ({ setUserDetails, setProfilePic, entriesData, contestId }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reactions, setReactions] = useState({});
  const [searchText, setSearchText] = useState("");
  const {
    data: feedData,
    getPost,
    addBadges,
    getBadges,
    getUserDetails,
    addWinnersCategory,
    ApproveQuestWork,
  } = ApiCall();
  const [count, setCount] = useState(20);
  const [refresh, setRefreshPage] = useState(false);
  const location = useLocation();
  const [entry, setEntry] = useState([]);
  const isQuestPage = location.pathname === "/quests-Works";

  const handleSearch = async () => {
    setData([]);
    const post = await getPost(searchText);
    setData(post.data);
  };

  const fetchData = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        let userData;
        let res;
        let result;
        if (!entriesData) {
          result = await feedData(pageKey, count);
          const ids = result.data.map((item) => item.post_id).join(",");
          const userIds = result.data.map((item) => item.user_id).join(",");
          userData = await getUserDetails(userIds);
          if (result?.page) {
            setPageKey(result?.page);
          } else {
            setPageKey(null);
          }
          res = await getPost(ids);
          const reorderedPostData = result.data
            .map((feedItem) =>
              res.data.find((post) => post.post_id === feedItem.post_id)
            )
            .filter((post) => post !== undefined);
          setData((prev) => [...prev, ...reorderedPostData]);
        } else {
          const formatData = transformedData(
            result && result?.data ? result?.data : entriesData && entriesData
          );
          const badgesData = await getBadges(formatData);
          const updatedPosts = appendBadgesToEntries(
            entriesData,
            badgesData.data
          );
          setData(updatedPosts);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestPost = async (work_id, user_id, status) => {
    const type = "MICRO_CONTEST";
    const body = {
      work_id: work_id,
      work_type: "POST",
      user_id: user_id,
      entry_status: status,
    };
    const response = await ApproveQuestWork(contestId, type, body);
    window.location.reload();
  };

  // const appendBadgesToPosts = (posts, badges, userData) => {
  //   return posts.map((post) => {
  //     const matchedBadge = badges.find(
  //       (badge) => badge.post_id === post.post_id
  //     );
  //     if (matchedBadge) {
  //       if (matchedBadge.badge) {
  //         post.badge = matchedBadge.badge;
  //       } else {
  //         post.badge = null;
  //       }
  //     }
  //     const foundItem = userData.find((item) => item.uid === post.user_id);
  //     if (foundItem) {
  //       post.avatar = foundItem.avatar;
  //       post.defaultAvatar = foundItem.defaultAvatar;
  //       post.name = foundItem.firstname;
  //     }

  //     return post;
  //   });
  // };

  const appendBadgesToEntries = (entries, badgesData) => {
    return entries.map((entry) => {
      const matchedBadge = badgesData.find(
        (badge) => badge.post_id === entry.postId
      );
      if (matchedBadge && matchedBadge.badge) {
        entry.badge = matchedBadge.badge;
      }

      return entry;
    });
  };

  const transformedData = (data) => {
    const transformed = {
      ids: data.map((item) => {
        return {
          user_id: item.user_id ? item.user_id : item.userID,
          post_id: item.post_id ? item.post_id : item.postId,
        };
      }),
    };
    return transformed;
  };

  useEffect(() => {
    fetchData();
  }, [location.pathname, nextPage, entriesData]);

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
      isQuestPage ? data[index].userID : data[index].user_id,
      isQuestPage ? data[index].postId : data[index].post_id,
      type,
      isQuestPage ? data[index].isPortrait : data[index].files[0].isPortrait,
      isQuestPage,
      contestId
    );
    if (resultBD.statusCode === 200) {
      let requestbody = {
        ids: [
          {
            user_id: isQuestPage ? data[index].userID : data[index].user_id,
            post_id: isQuestPage ? data[index].postId : data[index].post_id,
          },
        ],
      };
      let singleItemBadge = await getBadges(requestbody);
      const badgeMap = singleItemBadge.data.reduce((acc, item) => {
        acc[item.post_id] = item.badge;
        return acc;
      }, {});

      const updatedData = data.map((item) => {
        if (badgeMap[isQuestPage ? item.postId : item.post_id]) {
          return {
            ...item,
            badge: badgeMap[isQuestPage ? item.postId : item.post_id],
          };
        }
        return item;
      });
      setData(updatedData);
    }
  };

  const handleClickProfile = async (userId) => {
    let userDetails = await getUserDetails(userId);
    setUserDetails(userDetails);
    setProfilePic(userDetails[0].avatar);
    navigate("/profile", { state: { userDetails } });
  };

  return (
    <>
      {isLoading && <Loader />}
      <Card
        data={data}
        handleClick={handleClick}
        handleClickProfile={handleClickProfile}
        botWorks={false}
        handleQuestPost={handleQuestPost}
        handleSearch={handleSearch}
        setSearchText={setSearchText}
        searchText={searchText}
      />
    </>
  );
};

export default Work;
