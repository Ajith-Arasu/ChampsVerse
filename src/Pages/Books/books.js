import { Typography,useMediaQuery } from "@mui/material";
import style from "../Books/style.module.css";
import { useEffect, useState } from "react";
import apiCall from "../API/api";
import {useNavigate} from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Loader from  "../Loader/loader";

const Books = () => {
  const navigate = useNavigate();
  const { getBooksList,getBooksById } = apiCall();
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageKey, setPageKey] = useState("");
  const [data, setData] = useState([]);
  const CDN_URL=process.env.REACT_APP_CDN_URL;
   const isMobile = useMediaQuery('(max-width:600px)');
  
  const getBooks =async()=>{
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try
    {
      if (pageKey !== null) {

      let books=await getBooksList(pageKey);
      if (books?.page) {
        setPageKey(books?.page);
      } else {
        setPageKey(null);
      }
    const body = transformedData(books.data);
    const booksDetail= await getBooksById(body);
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

  const handleClick = async (data,userId,bookId) => {
    navigate(`/booksdetail/${userId}/${bookId}`,{state:{data,userId:userId,bookId:bookId}})

  }

  return (
    <>
    {isLoading && <Loader/>}
    {data?<div className={style[isMobile ? 'grid-container-mob':"grid-container"]}>
    {data.map((item) => {
      
     return( <div class={style[isMobile? 'grid-item-mob':"grid-item"]}>
      <div className={style["book-image"]}
      onClick={()=>handleClick(item,item.user_id,item.book_id)}>
        <img src={`${CDN_URL}/${item.user_id}/BOOKS/IMAGES/medium/${item.cover[0].name}`}></img>
        <div className={style["title-card"]}>
          <Typography className={style[isMobile?'book-title-mob':"book-title"]} >{item.title} </Typography>
        </div>
      </div>
      <div className={style["book-details"]}>
      <div className={style["author"]}>
        <div className={style["title"]}>
          <Typography style={{fontSize: isMobile&&'15px'}}>Author</Typography>
        </div>
        <div className={style["value"]}>
          <Typography style={{fontSize:isMobile?'10px':"13px"}}>{item.user_id}</Typography>
        </div>
      </div>
      <div className={style["author"]}>
        <div className={style["title"]}>
          <Typography style={{fontSize: isMobile&&'8px'}}>Date of Publication</Typography>
        </div>
        <div className={style["value"]}>
          <Typography style={{fontSize:isMobile?'10px':"13px"}}>{item.created_at?.split("T")[0]}</Typography>
        </div>
      </div>
      <div className={style["author"]}>
        <div className={style["title"]}>
          <Typography style={{fontSize: isMobile&&'15px'}}>Genre</Typography>
        </div>
        <div className={style["value"]}>
          <Typography style={{fontSize:isMobile?'10px':"13px"}}>{item.category}</Typography>
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
          <Typography style={{fontSize: isMobile&&'15px'}}>Status</Typography>
        </div>
        <div className={style["value"]}>
          <Typography style={{fontSize:isMobile?'10px':"13px"}}>{item.status}</Typography>
        </div>
      </div>
      </div>
      
    </div>)
    })}
    </div>: <Box
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