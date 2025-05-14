import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import style from "../Contests/style.module.css";
import { useEffect, useState } from "react";
import apiCall from "../API/api";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/loader";
import React, { useRef } from "react";
import Compress from "compress.js";
import { fromBlob, blobToURL } from "image-resize-compress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateContest from './createContest'

const Contests = () => {
  const [selectedTab, setSelectedTab] = useState("ongoing");
  const isMobile = useMediaQuery("(max-width:600px)");
  const {
    getContestList,
    createContest,
    getUrlContestImage,
    uploadIMG,
    updateContestStatus,
  } = apiCall();
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tabSwitch, setTabSwitch] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const compress = new Compress();
  const [contestCreation, setContestCreation] = useState(false);
  const [selectedType, setSelectedType] = useState("CONTEST");
  const [TypeSwitch, setTypeSwitch] = useState("false");

  const getContests = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        const result = await getContestList(selectedTab, pageKey, selectedType);

        if (result?.page) {
          setPageKey(result?.page);
        } else {
          setPageKey(null);
        }
        setIsLoading(false);
        setData((prev) => [...prev, ...result.data]);
      }
    } finally {
    }
  };

  useEffect(() => {
    if (selectedTab !== "new") {
      getContests();
    }
    setTabSwitch(false);
    setTypeSwitch(false);
  }, [nextPage, tabSwitch, TypeSwitch]);

  const handleClick = (tab) => {
    setSelectedTab(tab);
    setTabSwitch(true);
    setPageKey("");
    setData([]);
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
      setNextPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCategory = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickToDetail = (contestId, title, categories) => {
    selectedTab === "ongoing" &&
      navigate("/contestdetail", {
        state: {
          contestId,
          title,
          categories,
          selectedType,
        },
      });
  };

  const handleCreation = () => {
    setContestCreation(true);
  };


  const changeContestType = (event) => {
    setSelectedType(event.target.value);
    setTypeSwitch(true);
    setPageKey("");
    setData([]);
  };

  const statusUpdate = async (contestId) => {
    const res = await updateContestStatus(contestId, selectedType);
    if (res.success) {
    }
  };

  return (
    <>
      {isLoading && <Loader />}

    
      {!contestCreation && (
        <div
          className={style[isMobile ? "tab-Section-mob" : "tab-Section"]}
          style={{ marginTop: isMobile && "10%" }}
        >
          <div className={style["left-corner"]}>
            <label>
              <input
                type="radio"
                onChange={changeContestType}
                value="CONTEST"
                checked={selectedType === "CONTEST"}
              ></input>
              Contest
            </label>
          </div>
          <div
            className={style[isMobile ? "section-mob" : "section"]}
            onClick={() => handleClick("ongoing")}
          >
            <img
              src={
                selectedTab === "ongoing"
                  ? "/button-normal.png"
                  : "/emptySection.png"
              }
            ></img>
            <Typography
              className={
                selectedTab === "ongoing"
                  ? style["center-alligned"]
                  : style["unselected-item"]
              }
            >
              Ongoing
            </Typography>
          </div>
          <div
            className={style[isMobile ? "section-mob" : "section"]}
            onClick={() => handleClick("completed")}
          >
            <img
              src={
                selectedTab === "completed"
                  ? "/button-normal.png"
                  : "/emptySection.png"
              }
            ></img>
            <Typography
              style={{ fontSize: isMobile ? "12px" : "1rem" }}
              className={
                selectedTab === "completed"
                  ? style["center-alligned"]
                  : style["unselected-item"]
              }
            >
              Completed
            </Typography>
          </div>
          <div
            className={style[isMobile ? "section-mob" : "section"]}
            onClick={() => handleClick("upcoming")}
          >
            <img
              src={
                selectedTab === "upcoming"
                  ? "/button-normal.png"
                  : "/emptySection.png"
              }
            ></img>
            <Typography
              style={{ fontSize: isMobile ? "12px" : "1rem" }}
              className={
                selectedTab === "upcoming"
                  ? style["center-alligned"]
                  : style["unselected-item"]
              }
            >
              Upcoming
            </Typography>
          </div>

        </div>
      )}

      {contestCreation && <CreateContest handleClick={handleClick} setContestCreation={setContestCreation}/>}
      {selectedTab !== "new" && !contestCreation && (
        <div
          className={style[isMobile ? "grid-container-mob" : "grid-container"]}
          style={{ marginTop: isMobile && "20px" }}
        >
          {data.map((item) => {
            return (
              <div
                className={style[isMobile ? "grid-item-mob" : "grid-item"]}
                onClick={() =>
                  handleClickToDetail(
                    item.contest_id,
                    item.title,
                    item.contest_entry_categories
                  )
                }
              >
                <div className={style["image"]}>
                  <img
                    src={`https://dcp5pbxslacdh.cloudfront.net/${selectedType}S/${item.contest_id}/IMAGES/medium/${item.ct_banner}`}
                  ></img>
                </div>
                <div className={style["content"]}>
                  <Typography
                    sx={{
                      fontSize: isMobile ? "24px" : "1.5rem",
                      fontWeight: 600,
                      lineHeight: "1.2",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: isMobile ? "18px" : "1rem",
                      padding: "16px",
                    }}
                  >
                    Due:2 days left
                  </Typography>

                  {selectedTab === "upcoming" && (
                    <Button
                      style={{ color: "white", backgroundColor: "#007bff" }}
                      onClick={() => statusUpdate(item.contest_id)}
                    >
                      Move to Ongoing
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Contests;
