import React, { useEffect, useState } from "react";
import apiCall from "../API/api";
import { Typography, Button, Checkbox } from "@mui/material";
import Loader from "../Loader/loader";

const Comments = () => {
  const { getCommentsList, approveComments } = apiCall();
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [data, setData] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [checkedItems, setCheckedItems] = useState([]);
  const [disable, setDisable] = useState(false);
  const [selectedType, setSelectedType] = useState("unapproved");

  const handleSelect = (commentId) => {
    setCheckedItems((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const fetchData = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    const type = selectedType === "unapproved" ? 0 : 1;
    try {
      let result = await getCommentsList(type, pageKey);
      setData((prev) => [...prev, ...result.data]);
      if (result?.page) {
        setPageKey(result?.page);
      } else {
        setPageKey(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (state) => {
    try {
      setDisable(true);
      const ids = checkedItems.join(",");
      const type = "post";
      const response = await approveComments(ids, state, type);
      setCheckedItems([]);
    } catch (error) {
      console.error("Error during approval:", error);
    } finally {
      setDisable(false);
    }
  };

  const changeCommentType = (event) => {
    setSelectedType(event.target.value);
    setData([]);
    setPageKey("");
  };

  useEffect(() => {
    fetchData();
  }, [nextPage, selectedType]);

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
    <div>
      <div style={{ marginTop: "3%" }}>
        <label>
          <input
            type="radio"
            onChange={changeCommentType}
            value="approved"
            checked={selectedType === "approved"}
          ></input>
          Approved comments
        </label>
        <label style={{ paddingLeft: "10px" }}>
          <input
            onChange={changeCommentType}
            type="radio"
            value="unapproved"
            checked={selectedType === "unapproved"}
          ></input>
          Pending Approval comments
        </label>
      </div>
      <Typography
        sx={{ textAlign: "center", fontSize: "52px", color: "black" }}
      >
        Comments
      </Typography>
      {isLoading && <Loader />}
      {checkedItems.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "20px",
            position: "absolute",
            right: "10%",
            top: "18%",
          }}
        >
          <Button
            variant="outlined"
            color="success"
            onClick={() => handleApprove(1)}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleApprove(0)}
          >
            Reject
          </Button>
        </div>
      )}
      {data.length === 0 && <Typography sx={{textAlign: "center", marginTop: '10%'}}>No comments to approve</Typography>}

      {data.map((item) => (
        <div
          style={{
            margin: "0 10% ",
            border: "1px solid rgb(0, 0, 0,0.7)",
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            {selectedType === "unapproved" && (
              <Checkbox
                {...label}
                checked={checkedItems.includes(item.comment_id)}
                onChange={() => handleSelect(item.comment_id)}
              />
            )}
            <Typography style={{ overflowWrap: "break-word" }}>
              {item.text}
            </Typography>
          </div>
          {checkedItems.includes(item.comment_id) &&
            checkedItems.length <= 1 && (
              <div style={{ display: "flex", gap: "20px" }}>
                <Button
                  variant="outlined"
                  color="success"
                  disabled={checkedItems.length === 0}
                  onClick={() => handleApprove(1)}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={checkedItems.length === 0}
                  onClick={() => handleApprove(0)}
                >
                  Reject
                </Button>
              </div>
            )}
        </div>
      ))}
    </div>
  );
};
export default Comments;
