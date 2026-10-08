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

// Function to send a message to the chatbot backend
export const sendChatMessage = async (message) => {
  try {
    const response = await api.post('/chatbot/message', { message });
    return response.data; // Should contain { success: true, reply: "..." }
  } catch (error) {
    console.error('Error sending chat message:', error.response?.data || error.message);
    // Return a structured error or throw it
    return { success: false, message: error.response?.data?.message || 'Failed to get chat response.' };
  }
};

// --- Project API Functions ---

// Function to fetch all projects
export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data; // Should contain { success: true, count: ..., data: [...] }
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch projects.' };
  }
};

// Function to create a new project
export const createProject = async (projectData) => {
  // projectData should be { name, description, competitionName, category }
  try {
    const response = await api.post('/projects', projectData);
    return response.data; // Should contain { success: true, data: { new project } }
  } catch (error) {
    console.error('Error creating project:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to create project.' };
  }
};


export default api;
