import Works from "../../Pages/Works/index";
import ApiCall from "../API/api";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  useMediaQuery,
} from "@mui/material";
import Loader from "../Loader/loader";
import ClearCDNbtn from "../../asserts/clearCdn.png";
import clearJsonBtn from "../../asserts/clearJson.png";

const DeletePost = () => {
  const {
    getDeletedPost,
    getUserDetails,
    deleteS3Post,
    deletePostJson,
    deletedUserS3Post,
    deletedUserPostJson,
  } = ApiCall();
  const [deleteType, setDeleteType] = useState("");
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const currentDate = new Date();
  const [selectionAlert, setSelectionAlert] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openAlertForS3, setOpenAlertForS3] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSelectItem = (postId, deleted_at) => {
    console.log("postId", postId);
    console.log("deletedAt", deleted_at);
    if (deleted_at > 30) {
      setCheckedItems((prev) =>
        prev.includes(postId)
          ? prev.filter((id) => id !== postId)
          : [...prev, postId]
      );
    } else {
      setSelectionAlert(true);
      setOpenAlert(true);
    }
  };

  const handleClick = (type) => {
    if (checkedItems.length === 0) {
      setOpenAlert(true);
    } else {
      setOpenConfirmation(true);
      setDeleteType(type);
    }
  };

  const handleClose = () => {
    setOpenAlert(false);
    setOpenConfirmation(false);
    setOpenAlertForS3(false);
    setSelectionAlert(false);
  };

  const transformedData = async (posts, users) => {
    const currentDate = new Date();

    const transformed = posts.map((item) => {
      const matchedItem = users.find(
        (userItem) => userItem.user_id === item.user_id.split("_")[0]
      );

      let differenceInDays = null;
      if (item.deleted_at) {
        const deletedDate = new Date(item.deleted_at.split("T")[0]);
        const differenceInMilliseconds = currentDate - deletedDate;
        differenceInDays = Math.floor(
          differenceInMilliseconds / (1000 * 60 * 60 * 24)
        );
      }

      return {
        user_id: item.user_id,
        post_id: item.post_id,
        deleted_at: differenceInDays,
        filename: item.files?.[0]?.name || null,
        defaultAvatar: matchedItem?.defaultAvatar ?? true,
        firstname: matchedItem?.firstname ?? "Unknown",
        avatar: matchedItem?.avatar ?? "default-avatar.png",
        files_deleted: item.files_deleted,
      };
    });

    return transformed;
  };

  const getPost = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        const postsData = await getDeletedPost(pageKey);
        const userIds = postsData.data
          .map((item) => item.user_id.split("_")[0])
          .join(",");
        console.log("userIds", userIds);
        const userData = userIds && (await getUserDetails(userIds));
        const transData = await transformedData(postsData.data, userData);
        setData((prev) => [...prev, ...transData]);
        if (postsData?.page) {
          setPageKey(postsData?.page);
        } else {
          setPageKey(null);
        }
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

  const handleDelete = async () => {
    const ids = checkedItems.join(",");
    if (deleteType === "S3") {
      const res = await deleteS3Post(ids);
      window.location.reload();
    } else {
      function checkFilesDeleted(data, checkedItems) {
        return checkedItems.every((id) => {
          const matchedData = data.find((d) => d.post_id === id);
          return matchedData ? matchedData.files_deleted === true : false;
        });
      }

      const result = checkFilesDeleted(data, checkedItems);
      if (result) {
        const res = await deletePostJson(ids);

        window.location.reload();
      } else {
        setOpenAlertForS3(true);
      }
    }
    setOpenAlert(false);
    setOpenConfirmation(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: isMobile ? "18px" : "32px",
            fontFamily: "Baloo2",
            marginTop: isMobile ? "10%" : "6px",
            color: "white",
            margin: isMobile && "10% 5%",
          }}
        >
          Deleted Post{" "}
          <span sx={{ fontSize: "24px", fontFamily: "Baloo2" }}>(23)</span>
        </Typography>
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <Button onClick={() => handleClick("S3")}>
              <img src={ClearCDNbtn}></img>
            </Button>
            <Button onClick={() => handleClick("json")}>
              <img src={clearJsonBtn}></img>
            </Button>
          </Box>
        )}
      </Box>
      {isLoading && <Loader />}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          margin: isMobile ? "0 3%" : "2% 0%",
          width: isMobile ? "100vw" : "100%",
        }}
      >
        {data.map((item, index) => {
          const avtimg = item.defaultAvatar
            ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${item.avatar}`
            : `${process.env.REACT_APP_CDN_URL}/${item.user_id}/PROFILE/IMAGES/medium/${item.avatar}`;
          return (
            <div
              key={index}
              style={{
                flex: isMobile
                  ? "1 1 calc(50% - 10px)" // 2 columns on mobile
                  : "1 1 calc(20% - 21px)", // 5 columns on desktop
                maxWidth: isMobile ? "calc(50% - 10px)" : "calc(20% - 21px)",
                textAlign: "center",
                height: isMobile ? "160px" : "208px",
                boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "20px",
                position: "relative",
                marginBottom: "2%",
                flexShrink: 0,
                flexGrow: 0,
                // ✅ Removed fixed width to allow responsive behavior
              }}
            >
              <img
                style={{
                  height: "80%",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "20px 20px 0 0",
                }}
                src={
                  item.files_deleted
                    ? "https://hesolutions.com.pk/wp-content/uploads/2019/01/picture-not-available.jpg"
                    : `${process.env.REACT_APP_CDN_URL}/${item.user_id}/WORKS/IMAGES/medium/${item.filename}`
                }
              ></img>
              {item.files_deleted && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                    backgroundColor: "white",
                    borderRadius: "5px",
                    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    height: "10%",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  File Deleted from S3
                </div>
              )}
              <Box
                sx={{
                  position: "absolute",
                  top: "5px",
                  display: "flex",
                  gap: "5px",
                  marginLeft: "5px",
                  boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
                  width: "97%",
                }}
                      onClick={() => {
              navigate("/profile", { state: { userId:item.user_id } })
            }}
              >
                <Avatar
                  src={
                    item.defaultAvatar
                      ? `${process.env.REACT_APP_CDN_URL}/APP/UserAvatars/${item.avatar}`
                      : `${process.env.REACT_APP_CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
                  }
                  sx={{
                    height: isMobile?20:30,
                    width:  isMobile?20:30,
                  }}
                ></Avatar>
                <Typography sx={{fontSize: isMobile&&'12px'}}>{item.firstname}</Typography>
              </Box>

              <Box
                sx={{
                  width: isMobile?"18px":"25px",
                  height:isMobile?"18px": "25px",
                  border: "2.7px solid rgba(31, 29, 58, 0.4)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  top: "5px",
                  right: "5px",
                  position: "absolute",
                }}
                onClick={() => handleSelectItem(item.post_id, item.deleted_at)}
              >
                <Box
                  sx={{
                    width: isMobile?"12px":"17px",
                    height: isMobile?"12px":"17px",
                    borderRadius: "50%",
                    background: checkedItems.includes(item.post_id)
                      ? "linear-gradient(232.05deg, #FFDD01 19.84%, #FFB82A 92.22%)"
                      : "transparent",
                  }}
                />
              </Box>

              <Box
                style={{
                  backdropFilter: "blur(180px)",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: "20%",
                  marginTop: "-5%",
                  borderRadius: " 0 0 20px 20px",
                }}
              >
                <Box sx={{ display: "flex", gap: "5px" }}>
                  <Typography sx={{fontSize:isMobile && "12px"}}>{`Deleted At : ${item.deleted_at} days ago`}</Typography>
                </Box>
                {/* <Box sx={{ display: "flex", gap: "5px" }}>
                  <img src={viewIcon} style={{ width: "25px" }}></img>
                  <Typography>{item.badges.views}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: "5px" }}>
                  <img src={heartIcon} style={{ width: "25px" }}></img>
                  <Typography>{item.badges.likes}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: "5px" }}>
                  <img src={commentIcon} style={{ width: "25px" }}></img>
                  <Typography>{item.badges.comments}</Typography>
                </Box> */}
              </Box>
            </div>
          );
        })}
      </div>
      <Dialog maxWidth={"sm"} open={openAlert} fullWidth={"70px"}>
        <DialogContent>
          <Typography>
            {selectionAlert
              ? `Only posts older than 30 days can be deleted. Please adjust your selection.`
              : `Please select atleast one item`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth={"xs"} open={openConfirmation} fullWidth={"70px"}>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography> Are you sure?</Typography>
          <Typography>you want to delete the post</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} variant="contained">
            Delete
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth={"sm"} open={openAlertForS3} fullWidth={"70px"}>
        <DialogContent>
          <Typography>you have selected Non S3 deleted file </Typography>
          <Typography> Please Remove those files and</Typography>
          <Typography> Try Again</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DeletePost;
