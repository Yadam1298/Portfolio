const originalFetch = window.fetch;

window.fetch = async function (url, options) {
  const key = url + (options ? JSON.stringify(options) : '');
  const cached = sessionStorage.getItem(key);
  if (cached) {
    return new Response(new Blob([cached]), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const response = await originalFetch(url, options);
    if (response.ok) {
      const data = await response.clone().text();
      sessionStorage.setItem(key, data);
    }
    return response;
  } catch (error) {
    console.error('Global fetch cache error:', error);
    throw error;
  }
};
