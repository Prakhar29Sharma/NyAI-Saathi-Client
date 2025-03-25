const BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const API_ENDPOINTS = {
  CHAT: `${BASE_URL}/chat`,
  DOCUMENTS: `${BASE_URL}/documents`,
  SEARCH: `${BASE_URL}/search`,
};