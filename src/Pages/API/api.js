const apiCall = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL
  const currentDate = new Date();

const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed (0-11), so add 1 to get 1-12
const currentYear = currentDate.getFullYear()

  const data = async (pageKey, count) => {
    const response = await fetch(
      ` ${BASE_URL}/api/v1/posts/list?feed_id=${currentMonth}_${currentYear}&count=${count}&page=${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const getPost = async (postIds) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/posts?targetIds=${postIds}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };
  const addBadges = async (userId, postId, valuable, portrait) => {
    let requestBody;

    if (valuable === "mp" || valuable === "wnd" || valuable === "hof") {
      requestBody = {
        special_badge: valuable,
        isPortrait: true,
      };
    } else {
      requestBody = {
        valuable: valuable,
        isPortrait: portrait,
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/user/${userId}/post/${postId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    const result = await response.json();
    return result;
  };

  const getBadges = async (requestBody) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/user/post/counts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    const result = await response.json();

    return result;
  };

  const getPostByUserId = async (userId) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/user/actions/post?userId=${userId}&page=&count=20`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    return result.data;
  };

  const getUserDetails = async (userIds) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/users/getbyIds?ids=${userIds}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    return result.data;
  };

  const getBooksList = async (pageKey) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/books/list?feed_id=${currentMonth}_${currentYear}&count=10&page=${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const getBooksById = async (requestBody) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/books`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    const result = await response.json();

    return result;
  };

  const status = {
    status: "approved",
  };
  const bookPublish = async (userId, bookId, status) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/book/${bookId}/user/${userId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
      }
    );
    const result = await response.json();
    return result;
  };

  const getStorageConsumption =async(pageKey)=>{
    const response = await fetch(
      `${BASE_URL}/api/v1/users/storage/utilizations?count=10&page=${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  }


  const getContestList = async(tab,pageKey,type)=>{
    
    const response = await fetch(
      `${BASE_URL}/api/v1/contests?state=${tab}&count=10&page=${pageKey}&contest_type=${type}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  }

  const getContestEntries = async(contestId,pageKey)=>{
    const response = await fetch(
      `${BASE_URL}/api/v1/contest/${contestId}/entries?count=&page=${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  }


  const addWinnersCategory=async (contestId,body)=>{
    const response = await fetch(
      `${BASE_URL}/api/v1/contest/${contestId}/winners/assign`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...body }),
      }
    );
    const result = await response.json();
    return result;
  }


  const announceContestResult = async (contestId) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/contest/${contestId}/result/announce`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };
  

  const bookPublic = async(bookId,userId,body)=>{
    const response = await fetch(
      `${BASE_URL}/api/v1/book/${bookId}/user/${userId}/public`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({ ...body })
      }
    );
    const result = await response.json();
    return result;
  }


  const createContest = async (requestBody) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/contest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    const result = await response.json();

    return result;
  };


  const getUrlContestImage =async(extension,name,contestId,uploadType,contestType)=>{
    const response = await fetch(
      `${BASE_URL}/api/v1/s3/upload-url?upload_type=${uploadType}&type=IMAGES&extension=${extension}&name=_${name}&contest_id=${contestId}&contest_type=${contestType}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  }

  const uploadIMG = async(url,file)=>{
    const response = await fetch(
      `${url}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body:file
      }
    );
    const result = await response.json();
    return result;
  }

  const updateContestStatus = async(contestId,type)=>{
    const response = await fetch(`${BASE_URL}/api/v1/contest/${contestId}?contest_type=${type}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: "ongoing",
        })
      }
    )
    const result = await response.json();
    return result;
  }

  return {
    data,
    getPost,
    addBadges,
    getBadges,
    getPostByUserId,
    getUserDetails,
    getBooksList,
    getBooksById,
    bookPublish,
    getStorageConsumption,
    getContestList,
    getContestEntries,
    addWinnersCategory,
    announceContestResult,
    bookPublic,
    createContest,
    getUrlContestImage,uploadIMG,
    updateContestStatus
  };
};

export default apiCall;
