import { useMediaQuery, Typography, Box, Avatar, Button } from "@mui/material";
import { useState, useEffect } from "react";
import ApiCall from "../API/api";
import { useLocation } from "react-router-dom";
import style from "./style.module.css";
import Works from "../../Pages/work/work";
import Loader from "../Loader/loader";
import itemsBg from "../../asserts/questWorksBG.png";
import { display } from "@mui/system";
import approveBtn from "../../asserts/aprvBtn.png";
import rejBtn from "../../asserts/rejBtn.png";
import approvedImg from "../../asserts/approvedImg.png";

const QuestWorks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [pageKey, setPageKey] = useState("");
  const { getContestEntries, getUserDetails, getPost, addBadges, getBadges, ApproveQuestWork, } =
    ApiCall();
  const [entriesData, setEntriesData] = useState([]);
  const location = useLocation();
  const { contestId, title } = location.state || {};
  const isProfilePage = location.pathname === "/profile";

  const transformedData = async (post, userData, result) => {
    console.log("transformedData", transformedData);
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
        entry_status: entry.entry_status,
      };
    });
    console.log("data", data);
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
        console.log("entries", entries);
        const requestbody = {
          ids: entries.map((item) => ({
            user_id: item.userID,
            post_id: item.postId,
          })),
        };
        const badgesData = await getBadges(requestbody);

        console.log("singleItemBadge1111", badgesData.data);

        // Merge badge data into inputData
        const mergedData = entries.map((entry) => {
          const match = badgesData.data.find(
            (badge) =>
              badge.user_id === entry.userID && badge.post_id === entry.postId
          );
          console.log("match", match);
          return {
            ...entry,
            badge: match?.badge || null,
            micro_contest_status: match?.micro_contest_status || null,
          };
        });

        console.log("mergedData", mergedData);
        console.log("entries 000", entries);

        setEntriesData((prev) => [...prev, ...mergedData]);

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

  const handleClick = async (index, type) => {
    console.log("badges - click");
    const resultBD = await addBadges(
      entriesData[index].userID,
      entriesData[index].postId,
      type,
      entriesData[index].isPortrait,
      true,
      contestId
    );
    console.log("resultBD", resultBD);
    if (resultBD.statusCode === 200) {
      console.log("getBadges", getBadges);
      let requestbody = {
        ids: [
          {
            user_id: entriesData[index].userID,
            post_id: entriesData[index].postId,
          },
        ],
      };
      let singleItemBadge = await getBadges(requestbody);
      const badgeMap = singleItemBadge.data.reduce((acc, item) => {
        acc[item.post_id] = item.badge;
        return acc;
      }, {});
      const updatedData = entriesData.map((item) => {
        if (badgeMap[item.postId]) {
          return {
            ...item,
            badge: badgeMap[item.postId],
          };
        }
        return item;
      });
      console.log("updatedData", updatedData);
      setEntriesData(updatedData);
    }
  };

  console.log("entriesData", entriesData);
  return (
    <div style={{ marginLeft: "5%", marginTop: "3%" }}>
      <Typography style={{ fontSize: "32px", fontWeight: 800, color: "white" , textAlign: 'center'}}>
        {title}
      </Typography>
      {isLoading && <Loader />}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "2%",
        }}
      >
        {entriesData.map((item, index) => {
          const avtimg = item.defaultAvatar
            ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${item.avatar}`
            : `${process.env.REACT_APP_CDN_URL}/${item.userID}/PROFILE/IMAGES/medium/${item.avatar}`;
          console.log("avtimg", avtimg);
          return (
            <div
              key={index}
              style={{
                flex: "1 1 calc(100% / 5 - 35px)",
                maxWidth: "calc(100% / 5 - 35px)",
                textAlign: "center",
                height: "390px",
                width: "360px",

                borderRadius: "20px",
                position: "relative",
                marginBottom: "2%",
              }}
            >
              <img
                style={{
                  height: "50%",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "20px 20px 0 0",
                }}
                src={`${process.env.REACT_APP_CDN_URL}/${item.userID}/WORKS/IMAGES/medium/${item.filename}`}
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
                }}
              >
                <Avatar
                  src={
                    item.defaultAvatar
                      ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${item.avatar}`
                      : `${process.env.REACT_APP_CDN_URL}/${item.userID}/PROFILE/IMAGES/filetype/${item.avatar}`
                  }
                  sx={{
                    height: 30,
                    width: 30,
                  }}
                ></Avatar>
                <Typography>{item.firstname}</Typography>
              </Box>
              <Box
                style={{
                  height: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-around",
                  background: `url(${itemsBg})`,
                  backgroundSize: "112% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  marginTop: "-15%",
                }}
              >
                <Box sx={{ display: "flex", gap: "8px", marginTop: "15px" }}>
                  {["dmd", "rby", "gld", "slv"].map((badge, i) => (
                    <Button
                      key={badge}
                      disableRipple
                      sx={{ minWidth: 0, p: 0 }}
                      disabled={
                        item.entry_status !== 1 && item.entry_status !== 3
                      }
                      onClick={() => handleClick(index, badge)}
                    >
                      <img
                        src={`\\${
                          badge === "dmd"
                            ? "Diamond"
                            : badge === "rby"
                            ? "Ruby"
                            : badge === "gld"
                            ? "Gold"
                            : "Silver"
                        }.png`}
                        style={{
                          cursor: "pointer",
                          opacity:
                            item.badge === badge ||
                            (badge === "dmd" &&
                              ["mp", "wnd", "hof"].includes(item.badge))
                              ? 1.0
                              : 0.2,
                          width: "45px",
                          height: "45px",
                        }}
                      />
                    </Button>
                  ))}
                </Box>

                {/* Badges Row (MP, Treasure, HOF) */}
                <Box sx={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                  <Button
                    disableRipple
                    sx={{ minWidth: 0, p: 0 }}
                    disabled={
                      item.entry_status !== 1 && item.entry_status !== 3
                    }
                    onClick={() => handleClick(index, "mp")}
                  >
                    <img
                      src="\MasterPiece.png"
                      style={{
                        cursor: "pointer",
                        opacity: item.badge === "mp" ? 1.0 : 0.2,
                        width: "45px",
                        height: "45px",
                      }}
                    />
                  </Button>
                  <Button
                    disableRipple
                    sx={{ minWidth: 0, p: 0 }}
                    disabled={
                      item.entry_status !== 1 && item.entry_status !== 3
                    }
                    onClick={() => handleClick(index, "wnd")}
                  >
                    <img
                      src="\Treasure1.png"
                      style={{
                        cursor: "pointer",
                        opacity: item.badge === "wnd" ? 1.0 : 0.2,
                        width: "45px",
                        height: "45px",
                      }}
                    />
                  </Button>
                  <Button
                    disableRipple
                    sx={{ minWidth: 0, p: 0 }}
                    disabled={
                      item.entry_status !== 1 && item.entry_status !== 3
                    }
                    onClick={() => handleClick(index, "hof")}
                  >
                    <img
                      src="\HOF.png"
                      style={{
                        cursor: "pointer",
                        opacity: item.badge === "hof" ? 1.0 : 0.2,
                        width: "45px",
                        height: "45px",
                      }}
                    />
                  </Button>
                </Box>

                {/* Approve / Reject Row */}
                {
                  <Box sx={{ display: "flex", gap: "0", marginTop: "2px" }}>
                    {item.entry_status === 1 && (
                      <>
                        <Button
                          disableRipple
                          sx={{ minWidth: 0, p: 0 }}
                          onClick={() =>
                            handleQuestPost(item.postId, item.userID, 3)
                          }
                        >
                          <img
                            src={approveBtn}
                            alt="Approve"
                            style={{ width: "110px" }}
                          />
                        </Button>
                        <Button
                          disableRipple
                          sx={{ minWidth: 0, p: 0 }}
                          onClick={() =>
                            handleQuestPost(item.postId, item.userID, 4)
                          }
                        >
                          <img
                            src={rejBtn}
                            alt="Reject"
                            style={{ width: "110px" }}
                          />
                        </Button>
                      </>
                    )}
                    {item.entry_status === 3 && <img src={approvedImg}></img>}
                  </Box>
                }
              </Box>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default QuestWorks;
