import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import { useLocation } from "react-router-dom";
import style from "../Header/style.module.css";
import { useNavigate }  from "react-router-dom"

const Header = ({ userDetails }) => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const navigate = useNavigate();
  const handleClick =(page)=>{
    navigate(`/${page}`);
  }
  return (
    <>
      <AppBar
        position="static"
        sx={{
          background:
            "linear-gradient(78.47deg, #FC3561 -7.11%, #FDB365 107.74%)",
        }}
      >
        <Toolbar>
          <Typography variant="h6">
            <img src="\cv.png"></img>
          </Typography>
          <div className={style["tab-Section"]} onClick={() => handleClick("work")}>
            <img
              src={
                location.pathname === "/work"
                  ? "/backGroundTab.png"
                  : "/emptySection.png"
              }
              alt="Snow"
              style={{ width: "85%"}}
            ></img>
            <div class={style["centered"]}>Works</div>
          </div>
          <div className={style["tab-Section"]} style={{ marginLeft: "2px" }} onClick={() => handleClick("books")}>
            <img
              src={
                location.pathname === "/books"
                  ? "/backGroundTab.png"
                  : "/emptySection.png"
              }
              alt="Snow"
              style={{ width: "85%" }}
            ></img>
            <div class={style["centered"]}>Books</div>
          </div>
          <div className={style["tab-Section"]} style={{ marginLeft: "2px" }} onClick={() => handleClick("contests")}>
            <img
            
              src={
                location.pathname === "/contests"
                  ? "/backGroundTab.png"
                  : "/emptySection.png"
              }
              alt="Snow"
              style={{ width: "85%" }}
            ></img>
            <div class={style["centered"]}>Contests</div>
          </div>
          <div className={style["tab-Section"]} style={{ marginLeft: "2px" }} onClick={() => handleClick("storage-consumption")}>
            <img
              src={
                location.pathname === "/storage-consumption"
                  ? "/backGroundTab.png"
                  : "/emptySection.png"
              }
              alt="Snow"
              style={{ width: "85%" }}
            ></img>
            <div class={style["centered"]}>Storage</div>
          </div>
          <div className={style["tab-Section"]} style={{ marginLeft: "2px" }} onClick={() => handleClick("deleted-post")}>
            <img
              src={
                location.pathname === "/deleted-post"
                  ? "/backGroundTab.png"
                  : "/emptySection.png"
              }
              alt="Snow"
              style={{ width: "85%" }}
            ></img>
            <div class={style["centered"]}>Deleted Post</div>
          </div>
          <Box sx={{ flexGrow: 1 }} />
          {isProfilePage && (
            <Box
              className="profile-info"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Avatar
                src={
                  userDetails[0].defaultAvatar
                    ? `https://dcp5pbxslacdh.cloudfront.net/APP/UserAvatars/${userDetails[0].avatar}`
                    : `https://dcp5pbxslacdh.cloudfront.net/${userDetails[0].uid}/PROFILE/IMAGES/filetype/${userDetails[0].avatar}`
                }
                alt="Profile"
                sx={{ height: 45, width: 45 }}
              />
              <Typography variant="h4" style={{ textAlign: "right" }}>
                {userDetails[0].firstname}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};
export default Header;
