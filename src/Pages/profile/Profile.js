import { useEffect,useState } from "react";
import apiCall from "../API/api";
import { useLocation } from "react-router-dom";
import Card from "../../card/index"

const Profile =()=>{
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const location = useLocation();
  const [nextPage, setNextPage] = useState(1);
  const {userDetails} = location.state

  console.log("userDetails",userDetails)

  const {  getPostByUserId,getPost,getBadges,addBadges,getUserDetails } = apiCall();  
  useEffect(()=>{
    fetchData();
  },[])


  const fetchData = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        let postIds = await getPostByUserId(userDetails[0].uid);
        const ids = postIds.map((item) => item.post_id).join(",");
        let res = await getPost(ids);
        const formatData = transformedData(postIds);
        const badgesData = await getBadges(formatData);
        const updatedPosts = appendBadgesToPosts(res.data, badgesData.data);
        setData((prev) => [...prev, ...updatedPosts]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
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
  const appendBadgesToPosts = (posts, badges) => {
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
      return post;
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
  const handleClick = async (index, type) => {
   
    const resultBD = await addBadges(
      data[index].user_id,
      data[index].post_id,
      type,
      data[index].files[0].isPortrait
    );
    if(resultBD.statusCode === 200){
      let requestbody ={
        "ids": [
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
  const handleClickProfile = (userId)=>{
  }

return(
  <div>
 <Card
    data={data}
    handleClick={handleClick}
    handleClickProfile={handleClickProfile}
    handlename = {userDetails[0].handle}
    />
    </div>
)
}
export default Profile;