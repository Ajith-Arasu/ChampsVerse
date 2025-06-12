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

const Achievement = () => {
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

  return (
    <>
      <Typography
        style={{
          fontSize: isMobile ? "21px" : "48px",
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        Achievements
      </Typography>
      {isLoading && <Loader />}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "21px" : "21px",
          margin: isMobile ? "5% 2%" : "5% 5%",
        }}
      >
        {data.map((item) => (
          <div
            style={{
              flex: isMobile
                ? "1 1 calc(100% / 2 - 10px)"
                : "1 1 calc(100% / 4 - 21px)",
              maxWidth: isMobile
                ? "calc(100% / 2 - 16px)"
                : "calc(100% / 4 - 16px)",
              textAlign: "center",
              height: isMobile ? "150px" : "250px",
              width: isMobile ? "80px" : "150px",
              border: "2px solid black",
            }}
          >
            <div
              style={{
                height: "80%",
                width: "100%",
                position: "relative",
              }}
            >
              <img
                src={`${CDN_URL}/${item.user_id}/WORKS/IMAGES/medium/${item.files[0].name}`}
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                alt=""
              />
            </div>
            <div
              style={{
                display: "flex",
                margin: "5px",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Avatar
                src={
                  item.defaultAvatar
                    ? `${CDN_URL}/APP/UserAvatars/${item.avatar}`
                    : `${CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
                }
                sx={{
                  height: isMobile ? 30 : 40,
                  width: isMobile ? 30 : 40,
                }}
              />
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: isMobile ? 80 : 120,
                  display: "block",
                }}
              >
                {item.name}
              </Typography>

              {item.is_approved === 0 && (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    padding: isMobile ? "2px 6px" : "6px 12px",
                    fontSize: isMobile ? "10px" : "14px",
                    minWidth: isMobile ? "auto" : "64px",
                  }}
                  onClick={() => {
                    handleShownToPublic(item);
                  }}
                >
                  public
                </Button>
              )}
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
