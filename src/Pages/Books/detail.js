import { useParams } from "react-router-dom";
import apiCall from "../API/api";
import { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import style from "../Books/style.module.css";

const Detail = () => {
  const { userId, bookId } = useParams();
  const { getBooksById, bookPublish, bookPublic } = apiCall();
  const [data, setData] = useState([]);
  const [refetch, setrefetch] = useState(false);
  const CDN_URL=process.env.REACT_APP_CDN_URL

  const handleClick = async (status) => {
    let result = await bookPublish(userId, bookId, status);
    if (result.statusCode === 200) {
      setrefetch(true);
    }
  };

  const publicBook = async (status) => {
    let state;
    if (status === "public") {
      state = 1;
    }
    const body = {
      is_public: state,
    };
    const res = await bookPublic(bookId, userId, body);

    if (res.statusCode) {
      setrefetch(true);
    }
  };

  const getDetail = async () => {
    try {
      const result = await getBooksById({
        targetIds: [
          {
            user_id: userId,
            book_id: bookId,
          },
        ],
      });
      console.log("result of detail==>", result.data[0]);
      setData(result.data[0]);
    } catch {
    } finally {
      setrefetch(false);
    }
  };
  useEffect(() => {
    getDetail();
  }, [refetch]);

  if (data) {
    return (
      <>
        <div className={style["creation-detail"]}>
          <div className={style["user-Detail"]}>
            <Typography className={style["sub-title"]} variant="h5">
              Title
            </Typography>
            <Typography className={style["value-Details"]}>
              {data?.title}
            </Typography>
          </div>
          <div className={style["user-Detail"]}>
            <Typography className={style["sub-title"]} variant="h5">
              Author
            </Typography>
            <Typography className={style["value-Details"]}>
              {data?.user_id}
            </Typography>
          </div>
          <div className={style["user-Detail"]}>
            <Typography className={style["sub-title"]} variant="h5">
              Date of Publications
            </Typography>
            <Typography className={style["value-Details"]}>
              {data?.created_at?.split("T")[0]}
            </Typography>
          </div>
          <div className={style["user-Detail"]}>
            <Typography className={style["sub-title"]} variant="h5">
              Genre
            </Typography>
            <Typography className={style["value-Details"]}>
              {data?.category}
            </Typography>
          </div>
          <div className={style["user-Detail"]}>
            <Typography className={style["sub-title"]} variant="h5">
              Pages
            </Typography>
            <Typography className={style["value-Details"]}>
              {data?.pages?.length}
            </Typography>
          </div>
          <div className={style["user-Detail"]}>
            <Typography className={style["sub-title"]} variant="h5">
              Status
            </Typography>
            <Typography className={style["value-Details"]}>
              {data?.status}
            </Typography>
          </div>
          {data.status === "approved" && data?.is_public && <div className={style["user-Detail"]}>
            <Typography className={style["sub-title"]} variant="h5">
              Public Visibility
            </Typography>
            <Typography className={style["value-Details"]}>
              {data?.is_public === 1 ? "True":"False"}
            </Typography>
          </div>}
          {data.status === "in_review" && (
            <div className={style["button"]}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleClick("approved")}
              >
                Publish
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleClick("rejected")}
              >
                Reject
              </Button>
            </div>
          )}

          {data.status === "approved" && data.is_public !== 1 &&(
            <div className={style["button"]}>
              <Button variant="contained" onClick={() => publicBook("public")}>
                Show To Public
              </Button>
            </div>
          )}
        </div>
        {/* <div className={style["grid-container-detail"]}>
          <div className={style["grid-item-detail"]}>
            <div className={style["cover-image"]}>
              <img
                src={`${CDN_URL}/${data?.user_id}/BOOKS/IMAGES/medium/${data?.cover?.[0]?.name}`}
                alt="Book Cover"
              />
            </div>
          </div>
          <div className={style["page"]}>
            <div className={style["page-image"]}>
              <img
                src={`${CDN_URL}/${data?.user_id}/BOOKS/IMAGES/medium/${data?.pages?.[0].files[0].name}`}
              ></img>
            </div>
            <div className={style["page-desc"]}>
              <Typography>
                {data?.pages?.[0].desc ? data?.pages?.[0]?.desc : ""}
              </Typography>
            </div>
          </div>
          {data?.pages?.length > 1 &&
            data?.pages?.slice(1)?.map((item) => {
              return (
                <div className={style["grid-item-detail"]}>
                  <Typography style={{ padding: "20px" }}>
                    {item?.desc}
                  </Typography>
                </div>
              );
            })}
        </div> */}
        {/* <div style={{height:"100%",width:"100%",display:"flex",justifyContent:"center",padding:"20px"}}>
          <div style={{height:"600px",width:"60%",boxShadow:" 2px 2px 5px rgba(0, 0, 0, 0.5)",color:"blue",borderRadius:"20px"}}></div>
        </div> */}
         <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          position: "relative",
        }}
      >
        {/* Left Swipe Button */}
        <button
          
          style={{
            position: "absolute",
            left: "10%",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "10px 20px",
            backgroundColor: "#ff6b6b",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {`<`}
        </button>

        {/* Main Box */}
        <div
          style={{
            height: "600px",
            width: "60%",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
            color: "blue",
            borderRadius: "20px",
          }}
        ></div>

        {/* Right Swipe Button */}
        <button
          
          style={{
            position: "absolute",
            right: "10%",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {`>`}
        </button>
      </div>
      </>
    );
  }
};
export default Detail;
