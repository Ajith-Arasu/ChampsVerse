import {
  useMediaQuery,
  Button,
  Avatar,
  Typography,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import ApiCall from "../API/api";
import Loader from "../Loader/loader";
import style from "../Achievement/style.module.css";
import frame from "../../asserts/achievement-Frame.png";

const Achievement = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedTab, setSelectedTab] = useState("ongoing");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [pagekey, setPagekey] = useState("");
  const { achievementsList, getUserDetails, getPost, approveAchievement } =
    ApiCall();
  const [data, setData] = useState([]);
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  const [checkedItems, setCheckedItems] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [openAlert, setOpenAlert] = useState(false);
  const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
  const [selected, setSelected] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    if (isLoading || pagekey === null) return;
    setIsLoading(true);
    try {
      if (pagekey !== null) {
        const result = await achievementsList(pagekey);
        const ids = result.data.map((item) => item.post_id).join(",");
        const userIds = result.data.map((item) => item.user_id).join(",");
        const userData = await getUserDetails(userIds);
        let res = await getPost(ids);
        const reorderedPostData = result.data
          .map((feedItem) => {
            const post = res.data.find(
              (post) => post.post_id === feedItem.post_id
            );
            if (post) {
              const foundItem = userData.find(
                (item) => item.uid === post.user_id
              );
              if (foundItem) {
                post.avatar = foundItem.avatar;
                post.defaultAvatar = foundItem.defaultAvatar;
                post.name = foundItem.firstname;
              }
              // Append feed_id from feedItem
              post.feed_id = feedItem.feed_id;
              post.is_approved = feedItem.is_approved;
            }
            return post;
          })
          .filter((post) => post !== undefined);
        if (result?.page) {
          setPagekey(result?.page);
        } else {
          setPagekey(null);
        }

        setData((prev) => [...prev, ...reorderedPostData]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [nextPage]);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;

    if (
      scrollTop + windowHeight >= documentHeight - 5 &&
      !isLoading &&
      pagekey !== null
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

  const handleShownToPublic = (item) => {
    setOpenConfirmAlert(true);
    setSelected(item);
  };

  const handleShow = () => {
    setOpenConfirmAlert(false);
    const requestBody = {
      post_id: selected.post_id,
      is_approved: 1,
      feed_id: selected.feed_id,
      created_at: selected.created_at,
    };
    approveAchievement(requestBody);
  };

  const handleClose = () => {
    setOpenConfirmAlert(false);
    setSelected([]);
  };
  const handleClick = (tab) => {
    setSelectedTab(tab);
  }
  const handleSelect = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((uid) => uid !== item) // Deselect
        : [...prevSelected, item] // Select
    );
  };
  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      // unselect all
      setSelectedItems([]);
      setIsAllSelected(false);
    } else {
      // select all items by their IDs or keys
      const allItemKeys = data.map(
        (item, index) => item.id || `${item.user_id}-${item.files[0]?.name || index}`
      );
      setSelectedItems(allItemKeys);
      setIsAllSelected(true);
    }
  };


  return (
    <>
      <div
        style={{
          padding: isMobile ? '70px 20px 0px 20px' : '100px 80px 0px 80px',
          justifyContent: "center",
          alignItems: "center"
        }}>
        <div className={style["achievement-title"]}>
          <Typography
            variant="h6"
            style={{
              fontFamily: 'Baloo2',
              fontWeight: '800',
              color: '#FFFFFF',
              fontSize: isMobile ? '20px' : '32px',
              display: 'inline',
              whiteSpace: 'nowrap',
            }}
          >
            All ACHIEVEMENTS{" "}
            <Typography
              component="span"
              style={{
                fontSize: isMobile ? '16px' : '24px',
                fontWeight: '600',
                color: '#FFFFFF',
                display: 'inline',
                whiteSpace: 'nowrap',
              }}
            >
              ({data.length})
            </Typography>
          </Typography>
          <div className={style["button-group"]}>
            {isMobile ? (

              // Mobile View: show "Select All" with circular checkbox
              <div
                className={style["select-all-wrapper"]}
                onClick={handleSelectAllToggle}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "10px",
                }}
              >
                {/* Round Checkbox */}
                <div
                  style={{
                    height: isMobile ? "16px" : "24px",
                    width: isMobile ? "16px" : "24px",
                    borderRadius: "20px",
                    border: "1.5px solid #1F1D3A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                </div>
                <Typography
                  sx={{
                    fontFamily: "Baloo2",
                    fontWeight: "800",
                    fontSize: isMobile ? "13px" : "15px",
                    alignItems: "center",
                    lineHeight: "100%",
                    background: "linear-gradient(to right, #ffdd01, #ffb82a)",
                    boxShadow: "0px 2.22px 2.22px 0px rgba(158, 22, 53, 0.25)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >Select All</Typography>
              </div>
            ) : (

              <>          <div
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
                  clearCDN
                </Typography>
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
                    clear.json
                  </Typography>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "21px" : "21px",
          margin: isMobile ? "5% 2% 0% 2%" : "5% 5% 0% 5%",
          marginTop: "83px"

        }}
      >
        {data.map((item, index) => (
          <div key={index}
            style={{
              flex: isMobile
                ? "1 1 calc(100% / 2 - 10px)"
                : "1 1 calc(100% / 4 - 21px)",
              maxWidth: isMobile
                ? "calc(100% / 2 - 16px)"
                : "calc(100% / 4 - 16px)",
              textAlign: "center",
              height: isMobile ? "200px" : "250px",
              width: isMobile ? "110px" : "150px",
              backgroundImage: `url(${frame})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              padding: isMobile ? "20px" : "20px",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <div className={style["book-image"]}>
              <img
                src={`${CDN_URL}/${item.user_id}/WORKS/IMAGES/medium/${item.files[0].name}`}
                alt="acheivementimage"
              />
              <button
                onClick={() => handleSelect(item.id)}
                style={{
                  position: "absolute",
                  top: isMobile ? "6px" : "8px",
                  right: isMobile ? "6px" : "8px",
                  height: isMobile ? "21px" : "32px",
                  width: isMobile ? "21px" : "32px",
                  border: isMobile ? "2px solid #FFFFFF" : "3px solid #FFFFFF",
                  background: "transparent",
                  borderRadius: isMobile ? "13px" : "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                title="Select"
              >

                {selectedItems.includes(item.id) && (
                  <span
                    style={{
                      height: isMobile ? "6px" : "16px",
                      width: isMobile ? "6px" : "16px",
                      borderRadius: isMobile ? "6px" : "10px",
                      background: "linear-gradient(135deg, #FFDD01, #FFB828)",
                    }}
                  />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog maxWidth={"xs"} open={openConfirmAlert} fullWidth={"70px"}>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography> Are you sure?</Typography>
          <Typography>you want to show to public</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShow} variant="contained">
            Yes
          </Button>
          <Button onClick={handleClose} variant="outlined">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Achievement;
