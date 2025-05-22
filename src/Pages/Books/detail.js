import { useParams } from "react-router-dom";
import apiCall from "../API/api";
import { useEffect, useState ,useMemo} from "react";
import { Typography, Button, useMediaQuery } from "@mui/material";
import style from "../Books/style.module.css";

const Detail = () => {
  const { userId, bookId } = useParams();
  const { getBooksById, bookPublish, bookPublic } = apiCall();
  const [data, setData] = useState([]);
  const [refetch, setrefetch] = useState(false);
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  const isMobile = useMediaQuery("(max-width:600px)");
  const [currentIndex, setCurrentIndex] = useState(0);

  
  const displayItems = useMemo(() => {
    const items = [];

    // Book cover
    if (data.cover?.[0]) {
      items.push({ type: "cover", image: data.cover[0], title: data.title });
    }

    if (data.category === "story book") {
      // Add each chapter cover and pages
      data.chapters?.forEach((chapter, chapterIndex) => {
        if (chapter.cover?.[0]) {
          items.push({
            type: "chapterCover",
            image: chapter.cover[0],
            title: chapter.title,
            desc: chapter.desc,
          });
        }

        chapter.pages?.forEach((page, pageIndex) => {
          items.push({
            type: "page",
            desc: page.desc,
            chapterIndex,
            pageIndex,
          });
        });
      });
    } else {
      // If not story book, add each page
      data.pages?.forEach((page, index) => {
        items.push({ type: "page", desc: page.desc, pageIndex: index });
      });
    }

    return items;
  }, [data]);

  const handleNext = () => {
    if (currentIndex < displayItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const item = displayItems[currentIndex];

  const renderContent = () => {
    switch (item && item?.type) {
      case "cover":
      case "chapterCover":
        return (
          <div
            className={style["book-image"]}
            style={{ width: "100%", borderRadius: 0 }}
          >
            <img
              style={{
                objectFit: "fill",
                height: "600px",
                width: "100%",
                borderRadius: 0,
              }}
              src={`${CDN_URL}/${data.user_id}/BOOKS/IMAGES/medium/${item.image.name}`}
              alt="Cover"
            />
            <div
              className={style["title-card"]}
              style={{ width: "30%", height: "30%" }}
            >
              <Typography
                className={style[isMobile ? "book-title-mob" : "book-title"]}
              >
                {item.title}
              </Typography>
            </div>
          </div>
        );

      case "page":
        return (
          <Typography style={{ color: "black", fontSize: "1.2rem" }}>
            {item.desc}
          </Typography>
        );

      default:
        return null;
    }
  };


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
          {!isMobile && (
            <>
              <div
                className={style[isMobile ? "user-Detail-mob" : "user-Detail"]}
              >
                <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                  Title
                </Typography>
                <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                  {data?.title}
                </Typography>
              </div>
              <div className={style["user-Detail"]}>
                <Typography
                  style={{ fontSize: isMobile ? "10px" : "1rem" }}
                  variant="h5"
                >
                  Author
                </Typography>
                <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                  {data?.user_id}
                </Typography>
              </div>
              <div className={style["user-Detail"]}>
                <Typography
                  style={{ fontSize: isMobile ? "10px" : "1rem" }}
                  variant="h5"
                >
                  Date of Publications
                </Typography>
                <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                  {data?.created_at?.split("T")[0]}
                </Typography>
              </div>
              <div className={style["user-Detail"]}>
                <Typography
                  style={{ fontSize: isMobile ? "10px" : "1rem" }}
                  variant="h5"
                >
                  Genre
                </Typography>
                <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                  {data?.category}
                </Typography>
              </div>
              <div className={style["user-Detail"]}>
                <Typography
                  style={{ fontSize: isMobile ? "10px" : "1rem" }}
                  variant="h5"
                >
                  Pages
                </Typography>
                <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                  {data?.pages?.length}
                </Typography>
              </div>
              <div className={style["user-Detail"]}>
                <Typography
                  style={{ fontSize: isMobile ? "10px" : "1rem" }}
                  variant="h5"
                >
                  Status
                </Typography>
                <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                  {data?.status}
                </Typography>
              </div>
              {data.status === "approved" && data?.is_public && (
                <div className={style["user-Detail"]}>
                  <Typography
                    style={{ fontSize: isMobile ? "10px" : "1rem" }}
                    variant="h5"
                  >
                    Public Visibility
                  </Typography>
                  <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                    {data?.is_public === 1 ? "True" : "False"}
                  </Typography>
                </div>
              )}
              {data.status === "in_review" && (
                <div
                  className={style[isMobile ? "button-mob" : "button"]}
                  style={{}}
                >
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
              {data.status === "approved" && data.is_public !== 1 && (
                <div className={style["button"]}>
                  <Button
                    variant="contained"
                    onClick={() => publicBook("public")}
                  >
                    Show To Public
                  </Button>
                </div>
              )}
            </>
          )}
          {isMobile && (
            <>
              {" "}
              <div>
                <div
                  className={
                    style[isMobile ? "user-Detail-mob" : "user-Detail"]
                  }
                >
                  <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                    Title
                  </Typography>
                  <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                    {data?.title}
                  </Typography>
                </div>
                <div className={style["user-Detail"]}>
                  <Typography
                    style={{ fontSize: isMobile ? "10px" : "1rem" }}
                    variant="h5"
                  >
                    Author
                  </Typography>
                  <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                    {data?.user_id}
                  </Typography>
                </div>
                <div className={style["user-Detail"]}>
                  <Typography
                    style={{ fontSize: isMobile ? "10px" : "1rem" }}
                    variant="h5"
                  >
                    Date of Publications
                  </Typography>
                  <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                    {data?.created_at?.split("T")[0]}
                  </Typography>
                </div>
              </div>
              <div>
                <div className={style["user-Detail"]}>
                  <Typography
                    style={{ fontSize: isMobile ? "10px" : "1rem" }}
                    variant="h5"
                  >
                    Genre
                  </Typography>
                  <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                    {data?.category}
                  </Typography>
                </div>
                <div className={style["user-Detail"]}>
                  <Typography
                    style={{ fontSize: isMobile ? "10px" : "1rem" }}
                    variant="h5"
                  >
                    Pages
                  </Typography>
                  <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                    {data?.pages?.length}
                  </Typography>
                </div>
                <div className={style["user-Detail"]}>
                  <Typography
                    style={{ fontSize: isMobile ? "10px" : "1rem" }}
                    variant="h5"
                  >
                    Status
                  </Typography>
                  <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                    {data?.status}
                  </Typography>
                </div>
              </div>
              {data.status === "approved" && data?.is_public && (
                <div className={style["user-Detail"]}>
                  <Typography
                    style={{ fontSize: isMobile ? "10px" : "1rem" }}
                    variant="h5"
                  >
                    Public Visibility
                  </Typography>
                  <Typography style={{ fontSize: isMobile ? "10px" : "1rem" }}>
                    {data?.is_public === 1 ? "True" : "False"}
                  </Typography>
                </div>
              )}
              {data.status === "in_review" && (
                <div
                  className={style[isMobile ? "button-mob" : "button"]}
                  style={{}}
                >
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
              {data.status === "approved" && data.is_public !== 1 && (
                <div className={style["button"]}>
                  <Button
                    variant="contained"
                    onClick={() => publicBook("public")}
                  >
                    Show To Public
                  </Button>
                </div>
              )}
            </>
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
          {/* Left Button */}
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
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            {"<"}
          </button>

          {/* Main Content */}
          <div
            style={{
              height: "600px",
              width: "60%",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              borderRadius: "20px",
              padding: "16px",
              overflowY: "auto",
              backgroundColor: "white",
            }}
          >
            {renderContent()}
          </div>

          {/* Right Button */}
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
            onClick={handleNext}
            disabled={currentIndex === displayItems.length - 1}
          >
            {">"}
          </button>
        </div>
      </>
    );
  }
};
export default Detail;
