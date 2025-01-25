import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const queryApi = async (message) => {
  try {
    const data = JSON.stringify({query: message});
    const response = await axios.post(
      `${API_BASE_URL}/query/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("api response", response);
    return response.data;
  } catch (error) {
    console.error("Error querying API:", error);
    throw new Error("Failed to fetch data from the API.");
  }
};
