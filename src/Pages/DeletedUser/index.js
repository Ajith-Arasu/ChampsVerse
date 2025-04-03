import { Avatar, Typography } from "@mui/material";
import style from "../DeletedUser/style.module.css";
import apiCall from "../API/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DeletedUser = () => {
  const { getDeletedUser } = apiCall();
  const [pageKey, setPageKey] = useState(""); // Controls pagination
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  const navigate = useNavigate();

  const deletedUser = async () => {
    if (isLoading || pageKey === null) return;

    setIsLoading(true);
    try {
      const user = await getDeletedUser(pageKey);
      console.log("user==>Ruba", user);
      
      setData((prevData) => [...prevData, ...user.data]); 
      
      if (user?.page) {
        setPageKey(user.page);
      } else {
        setPageKey(null); // Stop pagination
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
      deletedUser();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    deletedUser();
  }, []); // Runs only once on mount

  const handleDetail = (userId) => {
    navigate(`/deleted-user/${userId}`);
  };

  return (
    <div className={style["grid-container"]}>
      {data.map((item) => (
        <div
          key={item.user_id}
          className={style["grid-item"]}
          onClick={() => handleDetail(item.user_id)}
        >
          <Avatar
            sx={{ height: "80%", width: "80%" }}
            src={
              item.defaultAvatar
                ? `${CDN_URL}/APP/UserAvatars/${item.avatar}`
                : `${CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
            }
          />
          <Typography sx={{ padding: "10px" }}>{item.firstname}</Typography>
        </div>
      ))}
    </div>
  );
};

export default DeletedUser;
