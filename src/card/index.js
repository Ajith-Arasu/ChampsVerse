import { Box, Avatar, Button, Typography, useMediaQuery } from "@mui/material";
import style from "../card/style.module.css";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Card = ({
  data,
  handleClick,
  handleClickProfile,
  botWorks,
  handleQuestPost,
}) => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const isQuestPage = location.pathname === "/quests-Works";
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  const isMobile = useMediaQuery('(max-width:600px)');
  
  return (

    <>
      {data.length ? (
        <Box>
          <div className={style[isMobile? "grid-container-mob" :"grid-container"]}>
            {data.map((item, index) => {
              return (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={style[isMobile?"grid-item-mob":"grid-item"]} key={index}>
                    <div className={style["workCard-top"]}>
                      <div className={style["workCard-left"]}>
                        <img
                          src={`${CDN_URL}/${
                            !isQuestPage ? item.user_id : item.userID
                          }/WORKS/IMAGES/medium/${
                            !isQuestPage ? item.files[0].name : item.filename
                          }`}
                        />
                      </div>
                      {!botWorks && (
                        <div className={style["workCard-right"]}>
                          <div className={style["valub1"]}>
                            <div className={style["image"]}>
                              <img
                                src="\Diamond.png"
                                onClick={() => handleClick(index, "dmd")}
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
                            <div className={style[isMobile? 'text-mob':"text"]}>
                              <span>Diamond</span>
                            </div>
                          </div>
                          <div className={style["valub1"]}>
                            <div className={style["image"]}>
                              <img
                                src="\Ruby.png"
                                onClick={() => handleClick(index, "rby")}
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
                                onClick={() => handleClick(index, "gld")}
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
                                onClick={() => handleClick(index, "slv")}
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
                      )}
                    </div>
                    <div className={style["workCard-bottom"]}>
                      <div className={style["workCard-bottomImage1"]}>
                        <div className={style["image"]}>
                          <img
                            src="\MasterPiece.png"
                            onClick={() => handleClick(index, "mp")}
                            style={{
                              cursor: "pointer",
                              opacity: item.badge === "mp" ? 1.0 : 0.2,
                            }}
                          />
                        </div>
                        <div className={style[isMobile? 'text-mob':"text"]}>
                          <span>MasterPiece</span>
                        </div>
                      </div>
                      <div className={style["workCard-bottomImage2"]}>
                        <div className={style["image"]}>
                          <img
                            src="\Treasure1.png"
                            onClick={() => handleClick(index, "wnd")}
                            style={{
                              cursor: "pointer",
                              opacity: item.badge === "wnd" ? 1.0 : 0.2,
                            }}
                          />
                        </div>
                        <div className={style[isMobile? 'text-mob':"text"]}>
                          <span>Treasure</span>
                        </div>
                      </div>
                      <div className={style["workCard-bottomImage3"]}>
                        <div className={style["image"]}>
                          <img
                            src="\HOF.png"
                            onClick={() => handleClick(index, "hof")}
                            style={{
                              cursor: "pointer",
                              opacity: item.badge === "hof" ? 1.0 : 0.2,
                            }}
                          />
                        </div>
                        <div className={style[isMobile? 'text-mob':"text"]}>
                          <span>HOF</span>
                        </div>
                      </div>
                      <div className={style["workCard-bottomImage4"]}>
                        <div className={style["profileImage"]}>
                          {isProfilePage === false && (
                            <Avatar
                              src={
                                item.defaultAvatar
                                  ? `${CDN_URL}/APP/UserAvatars/${item.avatar}`
                                  : `${CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
                              }
                              onClick={() => handleClickProfile(item.user_id)}
                              sx={{ height: isMobile? 30:40, width:isMobile? 30: 40 }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {isQuestPage && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      {item.entry_status === 1 ? (
                        <>
                          <Button
                            onClick={() =>
                              handleQuestPost(item.postId, item.userID, 3)
                            }
                            variant="outlined"
                            color="success"
                            fullWidth
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() =>
                              handleQuestPost(item.postId, item.userID, 4)
                            }
                            variant="outlined"
                            color="error"
                            fullWidth
                          >
                            Reject
                          </Button>
                        </>
                      ):<div style={{backgroundColor: item.entry_status === 3?'green':item.entry_status === 5?'orange':'red', width: '100%', textAlign: 'center',color: 'white' }}>
                        <Typography>{item.entry_status === 3?'Approved':item.entry_status === 5?'Pending For Approval': 'Rejected'}</Typography></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};
export default Card;
