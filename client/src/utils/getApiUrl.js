// src/utils/getApiUrl.js

function getApiUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL;
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL)
    return process.env.VITE_API_URL;
  return 'http://localhost:5000';
}

export { getApiUrl };
