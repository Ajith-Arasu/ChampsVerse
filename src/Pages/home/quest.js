import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader/loader";
import scoreIcon from "../../asserts/QuestCoinsIcon.png";
import ApiCall from "../API/api";

const Quests = () => {
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageKey, setPageKey] = useState("");
  const { getQuestList, triggerActivityApi, syncQuests } = ApiCall();
  const Easy =
    "radial-gradient(67.32% 67.32% at 50% 50%, #27B807 0%, #27D101 100%)";
  const Moderate =
    "radial-gradient(70.47% 70.47% at 50% 50%, #DA9E00 0%, #FFB900 100%)";
  const Advanced =
    "radial-gradient(68.9% 68.9% at 50% 50%, #FF8800 0%, #FF7700 100%)";
  const Expert =
    " radial-gradient(96.46% 96.46% at 50% 50%, rgba(213, 0, 0, 0.8) 0%, rgba(255, 0, 0, 0.8) 100%)";

  
  const handleClick = (contestId, title) => {
    navigate("/quests-Works", { state: { contestId, title } });
  };
  

  const difficultyLabels = ["Easy", "Moderate", "Advanced", "Expert"];

  const difficultyBg = [Easy, Moderate, Advanced, Expert];

  const fetchQuest = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        const questData = await getQuestList(pageKey);
        setData(questData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuest();
  }, []);

  return (
    <>
      <div>
        <Box style={{display: 'flex', justifyContent: 'space-between', marginTop: '2%', alignItems: 'center'}}>
          <Typography
            style={{ fontSize: "32px", fontWeight: 800, color: "white" }}
          >{`Quests (12)`}</Typography>

          <Typography style={{fontSize: "12px", fontWeight: 400, color: "white", marginRight: '8%', cursor: 'pointer'}} onClick={() => navigate("/quests")}>View All</Typography>
        </Box>
        {isLoading && <Loader />}
        <div>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              padding: "16px 20px",
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "auto",
              whiteSpace: "nowrap",
              gap: "10px",
              width: "100%",
              alignItems: "center",
            }}
          >
            {data.map((item, index) => {
              const createdAt = new Date(item.created_at);
              const now = new Date();
              const diffInMilliseconds = now.getTime() - createdAt.getTime();
              const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
              const isLessThan7DaysOld = diffInDays < 8;
             
              return (
                <div
                  key={index}
                  onClick={() => handleClick(item.contest_id, item.title)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: isMobile ? "250px" : "350px",
                    width: isMobile ? "150px" : "220px",
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "60%",
                      borderRadius: "14px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        gap: "5px",
                        height: "20%",
                        width: "100%",
                        backgroundImage:
                          "linear-gradient(to bottom, rgb(0,0,0,0.9), transparent)",
                        borderRadius: "14px",
                      }}
                    >
                      <img
                        alt={"score-icon"}
                        style={{
                          height: isMobile ? "20px" : "auto",
                          width: isMobile ? "20px" : "auto",
                          left: "25%",
                          top: isMobile ? 2 : 5,
                        }}
                        src={scoreIcon}
                      ></img>
                      <Typography
                        sx={{
                          fontFamily: "Baloo2",
                          fontWeight: 800,
                          fontSize: isMobile ? "14px" : "24px",
                          color: "white",
                        }}
                      >{`${item.winning_points} Points`}</Typography>
                    </div>

                    <img
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "14px 14px 0 0",
                        zIndex: 0,
                      }}
                      src={`${process.env.REACT_APP_CDN_URL}/MICRO_CONTESTS/${item.contest_id}/IMAGES/medium/${item.ct_banner}`}
                      alt="Quest"
                    />
                    {isLessThan7DaysOld && (
                      <Typography
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "8px 0 16px 0",
                          width: isMobile ? "30%" : "20%",
                          textAlign: "center",
                          position: "absolute",
                          top: "20%",
                          zIndex: 1,
                        }}
                      >
                        New
                      </Typography>
                    )}

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
                          width: "100%",
                          left: 0,
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
                          fontSize: isMobile ? "12px" : "22px",
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
                        background:
                          difficultyBg[item.difficulty_level - 1] || Expert,
                        backgroundSize: "100% 100%",
                        height: "100%",
                        borderRadius: "0 0 14px 14px",
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: "Baloo2",
                          color: "white",
                          fontSize: isMobile ? "16px" : "29px",
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
                          height: isMobile ? "20%" : "30%",
                        }}
                      >
                        {item.description.length > (isMobile ? 60 : 60)
                          ? item.description.slice(0, isMobile ? 60 : 60) +
                            "..."
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
                            fontSize: isMobile ? "8px" : "14px",
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
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default Quests;
