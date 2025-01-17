import { useEffect, useState } from "react";
import apiCall from "../API/api";
import { useNavigate }  from "react-router-dom"
import Card from "../../card/index"
import Loader from  "../Loader/loader";

const Work = ({ setUserDetails, setProfilePic }) => {
  const navigate = useNavigate();
  const CDN_URL = "https://dcp5pbxslacdh.cloudfront.net";
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reactions, setReactions] = useState({});
  const { data: feedData, getPost, addBadges, getBadges,getUserDetails } = apiCall();
  const [count, setCount] = useState(20);
  const [refresh, setRefreshPage] = useState(false);

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
        const updatedPosts = appendBadgesToPosts(res.data, badgesData.data,userData);
        const reorderedPostData = result.data
        .map(feedItem => updatedPosts.find(post => post.post_id === feedItem.post_id))
        .filter(post => post !== undefined);
        setData((prev) => [...prev, ...reorderedPostData]);

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
 

  const appendBadgesToPosts = (posts, badges,userData) => {

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
  }, [nextPage]);

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
    if(resultBD.statusCode === 200){
      let requestbody ={
        "targetIds": [
            {
                "user_id": data[index].user_id,
                "post_id": data[index].post_id
            }
        ]
    }
      let singleItemBadge=await getBadges(requestbody)
      const badgeMap = singleItemBadge.data.reduce((acc, item) => {
        acc[item.post_id] = item.badge;
        return acc;
      }, {});
      
      
       const updatedData = data.map(item => {
        if (badgeMap[item.post_id]) {
          return {
            ...item,
            badge: badgeMap[item.post_id]
          };
        }
        return item;
      });
      setData(updatedData)
    }
  };

  const handleClickProfile = async(userId)=>{
    let userDetails= await getUserDetails(userId);
    setUserDetails(userDetails);
    setProfilePic(userDetails[0].avatar);
    navigate("/profile",{state:{userId}})
  }
  
  return (
    <>{console.log("data11",data)}
    {isLoading && <Loader/>}
    <Card
    data={data}
    handleClick={handleClick}
    handleClickProfile={handleClickProfile}
    />
    </>
  );
};

export default Work;
