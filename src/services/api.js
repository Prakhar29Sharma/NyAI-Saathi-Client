import axios from "axios";

const API_BASE_URL = "/api/v1";

export const queryApi = async (message, queryType, previousMessages = []) => {
  try {
    const endpoint = queryType === 'laws' ? '/query/laws' : '/query/judgements';
    
    const data = JSON.stringify({
      query: message,
      context: previousMessages.map(msg => ({
        content: msg.text,
        role: msg.isUser ? 'user' : 'assistant'
      }))
    });

    const response = await axios.post(
      `${API_BASE_URL}${endpoint}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log(`Querying ${queryType} endpoint:`, endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error querying ${queryType} API:`, error);
    throw new Error(`Failed to fetch ${queryType} data from the API.`);
  }
};