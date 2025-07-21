export async function fetchWithSessionCache(key, url) {
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached);
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    sessionStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('fetchWithSessionCache error:', error);
    throw error;
  }
} 