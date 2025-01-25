import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"; // Base URL for the API

export const queryApi = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, { query: message });
    return response.data; // Ensure you're accessing `data` correctly
  } catch (error) {
    console.error("Error querying API:", error);
    throw new Error("Failed to fetch data from the API.");
  }
};
