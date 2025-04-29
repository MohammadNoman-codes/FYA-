import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data.data);
      } catch (err) {
        setError('Failed to load course details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);


  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!course) return <p>Course not found.</p>;

  // Define the static image path relative to the public folder
  const staticImageUrl = '/images/hackathon.jpg'; // Assuming your image is here
  const placeholderImageUrl = "https://via.placeholder.com/600x300.png?text=Course+Image"; // Larger placeholder

  return (
    <div className="course-detail-container">
       <img
          src={staticImageUrl} // Use the static path directly
          alt={`${course.title} course banner`}
          className="course-detail-banner" // Add a class for styling
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImageUrl; }}
        />
      <h1>{course.title}</h1>
      <p className="course-meta">Category: {course.category} | Level: {course.level}</p>
      <p className="course-description-full">{course.description}</p>

      {/* Use a specific class for the lessons card */}
      <div className="card lessons-card">
        <h2>Lessons</h2>
        {/* Check for course.Lessons (capital L) and use lesson.id */}
        {course.Lessons && course.Lessons.length > 0 ? (
          <ul className="lessons-list">
            {course.Lessons.map(lesson => (
              <li key={lesson.id} className="lesson-item">
                <Link to={`/lessons/${lesson.id}`} className="lesson-link">
                  <span className="lesson-order">Lesson {lesson.order}:</span>
                  <span className="lesson-title">{lesson.title}</span>
                </Link>
                {/* Optionally display lesson description if available */}
                {/* <p className="lesson-description-short">{lesson.description?.substring(0, 100)}...</p> */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No lessons added to this course yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
