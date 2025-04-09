import { useMediaQuery, Typography, Box, Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import apiCall from "../API/api";
import { useLocation } from "react-router-dom";
import style from "./style.module.css";

const QuestDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [pageKey, setPageKey] = useState("");
  const { getContestEntries, getUserDetails, getPost, addBadges, getBadges, } = apiCall();
  const [entriesData, setEntriesData] = useState([]);
  const location = useLocation();
  const { contestId } = location.state || {};
  const isProfilePage = location.pathname === "/profile";

  // const handleClick = async (index, type) => {
  //   const resultBD = await addBadges(
  //     data[index].user_id,
  //     data[index].post_id,
  //     type,
  //     data[index].files[0].isPortrait
  //   );
  //   if (resultBD.statusCode === 200) {
  //     let requestbody = {
  //       ids: [
  //         {
  //           user_id: data[index].user_id,
  //           post_id: data[index].post_id,
  //         },
  //       ],
  //     };
  //     let singleItemBadge = await getBadges(requestbody);
  //     const badgeMap = singleItemBadge.data.reduce((acc, item) => {
  //       acc[item.post_id] = item.badge;
  //       return acc;
  //     }, {});

  //     const updatedData = data.map((item) => {
  //       if (badgeMap[item.post_id]) {
  //         return {
  //           ...item,
  //           badge: badgeMap[item.post_id],
  //         };
  //       }
  //       return item;
  //     });
  //     setData(updatedData);
  //   }
  // };

  // const handleClickProfile = async (userId) => {
  //   let userDetails = await getUserDetails(userId);
  //   setUserDetails(userDetails);
  //   setProfilePic(userDetails[0].avatar);
  //   navigate("/profile", { state: { userId } });
  // };

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
        console.log("entriesData1111", entries);
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
    console.log("getEntriesWork");
  }, []);

  console.log("entriesData8888", entriesData);

  return (
    <div>
      Quest Detail
      <Box>
        <div className={style["grid-container"]}>
          {entriesData.map((item, index) => {
            console.log("imagesss",`${process.env.REACT_APP_CDN_URL}/${contestId}/MICRO_CONTESTS/IMAGES/medium/${item.filename}`)
            return (
              <div className={style["grid-item"]} key={index}>
                <div className={style["workCard-top"]}>
                  <div className={style["workCard-left"]}>
                    <img
                      src={`${process.env.REACT_APP_CDN_URL}/${contestId}/MICRO_CONTESTS/IMAGES/medium/${item.filename}`}
                    />
                  </div>
                  <div className={style["workCard-right"]}>
                    <div className={style["valub1"]}>
                      <div className={style["image"]}>
                        <img
                          src="\Diamond.png"
    
                          style={{
                            cursor: "pointer",
                            opacity:
                              item.badge === "dmd" ||
                              item.badge === "mp" ||
                              item.badge === "wnd" ||
                              item.badge === "hof"
                                ? 1.0
                                : 0.2,
                          }}
                        />
                      </div>
                      <div className={style["text"]}>
                        <span>Diamond</span>
                      </div>
                    </div>
                    <div className={style["valub1"]}>
                      <div className={style["image"]}>
                        <img
                          src="\Ruby.png"
                          
                          style={{
                            cursor: "pointer",
                            opacity: item.badge === "rby" ? 1.0 : 0.2,
                          }}
                        />
                      </div>
                      <div className={style["text"]}>
                        <span>Ruby</span>
                      </div>
                    </div>
                    <div className={style["valub1"]}>
                      <div className={style["image"]}>
                        <img
                          src="\Gold.png"
                          style={{
                            cursor: "pointer",
                            opacity: item.badge === "gld" ? 1.0 : 0.2,
                          }}
                        />
                      </div>
                      <div className={style["text"]}>
                        <span>Gold</span>
                      </div>
                    </div>
                    <div className={style["valub1"]}>
                      <div className={style["image"]}>
                        <img
                          src="\Silver.png"
                          style={{
                            cursor: "pointer",
                            opacity: item.badge === "slv" ? 1.0 : 0.2,
                          }}
                        />
                      </div>
                      <div className={style["text"]}>
                        <span style={{ fontWeight: "bold" }}>Silver</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={style["workCard-bottom"]}>
                  <div className={style["workCard-bottomImage1"]}>
                    <div className={style["image"]}>
                      <img
                        src="\MasterPiece.png"
                        style={{
                          cursor: "pointer",
                          opacity: item.badge === "mp" ? 1.0 : 0.2,
                        }}
                      />
                    </div>
                    <div className={style["text"]}>
                      <span>MasterPiece</span>
                    </div>
                  </div>
                  <div className={style["workCard-bottomImage2"]}>
                    <div className={style["image"]}>
                      <img
                        src="\Treasure1.png"
                        style={{
                          cursor: "pointer",
                          opacity: item.badge === "wnd" ? 1.0 : 0.2,
                        }}
                      />
                    </div>
                    <div className={style["text"]}>
                      <span>Treasure</span>
                    </div>
                  </div>
                  <div className={style["workCard-bottomImage3"]}>
                    <div className={style["image"]}>
                      <img
                        src="\HOF.png"
                        style={{
                          cursor: "pointer",
                          opacity: item.badge === "hof" ? 1.0 : 0.2,
                        }}
                      />
                    </div>
                    <div className={style["text"]}>
                      <span>HOF</span>
                    </div>
                  </div>
                  <div className={style["workCard-bottomImage4"]}>
                    <div className={style["profileImage"]}>
                      {isProfilePage === false && (
                        <Avatar
                          src={
                            item.defaultAvatar
                              ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${item.avatar}`
                              : `${process.env.REACT_APP_CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
                          }
                          sx={{ height: 40, width: 40 }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Box>
    </div>
  );
};
export default QuestDetail;
