import { Box, Avatar, Button, Typography, useMediaQuery } from "@mui/material";
import style from "../card/style.module.css";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

const Card = ({
  data,
  handleClick,
  handleClickProfile,
  botWorks,
  handleQuestPost,
  handleSearch,
  setSearchText,
  searchText,
  handlename,
  userDetails,
}) => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const isQuestPage = location.pathname === "/quests-Works";
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  const isMobile = useMediaQuery("(max-width:600px)");


  return (
    <>
      <div style={{ margin: "20px" }}></div>
      {isProfilePage && (
        <a
          href={`https://champsverse.com/user/${handlename}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#000", margin: "20px" }}
        >
          Visit {handlename}'s Profile
        </a>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-end",
          width: "100%",
          margin: "10px",
        }}
      >
        <div style={{ display: "flex", width: "30%" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              padding: "8px",
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "4px 0 0 4px",
            }}
          />
          <button
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderLeft: "none",
              backgroundColor: "#1976d2",
              color: "white",
              borderRadius: "0 4px 4px 0",
              cursor: "pointer",
            }}
            onClick={() => {
              handleSearch();
            }}
          >
            Search
          </button>
        </div>
      </div>
      {!isMobile && userDetails && (
        <div style={{ display: "flex", gap: "18px", margin: "5% 10%" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <Typography>FirstName : </Typography>
            <Typography style={{ color: "white" }}>
              {userDetails[0].firstname}
            </Typography>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Typography>Handle :</Typography>
            <Typography style={{ color: "white" }}>
              {userDetails[0].handle}
            </Typography>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Typography>Email : </Typography>
            <Typography style={{ color: "white" }}>
              {userDetails[0].email}
            </Typography>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Typography>DOB : </Typography>
            <Typography style={{ color: "white" }}>
              {userDetails[0].dob}
            </Typography>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Typography>Age : </Typography>
            <Typography style={{ color: "white" }}>
              {userDetails[0].dob}
            </Typography>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Typography>Gender :</Typography>
            <Typography style={{ color: "white" }}>
              {userDetails[0].gender}
            </Typography>
          </div>
        </div>
      )}
      {isMobile && userDetails && (
        <div style={{ margin: "4% 5%" }}>
          <div style={{ display: "flex", gap: "25px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <Typography>FirstName : </Typography>
              <Typography style={{ color: "white" }}>
                {userDetails[0].firstname}
              </Typography>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Typography>Handle :</Typography>
              <Typography style={{ color: "white" }}>
                {userDetails[0].handle}
              </Typography>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <Typography style={{}}>Email : </Typography>
              <Typography style={{ color: "white" }}>
                {userDetails[0].email}
              </Typography>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <Typography>DOB : </Typography>
              <Typography style={{ color: "white" }}>
                {userDetails[0].dob}
              </Typography>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Typography>Age : </Typography>
              <Typography style={{ color: "white" }}>
                {userDetails[0].dob}
              </Typography>
            </div>
           
          </div>
        </div>
      )}
      {data === undefined || data === null ? (
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
      ) : data.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            width: "100%",
          }}
        >
          <Typography
            style={{
              fontFamily: "Baloo2",
              color: "black",
              fontSize: isMobile ? "20px" : "35px",
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            No Entries
          </Typography>
        </Box>
      ) : (
        <Box>
          <div
            className={
              style[isMobile ? "grid-container-mob" : "grid-container"]
            }
          >
            {data.map((item, index) => {
              return (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    className={style[isMobile ? "grid-item-mob" : "grid-item"]}
                    key={index}
                  >
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

                      {isQuestPage && (
                        <div className={style["workCard-right"]}>
                          <div className={style["valub1"]}>
                            <Button
                              className={style["image"]}
                              disabled={
                                item.entry_status !== 1 &&
                                item.entry_status !== 3
                              }
                            >
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
                            </Button>
                            <div
                              className={style[isMobile ? "text-mob" : "text"]}
                            >
                              <span>Diamond</span>
                            </div>
                          </div>
                          <div className={style["valub1"]}>
                            <Button
                              className={style["image"]}
                              disabled={
                                item.entry_status !== 1 &&
                                item.entry_status !== 3
                              }
                            >
                              <img
                                src="\Ruby.png"
                                onClick={() => handleClick(index, "rby")}
                                style={{
                                  cursor: "pointer",
                                  opacity: item.badge === "rby" ? 1.0 : 0.2,
                                }}
                              />
                            </Button>
                            <div className={style["text"]}>
                              <span>Ruby</span>
                            </div>
                          </div>
                          <div className={style["valub1"]}>
                            <Button
                              className={style["image"]}
                              disabled={
                                item.entry_status !== 1 &&
                                item.entry_status !== 3
                              }
                            >
                              <img
                                src="\Gold.png"
                                onClick={() => handleClick(index, "gld")}
                                style={{
                                  cursor: "pointer",
                                  opacity: item.badge === "gld" ? 1.0 : 0.2,
                                }}
                              />
                            </Button>
                            <div className={style["text"]}>
                              <span>Gold</span>
                            </div>
                          </div>
                          <div className={style["valub1"]}>
                            <Button
                              className={style["image"]}
                              disabled={
                                item.entry_status !== 1 &&
                                item.entry_status !== 3
                              }
                            >
                              <img
                                src="\Silver.png"
                                onClick={() => handleClick(index, "slv")}
                                style={{
                                  cursor: "pointer",
                                  opacity: item.badge === "slv" ? 1.0 : 0.2,
                                }}
                              />
                            </Button>
                            <div className={style["text"]}>
                              <span style={{ fontWeight: "bold" }}>Silver</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={style["workCard-bottom"]}>
                      {isQuestPage && (
                        <>
                          <div className={style["workCard-bottomImage1"]}>
                            <Button
                              className={style["image"]}
                              disabled={
                                item.entry_status !== 1 &&
                                item.entry_status !== 3
                              }
                            >
                              <img
                                src="\MasterPiece.png"
                                onClick={() => handleClick(index, "mp")}
                                style={{
                                  cursor: "pointer",
                                  opacity: item.badge === "mp" ? 1.0 : 0.2,
                                }}
                              />
                            </Button>
                            <div
                              className={style[isMobile ? "text-mob" : "text"]}
                            >
                              <span>MasterPiece</span>
                            </div>
                          </div>
                          <div className={style["workCard-bottomImage2"]}>
                            <Button
                              className={style["image"]}
                              disabled={
                                item.entry_status !== 1 &&
                                item.entry_status !== 3
                              }
                            >
                              <img
                                src="\Treasure1.png"
                                onClick={() => handleClick(index, "wnd")}
                                style={{
                                  cursor: "pointer",
                                  opacity: item.badge === "wnd" ? 1.0 : 0.2,
                                }}
                              />
                            </Button>
                            <div
                              className={style[isMobile ? "text-mob" : "text"]}
                            >
                              <span>Treasure</span>
                            </div>
                          </div>
                          <div className={style["workCard-bottomImage3"]}>
                            <Button
                              className={style["image"]}
                              disabled={
                                item.entry_status !== 1 &&
                                item.entry_status !== 3
                              }
                            >
                              <img
                                src="\HOF.png"
                                onClick={() => handleClick(index, "hof")}
                                style={{
                                  cursor: "pointer",
                                  opacity: item.badge === "hof" ? 1.0 : 0.2,
                                }}
                              />
                            </Button>
                            <div
                              className={style[isMobile ? "text-mob" : "text"]}
                            >
                              <span>HOF</span>
                            </div>
                          </div>
                        </>
                      )}
                      <div
                        className={style["workCard-bottomImage4"]}
                        style={{ width: !isQuestPage && "100%" }}
                      >
                        <div className={style["profileImage"]}>
                          {isProfilePage === false && (
                            <div style={{ display: "flex", cursor: "pointer" }}>
                              <Avatar
                                src={
                                  item.defaultAvatar
                                    ? `${CDN_URL}/APP/UserAvatars/${item.avatar}`
                                    : `${CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
                                }
                                onClick={() => handleClickProfile(item.user_id)}
                                sx={{
                                  height: isMobile ? 30 : 40,
                                  width: isMobile ? 30 : 40,
                                }}
                              />
                              <Typography
                                sx={{ textAlign: "center", padding: "8px" }}
                              >
                                {" "}
                                {item.name}
                              </Typography>
                            </div>
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
                      ) : (
                        <div
                          style={{
                            backgroundColor:
                              item.entry_status === 3
                                ? "green"
                                : item.entry_status === 5
                                ? "orange"
                                : "red",
                            width: "100%",
                            textAlign: "center",
                            color: "white",
                          }}
                        >
                          <Typography>
                            {item.entry_status === 3
                              ? "Approved"
                              : item.entry_status === 5
                              ? "Pending For Approval"
                              : "Rejected"}
                          </Typography>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Box>
      )}
    </>
  );
};
export default Card;
