import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Remove BACKEND_URL import
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const CourseListPage = () => {
  // ...existing state (courses, loading, error)...
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // ...existing useEffect...
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/courses');
        setCourses(response.data.data);
      } catch (err) {
        setError('Failed to load courses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);


  // ...existing loading/error handling...
  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;


  // Define the static image path relative to the public folder
  const staticImageUrl = '/images/hackathon.jpg'; // Assuming your image is here
  const placeholderImageUrl = "https://via.placeholder.com/300x180.png?text=Course+Image"; // Fallback

  return (
    <div>
      <h1>Available Courses</h1>
      {courses.length === 0 ? (
        <p>No courses available yet.</p>
      ) : (
        <div className="course-grid">
          {courses.map(course => {
            // No need to construct URL dynamically anymore
            return (
              <div key={course.id} className="course-card card">
                <Link to={`/courses/${course.id}`} className="course-card-link">
                  <img
                    src={staticImageUrl} // Use the static path directly
                    alt={`${course.title} course image`}
                    className="course-card-image"
                    // Add error handling for broken images (optional but good practice)
                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderImageUrl; }}
                  />
                  <div className="course-card-content">
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-description">{course.description.substring(0, 80)}...</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseListPage;
