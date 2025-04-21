import { useMediaQuery, Typography, Box, Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import apiCall from "../API/api";
import { useLocation } from "react-router-dom";
import style from "./style.module.css";
import Works from "../../Pages/work/work";

const QuestDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [pageKey, setPageKey] = useState("");
  const { getContestEntries, getUserDetails, getPost, addBadges, getBadges } =
    apiCall();
  const [entriesData, setEntriesData] = useState([]);
  const location = useLocation();
  const { contestId, title } = location.state || {};
  const isProfilePage = location.pathname === "/profile";

  const transformedData = async (post, userData, result) => {
    const data = post.map((post) => {
      const user = userData.find((user) => user.uid === post.user_id);
      const entry = result.data.find((item) => item.user_id === post.user_id);
      return {
        postId: post.post_id,
        filename: post?.files[0]?.name,
        userID: user.uid,
        defaultAvatar: user.defaultAvatar,
        avatar: user.avatar,
        firstname: user.firstname,
        title: entry.title.split("_").pop(),
        isPortrait: post?.files[0]?.isPortrait,
        entry_status:entry.entry_status
      };
    });
    return data;
  };

  const getEntriesWork = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        const type = "MICRO_CONTEST";
        const result = await getContestEntries(contestId, pageKey, type);
        const ids = result.data
          .map((item) => (item.work_id ? item.work_id : item.work_ids[0]))
          .join(",");
        const userIds = result.data.map((item) => item.user_id).join(",");
        let users = await getUserDetails(userIds);
        let res = await getPost(ids);
        const entries = await transformedData(res.data, users, result);
        setEntriesData((prev) => [...prev, ...entries]);
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
    getEntriesWork();
  }, []);


  return (
    <div>
      <Typography
        style={{
          fontFamily: "Baloo2",
          color: "black",
          fontSize: isMobile ? "16px" : "29px",
          fontWeight: "800",
          textAlign: "center",
          padding: "15px 0 0 0",
        }}
      >
        {title}
      </Typography>

      <Works entriesData={entriesData} contestId={contestId} />
    </div>
  );
};
export default QuestDetail;
