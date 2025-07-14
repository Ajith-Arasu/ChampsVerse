import { Typography, useMediaQuery } from "@mui/material";
import style from "../Books/style.module.css";
import { useEffect, useState } from "react";
import ApiCall from "../API/api";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Loader from "../Loader/loader";

const Books = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const navigate = useNavigate();
  const { getBooksList, getBooksById } = ApiCall();
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageKey, setPageKey] = useState("");
  const [data, setData] = useState([]);
  const CDN_URL = process.env.REACT_APP_CDN_URL;
  const isMobile = useMediaQuery('(max-width:600px)');

  const getBooks = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {

        let books = await getBooksList(pageKey);
        if (books?.page) {
          setPageKey(books?.page);
        } else {
          setPageKey(null);
        }
        const body = transformedData(books.data);
        const booksDetail = await getBooksById(body);
        setData((prev) => [...prev, ...booksDetail.data]);
      }
    }
    catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getBooks();
  }, [nextPage]);

  const transformedData = (data) => {
    const transformed = {
      targetIds: data.map((item) => {
        return {
          user_id: item.user_id,
          book_id: item.book_id,
        };
      }),
    };
    return transformed;
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

  const handleClick = async (data, userId, bookId) => {
    navigate(`/booksdetail/${userId}/${bookId}`, { state: { data, userId: userId, bookId: bookId } })

  }
const handleSelect = (id) => {
  setSelectedItems((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
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
      {isLoading && <Loader />}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '103px', }}>
        <div>
          <Typography
            variant="h6"
            style={{
              paddingLeft: '30px',
              fontFamily: 'Baloo2',
              fontWeight: '800',

              color: '#FFFFFF',
              fontSize: isMobile ? '18px' : '32px',

            }}
          >
            BOOKS{" "}
            <Typography
              component="span"
              style={{
                fontSize: isMobile ? '16px' : '24px',
                fontWeight: '500',
                color: '#FFFFFF',
              }}
            >
              ({data.length})
            </Typography>
          </Typography>
        </div>
        <div

          onClick={handleSelectAllToggle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingRight: '50px',
            cursor: "pointer",

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
      </div>

      {data ? <div className={style[isMobile ? 'grid-container-mob' : "grid-container"]}>
        {data.map((item) => {
          return (
            <div class={style[isMobile ? 'grid-item-mob' : "grid-item"]}>
              <div className={style["book-image"]}
                onClick={() => handleClick(item, item.user_id, item.book_id)}>
                <img src={`${CDN_URL}/${item.user_id}/BOOKS/IMAGES/medium/${item.cover[0].name}`}></img>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                     handleSelect(item.id); 
                  }}
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
                <div className={style[isMobile ? 'title-card-mob' : "title-card"]}>
                  <Typography className={style[isMobile ? 'book-title-mob' : "book-title"]} >{item.title} </Typography>
                </div>
              </div>
              <div className={style["book-details"]}>
                <div className={style["author"]}>
                  <div className={style["title"]}>
                    <Typography style={{ fontSize: isMobile ? '6.5px' : '15px' }}>Author</Typography>
                  </div>
                  <div className={style["value"]}>
                    <Typography style={{ fontSize: isMobile ? '7.5px' : "13px" }}>{item.author}</Typography>
                  </div>
                </div>
                <div className={style["author"]}>
                  <div className={style["title"]}>
                    <Typography style={{
                      fontSize: isMobile ? '6.5px' : '13px',
                      whiteSpace: 'nowrap',
                    }}>Date of Publication</Typography>
                  </div>
                  <div className={style["value"]}>
                    <Typography style={{ fontSize: isMobile ? '7.5px' : "12px" }}>{item.created_at?.split("T")[0]}</Typography>
                  </div>
                </div>
                <div className={style["author"]}>
                  <div className={style["title"]}>
                    <Typography style={{ fontSize: isMobile ? '6.5px' : '15px' }}>Genre</Typography>
                  </div>
                  <div className={style["value"]}>
                    <Typography style={{ fontSize: isMobile ? '7.5px' : "13px" }}>{item.category}</Typography>
                  </div>
                </div>
                {/* <div className={style["author"]}>
        <div className={style["title"]}>
          <Typography>Pages</Typography>
        </div>
        <div className={style["value"]}>
          <Typography>{item.pages.length}</Typography>
        </div>
      </div> */}

                <div className={style["author"]}>
                  <div className={style["title"]}>
                    <Typography style={{ fontSize: isMobile ? '6.5px' : '15px' }}>Status</Typography>
                  </div>
                  <div className={style["value"]}>
                    <Typography style={{ fontSize: isMobile ? '7.5px' : "13px" }}>{item.status}</Typography>
                  </div>
                </div>
              </div>

            </div>)
        })}
      </div> : <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress />
      </Box>}</>

  );
};

export default Books;
