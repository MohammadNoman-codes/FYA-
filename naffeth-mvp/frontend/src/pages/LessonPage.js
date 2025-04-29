import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
// Import Quiz component later
// import QuizComponent from '../components/Learn/QuizComponent';

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError('');
      try {
        // Use the correct endpoint based on server.js setup
        const response = await api.get(`/lessons/${lessonId}`);
        setLesson(response.data.data);
      } catch (err) {
        setError('Failed to load lesson details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!lesson) return <p>Lesson not found.</p>;

  return (
    <div>
      <Link to={`/courses/${lesson.course}`}>&larr; Back to Course</Link>
      <h1>{lesson.title}</h1>
      <div className="card">
        <h2>Lesson Content</h2>
        {lesson.videoUrl && (
          <div style={{ marginBottom: '1rem' }}>
            {/* Basic video embed - consider using a library like ReactPlayer */}
            <iframe
                width="560"
                height="315"
                src={lesson.videoUrl.replace("watch?v=", "embed/")} // Basic YouTube embed conversion
                title="Lesson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe>
          </div>
        )}
        {/* Render content - If Markdown, use a library like react-markdown */}
        <div dangerouslySetInnerHTML={{ __html: lesson.content }}></div>
      </div>

      {lesson.quiz && (
        <div className="card" style={{marginTop: '2rem'}}>
          <h2>Quiz</h2>
          <p>Quiz component will go here. ID: {lesson.quiz._id}</p>
          {/* <QuizComponent quizData={lesson.quiz} /> */}
           <p>Questions: {lesson.quiz.questions?.length || 0}</p>
           <p>Points: {lesson.quiz.pointsAwarded}</p>
           {/* Add button/component to start/take quiz */}
        </div>
      )}
    </div>
  );
};

export default LessonPage;
