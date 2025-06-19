import { Typography, useMediaQuery, IconButton } from "@mui/material";
import style from "../Books/style.module.css";
import { useEffect, useState } from "react";
import ApiCall from "../API/api";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Loader from "../Loader/loader";
import v_dots from "../../asserts/v_dots.png";

const Books = () => {
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

 return (
    <>
      {isLoading && <Loader />}
      <Typography
        variant="h6"
        style={{
          paddingLeft: '30px',
          fontFamily: 'Baloo2',
          fontWeight: '800',
          paddingTop: '103px',
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
      {data ? <div className={style[isMobile ? 'grid-container-mob' : "grid-container"]}>
        {data.map((item) => {
          return (
            <div class={style[isMobile ? 'grid-item-mob' : "grid-item"]}>
              <div className={style["book-image"]}
                onClick={() => handleClick(item, item.user_id, item.book_id)}>
                <img src={`${CDN_URL}/${item.user_id}/BOOKS/IMAGES/medium/${item.cover[0].name}`} />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    backdropFilter: 'blur(25.24px)',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    boxShadow: '0px 0px 8.41px 0px rgba(0, 0, 0, 0.2)',
                    width: isMobile ? 20 : 25,
                    height: isMobile ? 20 : 25,
                    zIndex: 2,
                    color: '#FFFFFF 40%'
                  }}>
                  <img
                    src={v_dots}
                    alt="Dots"
                    style={{
                      width: '3px',
                      height: '12.5px',
                      objectFit: 'contain',
                      alignItems: 'center',
                      color: '#FFFFFF'
                    }}
                  />
                </IconButton>
                <div className={style["title-card"]}>
                  <Typography className={style[isMobile ? 'book-title-mob' : "book-title"]} >{item.title} </Typography>
                </div>
              </div>
              <div className={style["book-details"]}>
                <div className={style["author"]}>
                  <div className={style["title"]}>
                    <Typography style={{ fontSize: isMobile && '11px' }}>Author</Typography>
                  </div>
                  <div className={style["value"]}>
                    <Typography style={{ fontSize: isMobile ? '10px' : "13px" }}>{item.user_id}</Typography>
                  </div>
                </div>
                <div className={style["author"]}>
                  <div className={style["title"]}>
                    <Typography style={{
                      fontSize: isMobile && '11px',
                      whiteSpace: 'nowrap',
                    }}>Date of Publication</Typography>
                  </div>
                  <div className={style["value"]}>
                    <Typography style={{ fontSize: isMobile ? '10px' : "13px" }}>{item.created_at?.split("T")[0]}</Typography>
                  </div>
                </div>
                <div className={style["author"]}>
                  <div className={style["title"]}>
                    <Typography style={{ fontSize: isMobile && '11px' }}>Genre</Typography>
                  </div>
                  <div className={style["value"]}>
                    <Typography style={{ fontSize: isMobile ? '10px' : "13px" }}>{item.category}</Typography>
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
                    <Typography style={{ fontSize: isMobile && '11px' }}>Status</Typography>
                  </div>
                  <div className={style["value"]}>
                    <Typography style={{ fontSize: isMobile ? '10px' : "13px" }}>{item.status}</Typography>
                  </div>
                </div>
              </div>
            </div>)
        })}
      </div > : <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress />
      </Box>
      }</>
  );
};

export default Books;