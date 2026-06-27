import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

const client = axios.create({ baseURL: BASE_URL });

let _accessToken = null;
let _refreshToken = null;
let _onLogout = null;

export function setClientTokens(access, refresh) {
  _accessToken = access;
  _refreshToken = refresh;
}

export function setLogoutCallback(fn) { _onLogout = fn; }

// Inject auth header
client.interceptors.request.use((config) => {
  if (_accessToken) config.headers.Authorization = `Bearer ${_accessToken}`;
  return config;
});

// Handle 401 — refresh token then retry
let refreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return client(original);
        });
      }
      original._retry = true;
      refreshing = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken: _refreshToken });
        _accessToken = data.accessToken;
        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return client(original);
      } catch (err) {
        processQueue(err, null);
        if (_onLogout) _onLogout();
        return Promise.reject(err);
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default client;
