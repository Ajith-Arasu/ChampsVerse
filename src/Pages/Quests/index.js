import {
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Easy from "../../asserts/easy.png";
import Expert from "../../asserts/hard.png";
import Advanced from "../../asserts/complex.png";
import Moderate from "../../asserts/moderate.png";
import ApiCall from "../API/api";
import { useEffect, useState } from "react";
import threeDotsIcon from "../../asserts/icons8-three-dots-30.png";
import synBg from '../../asserts/tabSwitch.png'

const Quests = () => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getQuestList, triggerActivityApi, syncQuests } = ApiCall();
  const [quest, setQuest] = useState([]);
  const difficultyLabels = ["Easy", "Moderate", "Advanced", "Expert"];
  const difficultyBg = [Easy, Moderate, Advanced, Expert];
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [contestId, setContestId] = useState("");
  const [openSyncConfirm, setOpenSyncConfirm] = useState(false);
  const [menuState, setMenuState] = useState({ anchorEl: null, item: null });

  const handleOpenMenu = (event, item) => {
    event.stopPropagation();
    setMenuState({ anchorEl: event.currentTarget, item });
  };

  const handleCloseMenu = () => {
    setMenuState({ anchorEl: null, item: null });
  };

  const handleClickOpen = (contest_id) => {
    setOpen(true);
    setContestId(contest_id);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenSyncConfirm(false);
  };

  const handleClick = (contestId, title) => {
    navigate("/quests-Works", { state: { contestId, title } });
  };

  const handleTriggerActivity = () => {
    const body = {
      activity_type: "micro_contest",
      activity_id: contestId,
    };
    triggerActivityApi(body);
    setOpen(false);
  };

  const handleSync = async () => {
    const res = await syncQuests();
    setOpenSyncConfirm(false);
  };

  const getPost = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        const questData = await getQuestList(pageKey);
        setQuest(questData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const handleOpen = () => {
    setOpenSyncConfirm(true);
  };

  return (
    <div style={{marginBottom: '10px'}}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          style={{
            fontFamily: "Baloo2",
            fontSize: isMobile ? "24px" : "32px",
            fontWeight: 800,
            color: "white",
            margin: '1% 2%'
          }}
        >
          Quests(16)
        </Typography>

      
        <Button
            sx={{
              backgroundImage: `url(${synBg})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "163px",
              height: "81px",
              color: "white",
              fontFamily: "Baloo2",
              fontSize: "18px",
              textTransform: "none",
              boxShadow: "none",
              cursor: "pointer",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => handleOpen()}
          >
            Sync Quests
          </Button>
      </Box>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "28px" : "25px",
          margin: isMobile ? "5% 10%" : "2% 2%",
        }}
      >
        {quest.map((item, index) => (
          <div
            key={index}
            style={{
              flex: isMobile
                ? "flex: 1 1 calc(100% / 2 - 10px) "
                : "1 1 calc(100% / 6 - 21px)",
              maxWidth: isMobile
                ? "calc(100% / 2 - 16px)"
                : "calc(100% / 6 - 16px)",
              textAlign: "center",
              height: isMobile ? "250px" : "330px",
              width: isMobile ? "400px" : "250px",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "60%",
                borderRadius: "14px 14px 0 0",
                cursor: "pointer",
              }}
              onClick={() => handleClick(item.contest_id, item.title)}
            >
              <div
                style={{
                  position: "absolute",
                  backgroundImage:
                    "linear-gradient(to bottom, rgb(0,0,0,0.9), transparent)",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  gap: "5px",
                  height: "20%",
                  width: "100%",
                  borderRadius: "14px 14px 0 0",
                }}
              >
                {/* <img
                  alt={"score-icon"}
                  style={{
                    height: isMobile ? "20px" : "auto",
                    width: isMobile ? "20px" : "auto",
                    left: isMobile ? "10%" : 0,
                    top: isMobile ? 2 : 5,
                  }}
                  src={scoreIcon}
                ></img> */}
                <Typography
                  sx={{
                    fontFamily: "Baloo2",
                    fontWeight: 800,
                    fontSize: isMobile ? "14px" : "18px",
                    color: "white",
                  }}
                >{`${item.winning_points} Points`}</Typography>

                <img
                  onClick={(e) => handleOpenMenu(e, item)}
                  src={threeDotsIcon}
                  style={{ position: "absolute", right: "5px" }}
                />
                <Menu
                  anchorEl={menuState.anchorEl}
                  open={Boolean(menuState.anchorEl)}
                  onClose={handleCloseMenu}
                  
                >
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpen(menuState.item.contest_id);
                      handleCloseMenu();
                    }}
                  >
                    Trigger Activity Notification
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/createContest/Quest", {
                        state: { item: menuState.item },
                      });
                      handleCloseMenu();
                    }}
                  >
                    Edit
                  </MenuItem>
                </Menu>
              </div>
              <img
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "14px 14px 0 0",
                }}
                src={`${process.env.REACT_APP_CDN_URL}/MICRO_CONTESTS/${item.contest_id}/IMAGES/medium/${item.ct_banner}`}
                alt="Quest"
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "-15px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  borderRadius: "8px",
                  textTransform: "uppercase",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  padding: "5px 12px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.8)",
                    filter: "blur(1px)",
                    borderRadius: "8px",
                  }}
                ></div>

                <Typography
                  style={{
                    position: "relative",
                    color: "black",
                    fontSize: isMobile ? "12px" : "16px",
                    fontWeight: "500",
                    textAlign: "center",
                    fontFamily: "Baloo2",
                  }}
                >
                  {difficultyLabels[item.difficulty_level - 1] || "Hard"}
                </Typography>
              </div>
            </div>

            <div style={{ height: "40%" }}>
              <div
                style={{
                  background: `url(${
                    difficultyBg[item.difficulty_level - 1] || Expert
                  })`,
                  backgroundSize: "100% 100%",
                  height: "100%",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Baloo2",
                    color: "white",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "800",
                    textAlign: "center",
                    padding: "15px 0 0 0",
                  }}
                >
                  {item.title.length > 14
                    ? item.title.slice(0, 14) + "..."
                    : item.title}
                </Typography>

                <Typography
                  style={{
                    fontFamily: "Baloo2",
                    color: "white",
                    fontSize: isMobile ? "8px" : "14px",
                    fontWeight: "500",
                    textAlign: "center",
                    padding: "5px",
                    whiteSpace: "normal",
                  }}
                >
                  {item.description.length > 40
                    ? item.description.slice(0, 40) + "..."
                    : item.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(180px)", // ✅ apply blur to background
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // ✅ semi-transparent white
                    borderRadius: "20px",
                    padding: "5px 10px",
                    width: "40%",
                    margin: "0 30%",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Baloo2",
                      color: "white",
                      fontSize: isMobile ? "8px" : "12px",
                      fontWeight: 500,
                      textAlign: "center",
                      whiteSpace: "normal",
                    }}
                  >
                    {item.category}
                  </Typography>
                </Box>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Trigger Notication Activity"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? You Want to Trigger Notification Actitvity
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleTriggerActivity()} autoFocus>
            ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth={"xs"} open={openSyncConfirm} fullWidth={"70px"}>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography> Are you sure?</Typography>
          <Typography>you want to Sync Quests</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSync} variant="contained">
            Yes
          </Button>
          <Button onClick={handleClose} variant="outlined">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Quests;
