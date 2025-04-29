import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import Page Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import Navbar from './components/Layout/Navbar';
import LoadingSpinner from './components/Common/LoadingSpinner';
import Chatbot from './components/Chatbot/Chatbot'; // Import the Chatbot component

// Simple Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Optional: Show a loading spinner while checking auth status
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, loading } = useAuth(); // Get isAuthenticated status

  if (loading) {
     // Optional: Show a loading spinner for the whole app initially
     return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Navbar /> {/* Display Navbar on all pages */}
      <main className="container mx-auto p-4"> {/* Basic container styling */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><CourseListPage /></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
          <Route path="/lessons/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />

          {/* Redirect root path */}
          {/* Redirect to login if not authenticated, otherwise to dashboard */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />


          {/* Add a 404 Not Found route later */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
      {/* Render Chatbot only if authenticated */}
      {isAuthenticated && <Chatbot />}
    </div>
  );
}

export default App;
