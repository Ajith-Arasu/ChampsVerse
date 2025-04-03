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
  const [pageKey, setPageKey] = useState(""); // Controls pagination
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleClick = (tab) => {
    if (selectedTab !== tab) {
      setSelectedTab(tab);
      setPageKey(""); // Reset pagination on tab change
      setData([]); // Clear old data
    }
  };

  const getPostData = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        const result = await getDeletedUserPost(pageKey, userId, selectedTab);
        console.log("result==>Ruba", result);

        if (result?.data?.length > 0) {
          const ids = result.data.map((item) => item.post_id).join(",");
          let res = await getPost(ids);
          console.log("res", res);

          setData((prev) => [...prev, ...res.data]);

          if (result?.page) {
            setPageKey(result?.page);
          } else {
            setPageKey(null);
          }
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

      <div className={style["section"]} onClick={() => handleClick("books")}>
        <img
          src={selectedTab === "books" ? "/button-normal.png" : "/emptySection.png"}
          alt="Books Icon"
        />
        <Typography
          variant="h6"
          className={selectedTab === "books" ? style["center-alligned"] : style["unselected-item"]}
        >
          Books
        </Typography>
      </div>

      <div className={style["section"]} onClick={() => handleClick("Achievement")}>
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
      </div>

    </div>
    {selectedTab === "post" && <DeletedPost  userId={userId} userDeletedData={data} />}

    </>
  );
};

export default DeletedUserDetail;
