import style from "../DeletedUser/style.module.css";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DeletedUserWorks from "../DeletedUser/deletedUserWorks";
import apiCall from "../API/api";
import DeletedPost from "../DeletedPost/deletedPost"

const DeletedUserDetail = () => {
  const { getDeletedUserPost, getPost } = apiCall();
  const [selectedTab, setSelectedTab] = useState("post");
  const { userId } = useParams();
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleClick = (tab) => {
    if (selectedTab !== tab) {
      setSelectedTab(tab);
      setPageKey("");
      setData([]); 
    }
  };

  const getPostData = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        const result = await getDeletedUserPost(pageKey, userId, selectedTab);
          setData((prev) => [...prev, ...result.data]);
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

  useEffect(() => {
    setData([]); 
    setPageKey(""); 
    getPostData();
  }, [selectedTab, userId]);

  console.log("honest dataaaaa",data)

  return (
    <>

    <div className={style["tab-Section"]}>
      <div className={style["section"]} onClick={() => handleClick("post")}>
        <img
          src={selectedTab === "post" ? "/button-normal.png" : "/emptySection.png"}
          alt="Post Icon"
        />
        <Typography
          variant="h6"
          className={selectedTab === "post" ? style["center-alligned"] : style["unselected-item"]}
        >
          Works
        </Typography>
      </div>

      <div className={style["section"]} onClick={() => handleClick("book")}>
        <img
          src={selectedTab === "book" ? "/button-normal.png" : "/emptySection.png"}
          alt="Books Icon"
        />
        <Typography
          variant="h6"
          className={selectedTab === "book" ? style["center-alligned"] : style["unselected-item"]}
        >
          Books
        </Typography>
      </div>

      {/* <div className={style["section"]} onClick={() => handleClick("achievement")}>
        <img
          src={selectedTab === "Achievement" ? "/button-normal.png" : "/emptySection.png"}
          alt="Achievement Icon"
        />
        <Typography
          variant="h6"
          className={selectedTab === "Achievement" ? style["center-alligned"] : style["unselected-item"]}
        >
          Achievement
        </Typography>
      </div> */}

    </div>
    {selectedTab === "post"   && <DeletedPost  userId={userId} userDeletedData={data} selectedTab={selectedTab}/>}
    {selectedTab === "book"   && <DeletedPost  userId={userId} userDeletedData={data} selectedTab={selectedTab}/>}
    </>
  );
};

export default DeletedUserDetail;
