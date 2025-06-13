import style from "../DeletedPost/style.module.css";
import ApiCall from "../API/api";
import { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery
} from "@mui/material";
import Loader from "../Loader/loader";
import { useParams, useLocation } from "react-router-dom";

const DeletedPost = ({ userDeletedData, userId, selectedTab }) => {
  const {
    getDeletedPost,
    getUserDetails,
    deleteS3Post,
    deletePostJson,
    deletedUserS3Post,
    deletedUserPostJson,
  } = ApiCall();
  const [data, setData] = useState([]);
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [checkedItems, setCheckedItems] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();
  const [openAlert, setOpenAlert] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [openAlertForS3, setOpenAlertForS3] = useState(false);
  const [disabledS3, setDisabledS3] = useState(false);
  const [disabledJson, setDisabledJson] = useState(false);
  const [selectionAlert, setSelectionAlert] = useState(false);
  const location = useLocation();
  const isDeletedPost = location.pathname === "/deleted-post";
   const isMobile = useMediaQuery('(max-width:600px)');

  const handleClick = (type) => {
    if (checkedItems.length === 0) {
      setOpenAlert(true);
    } else {
      setOpenConfirmation(true);
      setDeleteType(type);
    }
  };

  const handleDelete = async () => {
    const ids = checkedItems.map((item) => item.workId).join(",");
    if (deleteType === "S3") {
      if (isDeletedPost) {
        const res = await deleteS3Post(ids);
      } else {
        const res = await deletedUserS3Post(userId, selectedTab, ids);
      }
      window.location.reload();
    } else {
      function checkFilesDeleted(data, checkeditems) {
        return checkeditems.every((item) => {
          const matchedData = data.find((d) => d.post_id === item.workId);
          return matchedData ? matchedData.files_deleted === true : false;
        });
      }

      const result = checkFilesDeleted(data, checkedItems);
      
      if (result) {
        if (isDeletedPost) {
        const res = await deletePostJson(ids);}
        else{
          const res = await deletedUserPostJson(userId, selectedTab, ids)

        }
        window.location.reload();
      } else {
        setOpenAlertForS3(true);
      }
    }

    setOpenAlert(false);
    setOpenConfirmation(false);
  };

  const handleClose = () => {
    setOpenAlert(false);
    setOpenConfirmation(false);
    setOpenAlertForS3(false);
    setSelectionAlert(false);
  };

  const transformedData = async (posts, users) => {
    const transformed = posts.map((item) => {
      const matchedItem = users.find((userItem) => {
        return userItem.uid === item.user_id;
      });

      const deletedDate = new Date(item.deleted_at.split("T")[0]);
      const differenceInMilliseconds = currentDate - deletedDate;
      const differenceInDays = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60 * 24)
      );

      return {
        user_id: item.user_id,
        post_id: item.post_id,
        deleted_at: differenceInDays,
        filename: item.files[0]?.name,
        defaultAvatar: matchedItem.defaultAvatar,
        firstname: matchedItem.firstname,
        avatar: matchedItem.avatar,
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
        const userIds = postsData.data.map((item) => item.user_id).join(",");
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
    if (location.pathname === "/deleted-post") {
      getPost();
    } else {
      setData(userDeletedData);
      setPageKey(null);
    }
  }, [userDeletedData]);

  const handleSelect = (workId, userId, deleted_at) => (event) => {
    if (isDeletedPost) {
      if (deleted_at > 30) {
        setCheckedItems((prevCheckedItems) => {
          if (event.target.checked) {
            return [...prevCheckedItems, { workId, userId }];
          } else {
            return prevCheckedItems.filter(
              (item) => item.workId !== workId || item.userId !== userId
            );
          }
        });
      } else {
        setSelectionAlert(true);
        setOpenAlert(true);
      }
    } else {
      setCheckedItems((prevCheckedItems) => {
        if (event.target.checked) {
          return [...prevCheckedItems, { workId, userId }];
        } else {
          return prevCheckedItems.filter(
            (item) => item.workId !== workId || item.userId !== userId
          );
        }
      });
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

  return (
    <>
      {isLoading && <Loader />}
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
      >
        <div style={{ padding: "10px" }}>
          <Button
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleClick("S3")}
          >
            Delete from S3
          </Button>
        </div>
        <div style={{ padding: "10px" }}>
          <Button
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleClick("json")}
          >
            Delete Json
          </Button>
        </div>
      </div>
      <div className={style[isMobile?"grid-container-detail-mob":"grid-container-detail"]}>
        {data.map((item) => {
          return (
            <div className={style[isMobile?"grid-item-detail-mob":"grid-item-detail"]}>
              {
                <div className={style["check-box"]}>
                  <Checkbox
                    {...label}
                    checked={checkedItems.some(
                      (checkedItem) =>
                        checkedItem.workId === item.post_id &&
                        checkedItem.userId === item.user_id
                    )}
                    onChange={handleSelect(
                      item.post_id,
                      item.user_id,
                      item.deleted_at
                    )}
                  />
                </div>
              }
              <div className={style["entries-image"]}>
                {item.files_deleted ? (
                  <>
                    <div
                      style={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <img
                        src="https://hesolutions.com.pk/wp-content/uploads/2019/01/picture-not-available.jpg"
                        alt="Default Image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "black",
                          backgroundColor: "white",
                          padding: "10px",
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
                    </div>
                  </>
                ) : (
                  <img
                    src={
                      selectedTab === "book"
                        ? `${CDN_URL}/${item.user_id}/BOOKS/IMAGES/medium/${item.cover[0].name}`
                        : `${CDN_URL}/${item.user_id}/WORKS/IMAGES/medium/${
                            item.filename ? item.filename : item.files[0].name
                          }`
                    }
                    alt={item.filename}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>

              <div className={style[isMobile? "avatar-detail-mob":"avatar-detail"]}>
                <div className={style["avatar-img"]}>
                  <Avatar
                    src={
                      item.defaultAvatar
                        ? `${CDN_URL}/APP/UserAvatars/${item.avatar}`
                        : `${CDN_URL}/${item.user_id}/PROFILE/IMAGES/filetype/${item.avatar}`
                    }
                    sx={{ height: isMobile?20:30, width: isMobile?20:30 }}
                  ></Avatar>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {/* Truncate `firstname` */}
                  <Typography
                    style={{
                      maxWidth: "100px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      padding: "5px",
                      fontSize: isMobile? '9px':"14px",
                      fontWeight: "600",
                    }}
                  >
                    {item.firstname}
                  </Typography>
                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        padding: "5px",
                        fontSize: isMobile? '7px':"10px",
                        opacity: "60%",
                      }}
                    >
                      {`Deleted at `}
                    </Typography>
                    <Typography
                      style={{
                        padding: "5px",
                        fontSize: isMobile? '7px':"10px",
                      }}
                    >
                      {`${item.deleted_at} days ago`}
                    </Typography>
                  </div>
                </div>
              </div>
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
export default DeletedPost;
