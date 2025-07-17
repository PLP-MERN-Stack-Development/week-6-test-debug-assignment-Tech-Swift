// src/utils/api.js

import axios from 'axios';

// API base URL is handled by getApiUrl()

import { getApiUrl } from './getApiUrl';

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Helper: raw fetch fallback
export async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || 'API request failed');
  }
  return response.json();
}

// ============ Auth APIs ============
export async function registerUser(userData) {
  const res = await api.post('/api/auth/register', userData);
  return res.data;
}

export async function loginUser(credentials) {
  const res = await api.post('/api/auth/login', credentials);
  return res.data;
}

// ============ Post APIs ============
export async function getPosts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return api.get(`/api/posts${query ? '?' + query : ''}`).then(res => res.data);
}

export async function getPost(id) {
  const res = await api.get(`/api/posts/${id}`);
  return res.data;
}

export async function getPostById(id) {
  const res = await api.get(`/api/posts/${id}`);
  return res.data;
}

export async function createPost(data, token) {
  const res = await api.post('/api/posts', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function updatePost(id, data, token) {
  const res = await api.put(`/api/posts/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function deletePost(id, token) {
  return fetchJSON(`${getApiUrl()}/api/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ============ Health APIs ============
export async function ping() {
  return fetchJSON(`${getApiUrl()}/api/ping`);
}

export async function health() {
  const res = await api.get('/api/health');
  return res.data;
}

export default api;
