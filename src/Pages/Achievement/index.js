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
import apiCall from "../API/api";

const Achievement = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [pagekey, setPagekey] = useState("");
  const { achievementsList, getUserDetails, getPost, approveAchievement } =
    apiCall();
  const [data, setData] = useState([]);
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  const [checkedItems, setCheckedItems] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [openAlert, setOpenAlert] = useState(false);
  const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
  const [selected, setSelected] = useState([]);

  const fetchData = async () => {
    try {
      if (pagekey !== null) {
        const result = await achievementsList("");
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

        setData(reorderedPostData);
        if (result?.page) {
          setPagekey(result?.page);
        } else {
          setPagekey(null);
        }
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
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
  useEffect(() => {
    fetchData();
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
              <Typography>{item.name}</Typography>
              {item.is_approved === 0 && (
                <Button
                  variant="contained"
                  style={{ padding: "5px" }}
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
