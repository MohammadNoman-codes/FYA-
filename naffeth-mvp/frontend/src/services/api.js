import axios from 'axios';

// Define the base URL for the backend server (where images are served)
export const BACKEND_URL = 'http://localhost:5000'; // Adjust port if different

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: '/api', // Uses the proxy defined in package.json during development for API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Intercept requests to add the authorization token.
  The token is retrieved from localStorage (or could be context/state management).
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('naffeth_token'); // Or get token from AuthContext
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;
