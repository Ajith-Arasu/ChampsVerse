const fetchWithInterceptor = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error("HTTP error:", response.status);

      if (response.status === 401) {
        console.warn("Unauthorized - logging out");

        // Clear auth data
        localStorage.removeItem("accessToken");
        sessionStorage.clear();
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect to login page
        window.location.href = "/";
        return;
      }
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default fetchWithInterceptor;
