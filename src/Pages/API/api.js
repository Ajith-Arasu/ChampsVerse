const apiCall = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const currentDate = new Date();

  const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed (0-11), so add 1 to get 1-12
  const currentYear = currentDate.getFullYear();

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
    const response = await fetch(`${BASE_URL}/api/v1/user/post/counters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
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
    const response = await fetch(`${BASE_URL}/api/v1/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
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

  const getStorageConsumption = async (pageKey) => {
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
  };

  const getContestList = async (tab, pageKey, type) => {
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
  };

  const getContestEntries = async (contestId, pageKey, type) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/contest/${contestId}/entries?count=&page=${pageKey}&contest_type=${type}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const addWinnersCategory = async (contestId, body, type) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/contest/${contestId}/winners/assign?contest_type=${type}`,
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
  };

  const announceContestResult = async (contestId, type) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/contest/${contestId}/result/announce?contest_type=${type}`,
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

  const bookPublic = async (bookId, userId, body) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/book/${bookId}/user/${userId}/public`,
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
  };

  const createContest = async (requestBody) => {
    const response = await fetch(`${BASE_URL}/api/v1/contest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();

    return result;
  };

  const getUrlContestImage = async (
    extension,
    name,
    contestId,
    uploadType,
    contestType
  ) => {
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
  };

  const uploadIMG = async (url, file) => {
    const response = await fetch(`${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: file,
    });
    const result = await response.json();
    return result;
  };

  const updateContestStatus = async (contestId, type) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/contest/${contestId}?contest_type=${type}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: "ongoing",
        }),
      }
    );
    const result = await response.json();
    return result;
  };

  const getDeletedPost = async (pageKey) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/posts/deleted?count=20&page=${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const deleteS3Post = async (ids, workType) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/posts/delete?ids=${ids}&delete_files=true`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }
    );
    const result = await response.json();
    return result;
  };

  const deletedUserS3Post = async (userId, type, ids, body) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/user/${userId}/delete?type=${type}&delete_files=true&ids=${ids}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({ body }),
      }
    );
    const result = await response.json();
    return result;
  };

  const deletedUserPostJson = async (userId, type, ids, body) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/user/${userId}/delete?type=${type}&ids=${ids}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({ body }),
      }
    );
    const result = await response.json();
    return result;
  };

  const deletePostJson = async (ids) => {
    const response = await fetch(`${BASE_URL}/api/v1/posts/delete?ids=${ids}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  };

  const getDeletedUser = async (pageKey) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/users/deleted?count=20&page=${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const getDeletedUserPost = async (pageKey, userId, workType) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/user/${userId}/works/${workType}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const getQuestList = async (pageKey) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/contests?contest_type=MICRO_CONTEST`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const sendRating = async (requestBody) => {
    const response = await fetch(`${BASE_URL}/api/v1/trigger/bots/process`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    return result;
  };

  const triggerActivityApi = async (requestBody) => {
    const response = await fetch(`${BASE_URL}/api/v1/trigger/user/activity`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    return result;
  };

  const getCommentsList = async (type, pageKey) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/reaction/comments?type=post&count=20&is_approved=${type}&page=${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const approveComments = async (ids, state, type) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/reaction/comments/approve?ids=${ids}&approve=${state}&type=${type}`,
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

  const achievementsList = async (pagekey) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/posts/list?feed_id=10_2024&count=12&page=${pagekey}&type=achievement`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const approveAchievement = async (requestBody) => {
    const response = await fetch(`${BASE_URL}/api/v1/achievement/approve`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    return result;
  };

  const getLatestActivity = async (pageKey, month) => {
    const response = await fetch(
      `${BASE_URL}api/v1/user/activities?count=&page=${pageKey}&month=${month}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  const syncQuests = async () => {
    const requestBody = {
      cdns: ["homeMicroContests"],
    };
    const response = await fetch(`${BASE_URL}/api/v1/sync/cdns`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    return result;
  };

  const getSponsorList = async (pageKey) => {
    const response = await fetch(
      `${BASE_URL}api/v1/sponsors?count=&page=count=&page=${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
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
        },
        method: "PATCH",
        body: JSON.stringify(requestBody),
      }
    );
    const result = await response.json();
    return result;
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
  };
};

export default apiCall;
