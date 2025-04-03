import { Box ,Avatar} from "@mui/material";
import style from "../card/style.module.css";
import { useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

const Card = ({ data, handleClick, handleClickProfile }) => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const CDN_URL=process.env.REACT_APP_CDN_URL;

  return (
    <>
    { data.length?
      <Box>
      <div className={style["grid-container"]}>
        {data.map((item, index) => {
          return (
            <div className={style["grid-item"]} key={index}>
              <div className={style["workCard-top"]}>
                <div className={style["workCard-left"]}>
                  <img
                    src={`${CDN_URL}/${item.user_id}/WORKS/IMAGES/medium/${item.files[0].name}`}
                  />
                </div>
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
                    <div className={style["text"]}>
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
                  <div className={style["text"]}>
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
                  <div className={style["text"]}>
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
                  <div className={style["text"]}>
                    <span>HOF</span>
                  </div>
                </div>
                <div className={style["workCard-bottomImage4"]}>
                  <div className={style["profileImage"]}  >
                    {isProfilePage === false && <Avatar
                      src={
                        item.defaultAvatar
                          ? `${CDN_URL}/APP/UserAvatars/${item.avatar}`
                          : `${CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
                      }
                      onClick={() => handleClickProfile(item.user_id)}
                      sx={{height:40,width:40}}
                    />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Box>:
     <Box
     sx={{
       display: "flex",
       justifyContent: "center",
       alignItems: "center",
       height: "100vh", // Full viewport height
       width: "100vw", // Full viewport width
     }}
   >
     <CircularProgress />
   </Box>}
    </>
   
  );
};
export default Card;
