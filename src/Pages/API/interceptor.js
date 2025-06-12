// fetchWithInterceptor.js
const fetchWithInterceptor = async (url, options = {}) => {
  // Example: You can log the request or modify headers here
  console.log("Request URL:", url);
  console.log("Request Options:", options);

  try {
    const response = await fetch(url, options);

    // Global error handling or response logging
    if (!response.ok) {
      console.error("HTTP error:", response.status);
      if (response.status === 401) {
        // Example: token expired, redirect to login
        console.warn("Unauthorized - maybe redirect to login");
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
