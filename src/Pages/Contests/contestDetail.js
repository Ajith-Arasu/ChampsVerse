import {
  Typography,
  Checkbox,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import style from "../Contests/style.module.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiCall from "../API/api";
import Loader from  "../Loader/loader";

const ContestDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contestId, title, categories,selectedType } = location.state || {};
  const {
    getContestEntries,
    getPost,
    getUserDetails,
    addWinnersCategory,
    announceContestResult,
  } = apiCall();
  const [isLoading, setIsLoading] = useState(false);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [pageKey, setPageKey] = useState("");
  const [data, setData] = useState([]);
  const [body, setBody] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [openConfirmation, setopenConfirmation] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [success, setSuccess] = useState("false");
  const [loader, setLoader] = useState(true);
  const CDN_URL = process.env.REACT_APP_CDN_URL;


  const handleClick = () => {
    if (checkedItems.length > 0) {
      setOpen(true);
    } else {
      setOpenAlert(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setopenConfirmation(false);
    setOpenAlert(false);
  };

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleAnnounce = () => {
    announceContestResult(contestId,selectedType);
    setopenConfirmation(false);
    navigate("/contests");
  };

  const transformedData = async (post, userData, result) => {
    const data = post.map((post) => {
      const user = userData.find((user) => user.uid === post.user_id);
      const entry = result.data.find((item) => item.user_id === post.user_id);

      return {
        postId: post.post_id,
        filename: post.files[0].name,
        userID: user.uid,
        defaultAvatar: user.defaultAvatar,
        avatar: user.avatar,
        firstname: user.firstname,
        title: entry.title.split("_").pop(),
      };
    });
    return data;
  };

  const getEntriesWork = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      setLoader(true);
      if (pageKey !== null) {
        const result = await getContestEntries(contestId, pageKey);
        const ids = result.data
          .map((item) => (item.work_id ? item.work_id : item.work_ids[0]))
          .join(",");
        const userIds = result.data.map((item) => item.user_id).join(",");
        let users = await getUserDetails(userIds);
        let res = await getPost(ids);
        const entriesData = await transformedData(res.data, users, result);
        setData((prev) => [...prev, ...entriesData]);
        if (result?.page) {
          setPageKey(result?.page);
        } else {
          setPageKey(null);
        }
      }
    } finally {
      setLoader(false);
      setIsLoading(false);
      setSuccess(false);
    }
  };

  useEffect(() => {
    getEntriesWork();
  }, [success]);

  const handleSelect = (workId, userId) => (event) => {
    setCheckedItems((prevCheckedItems) => {
      if (event.target.checked) {
        return [...prevCheckedItems, { workId, userId }];
      } else {
        return prevCheckedItems.filter(
          (item) => item.workId !== workId || item.userId !== userId
        );
      }
    });
  };

  const handleConfirm = () => {
    setopenConfirmation(true);
  };

  const handleWinnersMap = async () => {
    const formattedBody = {
      entries: checkedItems.map((item) => ({
        title: category,
        work_id: item.workId,
        user_id: item.userId,
        work_type: 'POST',
        type: "Winner",
      })),
    };
    try {
      let result = await addWinnersCategory(contestId, formattedBody,selectedType);
      if (result.statusCode === 200) {
        setSuccess(true);
        setData([]);
        setOpen(false);
        setCheckedItems([]);
        setCategory("");
        setPageKey("");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <>
    {isLoading && <Loader/>}
      <div className={style["detail-header"]}>
        <Typography sx={{ fontWeight: "700", fontSize: "2rem" }}>
          {title}
        </Typography>
        <div className={style["button-container"]}>
          <Button variant="contained" onClick={() => handleClick()}>
            Add Winners
          </Button>
          <Button variant="contained" onClick={() => handleConfirm()}>
            Announce Result
          </Button>
        </div>
      </div>
      <div className={style["grid-container-detail"]}>
        {loader ? (
          <div
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          data.map((item) => {
            return (
              <div className={style["grid-item-detail"]}>
                {
                  <div className={style["check-box"]}>
                    <Checkbox
                      {...label}
                      checked={checkedItems.some(
                        (checkedItem) =>
                          checkedItem.workId === item.postId &&
                          checkedItem.userId === item.userID
                      )}
                      onChange={handleSelect(item.postId, item.userID)}
                    />
                  </div>
                }
                <div className={style["entries-image"]}>
                  <img
                    src={`${CDN_URL}/${item.userID}/WORKS/IMAGES/medium/${item.filename}`}

                    sx={{height:"100%",width:"100%",objectFit:"cover"}}
                  />
                </div>
                <div className={style["avatar-detail"]}>
                  <div className={style["avatar-img"]}>
                    <Avatar
                      src={
                        item.defaultAvatar
                          ? `${CDN_URL}/APP/UserAvatars/${item.avatar}`
                          : `${CDN_URL}/${item.userID}/PROFILE/IMAGES/filetype/${item.avatar}`
                      }
                      sx={{ height: 40, width: 40 }}
                    ></Avatar>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%", // Ensure proper alignment within the parent container
                    }}
                  >
                    {/* Truncate `firstname` */}
                    <Typography
                      style={{
                        maxWidth: "100px", // Adjust width as needed
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.firstname}
                    </Typography>

                    {/* Title aligned to the right */}
                    {item.title !== "None" && (
                      <Typography
                        style={{
                          background:
                            "linear-gradient(90deg, #461289 0%, #7E31E1 53%, #9421CD 100%)",
                          color: "white",
                          padding: "4px 7px",
                          borderRadius: "12px",
                          textAlign: "right",
                          marginLeft: "auto", // Push the title to the far right
                          whiteSpace: "nowrap", // Prevent wrapping
                        }}
                      >
                        {item.title}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Dialog maxWidth={"sm"} open={open} fullWidth={"70px"}>
        <DialogTitle>Winners Category</DialogTitle>
        <DialogContent>
          <FormControl sx={{ mt: 2, minWidth: 240 }}>
            <InputLabel htmlFor="max-width">Select Categories</InputLabel>
            <Select value={category} onChange={handleChange}>
              {categories.map((item) => (
                <MenuItem value={item.title} key={item.title}>
                  {item.title !== "" && item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleWinnersMap()}
            variant="contained"
            disabled={!category}
          >
            Add Winners Category
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth={"sm"} open={openAlert} fullWidth={"70px"}>
        <DialogContent>
          <Typography>Please select atleast one item </Typography>
        </DialogContent>
        <DialogActions>
          {" "}
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth={"xs"} open={openConfirmation} fullWidth={"70px"}>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography> Are you sure?</Typography>
          <Typography>you want to announce the result</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAnnounce} variant="contained">
            Announce
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ContestDetail;
