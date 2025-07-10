import { useState } from "react";
import fetchWithInterceptor from './interceptor'
import { setCookie,getCookie } from "../../helper/cookies";

const ApiCall = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const currentDate = new Date();

  const currentMonth = currentDate.getMonth() + 1; 
  const currentYear = currentDate.getFullYear();

  const token =getCookie("accessToken")

  
  
   const data = async (pageKey, count) => {
    console.log("token44555", token)
    const url = `${BASE_URL}/api/v1/posts/list?feed_id=${currentMonth}_${currentYear}&count=${count}&page=${pageKey}`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return fetchWithInterceptor(url, options);
  };

  const getPost = async (postIds) => {
    const url = `${BASE_URL}/api/v1/posts?targetIds=${postIds}`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return fetchWithInterceptor(url, options);
  };

 const addBadges = async (
    userId,
    postId,
    valuable,
    portrait,
    isQuestPage,
    questId
  ) => {
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

    if (isQuestPage) {
      requestBody = {
        ...requestBody,
        contest_id: questId,
        contest_type: "MICRO_CONTEST",
      };
    }

    const url = `${BASE_URL}/api/v1/user/${userId}/post/${postId}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    };

    return fetchWithInterceptor(url, options);
  };

  const getBadges = async (requestBody) => {
    const url = `${BASE_URL}/api/v1/user/post/counters`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    };

    return fetchWithInterceptor(url, options);
  };

  const getPostByUserId = async (userId) => {
    const url = `${BASE_URL}/api/v1/user/actions/post?userId=${userId}&page=&count=20`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const result = await fetchWithInterceptor(url, options);
    return result.data;
  };

  const getUserDetails = async (userIds) => {
    const url = `${BASE_URL}/api/v1/users/getbyIds?ids=${userIds}`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const result = await fetchWithInterceptor(url, options);
    return result.data;
  };

 const getBooksList = async (pageKey) => {
  const url = `${BASE_URL}/api/v1/books/list?feed_id=${currentMonth}_${currentYear}&count=10&page=${pageKey}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const getBooksById = async (requestBody) => {
  const url = `${BASE_URL}/api/v1/books`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };
  return fetchWithInterceptor(url, options);
};

const bookPublish = async (userId, bookId, status) => {
  const url = `${BASE_URL}/api/v1/book/${bookId}/user/${userId}/status`;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  };
  return fetchWithInterceptor(url, options);
};

const getStorageConsumption = async (pageKey) => {
  const url = `${BASE_URL}/api/v1/users/storage/utilizations?count=10&page=${pageKey}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const getContestList = async (tab, pageKey, type) => {
  const url = `${BASE_URL}/api/v1/contests?state=${tab}&count=10&page=${pageKey}&contest_type=${type}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};


  const getContestEntries = async (contestId, pageKey, type) => {
  const url = `${BASE_URL}/api/v1/contest/${contestId}/entries?count=&page=${pageKey}&contest_type=${type}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const addWinnersCategory = async (contestId, body, type) => {
  const url = `${BASE_URL}/api/v1/contest/${contestId}/winners/assign?contest_type=${type}`;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };
  return fetchWithInterceptor(url, options);
};

const announceContestResult = async (contestId, type) => {
  const url = `${BASE_URL}/api/v1/contest/${contestId}/result/announce?contest_type=${type}`;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const bookPublic = async (bookId, userId, body) => {
  const url = `${BASE_URL}/api/v1/book/${bookId}/user/${userId}/public`;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };
  return fetchWithInterceptor(url, options);
};

const createContest = async (requestBody) => {
  const url = `${BASE_URL}/api/v1/contest`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };
  return fetchWithInterceptor(url, options);
};

const getUrlContestImage = async (
  extension,
  name,
  contestId,
  uploadType,
  contestType
) => {
  const url = `${BASE_URL}/api/v1/s3/upload-url?upload_type=${uploadType}&type=IMAGES&extension=${extension}&name=_${name}&contest_id=${contestId}&contest_type=${contestType}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};


 const uploadIMG = async (url, file) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: file,
  };
  return fetchWithInterceptor(url, options);
};

const updateContestStatus = async (contestId, type) => {
  const url = `${BASE_URL}/api/v1/contest/${contestId}?contest_type=${type}`;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ state: "ongoing" }),
  };
  return fetchWithInterceptor(url, options);
};

