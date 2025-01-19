const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://rentplacespring-production.up.railway.app'  // 生產環境 URL
  : 'http://localhost:8080';             // 開發環境 URL

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 如果需要跨域請求，加入：
    'Access-Control-Allow-Origin': '*'
  }
};

// API 請求範例
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: apiConfig.headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};