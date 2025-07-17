// src/tests/unit/api.test.js

// Mock axios with interceptors and instance API
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };
  const mockAxios = {
    create: () => mockAxiosInstance,
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return {
    __esModule: true,
    ...mockAxios,
    default: mockAxios,
    mockAxiosInstance,
  };
});

jest.mock('../../utils/getApiUrl', () => ({
  getApiUrl: () => 'http://localhost:5000'
}));

import api, {
  registerUser,
  loginUser,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  ping,
  health,
} from '../../utils/api';
import axios from 'axios';

describe('API Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch && (global.fetch = undefined);
  });

  describe('User APIs', () => {
    it('registerUser should POST to /api/users/register', async () => {
      axios.create().post.mockResolvedValue({ data: { user: 'foo' } });
      const result = await registerUser({ name: 'foo' });
      expect(result).toEqual({ user: 'foo' });
      expect(axios.create().post).toHaveBeenCalledWith('/api/auth/register', { name: 'foo' });
    });

    it('loginUser should POST to /api/users/login', async () => {
      axios.create().post.mockResolvedValue({ data: { token: 'bar' } });
      const result = await loginUser({ email: 'a', password: 'b' });
      expect(result).toEqual({ token: 'bar' });
      expect(axios.create().post).toHaveBeenCalledWith('/api/auth/login', { email: 'a', password: 'b' });
    });
  });

  describe('Post APIs', () => {
    it('getPosts should GET /api/posts', async () => {
      axios.create().get.mockResolvedValue({ data: [1, 2, 3] });
      const result = await getPosts();
      expect(result).toEqual([1, 2, 3]);
      expect(axios.create().get).toHaveBeenCalledWith('/api/posts');
    });

    it('getPost should GET post by id', async () => {
      axios.create().get.mockResolvedValue({ data: { post: 'foo' } });
      const result = await getPost('123');
      expect(result).toEqual({ post: 'foo' });
      expect(axios.create().get).toHaveBeenCalledWith('/api/posts/123');
    });

    it('createPost should POST with axios', async () => {
      axios.create().post.mockResolvedValue({ data: { done: true } });
      const data = { title: 'hi' };
      const token = 'tok';
      const result = await createPost(data, token);
      expect(result).toEqual({ done: true });
      expect(axios.create().post).toHaveBeenCalledWith(
        '/api/posts',
        data,
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: `Bearer ${token}` }) })
      );
    });

    it('updatePost should PUT with axios', async () => {
      axios.create().put.mockResolvedValue({ data: { updated: true } });
      const data = { title: 'hi' };
      const token = 'tok';
      const result = await updatePost('123', data, token);
      expect(result).toEqual({ updated: true });
      expect(axios.create().put).toHaveBeenCalledWith(
        '/api/posts/123',
        data,
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: `Bearer ${token}` }) })
      );
    });

    it('deletePost should DELETE with fetch', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ deleted: true }) }));
      const token = 'tok';
      const result = await deletePost('123', token);
      expect(result).toEqual({ deleted: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/posts/123'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({ Authorization: `Bearer ${token}` })
        })
      );
    });
  });

  describe('Health APIs', () => {
    it('ping should fetch /api/ping', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'ok' }) }));
      const result = await ping();
      expect(result).toEqual({ status: 'ok' });
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/ping'), {});
    });

    it('health should GET /api/health with axios', async () => {
      axios.create().get.mockResolvedValue({ data: { healthy: true } });
      const result = await health();
      expect(result).toEqual({ healthy: true });
      expect(axios.create().get).toHaveBeenCalledWith('/api/health');
    });
  });
});