const getDeletedPost = async (pageKey) => {
  const url = `${BASE_URL}/api/v1/posts/deleted?count=20&page=${pageKey}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const deleteS3Post = async (ids, workType) => {
  const url = `${BASE_URL}/api/v1/posts/delete?ids=${ids}&delete_files=true`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const deletedUserS3Post = async (userId, type, ids, body) => {
  const url = `${BASE_URL}/api/v1/user/${userId}/delete?type=${type}&delete_files=true&ids=${ids}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body }),
  };
  return fetchWithInterceptor(url, options);
};

const deletedUserPostJson = async (userId, type, ids, body) => {
  const url = `${BASE_URL}/api/v1/user/${userId}/delete?type=${type}&ids=${ids}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body }),
  };
  return fetchWithInterceptor(url, options);
};

const deletePostJson = async (ids) => {
  const url = `${BASE_URL}/api/v1/posts/delete?ids=${ids}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const getDeletedUser = async (pageKey) => {
  const url = `${BASE_URL}/api/v1/users/deleted?count=20&page=${pageKey}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const getDeletedUserPost = async (pageKey, userId, workType) => {
  const url = `${BASE_URL}/api/v1/user/${userId}/works/${workType}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};


 const getQuestList = async (pageKey) => {
  const url = `${BASE_URL}/api/v1/contests?contest_type=MICRO_CONTEST`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const sendRating = async (requestBody) => {
  const url = `${BASE_URL}/api/v1/trigger/bots/process`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };
  return fetchWithInterceptor(url, options);
};

const triggerActivityApi = async (requestBody) => {
  const url = `${BASE_URL}/api/v1/trigger/user/activity`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };
  return fetchWithInterceptor(url, options);
};

const getCommentsList = async (type, pageKey) => {
  const url = `${BASE_URL}/api/v1/reaction/comments?type=post&count=20&is_approved=${type}&page=${pageKey}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const approveComments = async (ids, state, type) => {
  const url = `${BASE_URL}/api/v1/reaction/comments/approve?ids=${ids}&approve=${state}&type=${type}`;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const achievementsList = async (pagekey) => {
  const url = `${BASE_URL}/api/v1/posts/list?feed_id=10_2024&count=12&page=${pagekey}&type=achievement`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};

const approveAchievement = async (requestBody) => {
  const url = `${BASE_URL}/api/v1/achievement/approve`;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };
  return fetchWithInterceptor(url, options);
};

const getLatestActivity = async (pageKey, month) => {
  const url = `${BASE_URL}/api/v1/user/activities?count=&page=${pageKey}&month=${month}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchWithInterceptor(url, options);
};


  const syncQuests = async () => {
    const requestBody = {
      cdns: ["homeMicroContests"],
    };
    const response = await fetch(`${BASE_URL}/api/v1/sync/cdns`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    return result;
  };

  console.log("token",token)
  const getSponsorList = async (pageKey) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/sponsors?count=10&page=${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const updateQuest = async (questId, requestBody) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/contest/${questId}?contest_type=MICRO_CONTEST`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PATCH",
        body: JSON.stringify(requestBody),
      }
    );
    const result = await response.json();
    return result;
  };

  const ApproveQuestWork = async (contestId, type, body) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/contest/entry/approve?contest_id=${contestId}&contest_type=${type}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...body }),
      }
    );
    const result = await response.json();
    return result;
  };

  const login = async (requestBody) => {
    const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const res = await response.json();
    setCookie("accessToken",res.data.accesstoken,3600);
    console.log("res.data", res.data.accesstoken)
    return res;
  };

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
    getUrlContestImage,
    uploadIMG,
    updateContestStatus,
    getDeletedPost,
    deleteS3Post,
    deletePostJson,
    getDeletedUser,
    getDeletedUserPost,
    getQuestList,
    deletedUserS3Post,
    deletedUserPostJson,
    sendRating,
    triggerActivityApi,
    getCommentsList,
    approveComments,
    achievementsList,
    approveAchievement,
    getLatestActivity,
    syncQuests,
    getSponsorList,
    updateQuest,
    ApproveQuestWork,
    login,
  };
};

export default ApiCall;
