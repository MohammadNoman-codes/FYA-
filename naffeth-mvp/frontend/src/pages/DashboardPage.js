import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Import api service
import LoadingSpinner from '../components/Common/LoadingSpinner'; // Import LoadingSpinner

// Import Chart.js components
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);


const DashboardPage = () => {
  const { user } = useAuth();
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState('');

  // Fetch courses for recommendations
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      setErrorCourses('');
      try {
        const response = await api.get('/courses');
        // Recommend first 3 courses for simplicity
        setRecommendedCourses(response.data.data.slice(0, 3));
      } catch (err) {
        setErrorCourses('Failed to load course recommendations.');
        console.error(err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // --- Simulate Skills Data for Radar Chart ---
  // In a real app, this data would come from user progress tracking
  const categories = ['IoT', 'AI', 'Programming', 'Electronics', 'Robotics']; // Match course categories
  const userSkillsData = {
    labels: categories,
    datasets: [
      {
        label: 'Your Skills Profile',
        // Simulate skill levels (e.g., based on user level or points) - max 10 for example
        data: [
            Math.min(10, (user?.level || 1) + 1), // IoT
            Math.min(10, (user?.level || 1) + 3), // AI
            Math.min(10, (user?.level || 1) - 1), // Programming
            Math.min(10, (user?.level || 1) + 0), // Electronics
            Math.min(10, (user?.level || 1) + 2)  // Robotics
        ].map(val => Math.max(1, val)), // Ensure minimum skill level of 1
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
        pointBackgroundColor: 'rgba(0, 123, 255, 1)',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 10, // Adjust max based on your skill scale
        ticks: {
            stepSize: 2 // Adjust step size
        }
      },
    },
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            enabled: true
        }
    }
  };
  // --- End Skills Data Simulation ---


  // Simple Level Visualization (e.g., using text or a basic bar)
  const renderLevelProgress = () => {
    const currentLevel = user?.level || 1;
    // Example: Simple text display
    return <p>Current Level: {currentLevel}</p>;
    // Example: Basic progress bar (requires CSS)
    // const progressPercent = (currentLevel / 15) * 100; // Assuming max level 15
    // return <div className="level-bar-container"><div className="level-bar" style={{ width: `${progressPercent}%` }}>Level {currentLevel}</div></div>;
  };

  const staticImageUrl = '/images/hackathon.jpg'; // Use the static image
  const placeholderImageUrl = "https://via.placeholder.com/300x180.png?text=Course+Image"; // Fallback

  return (
    <div>
      <h1>Welcome to your Dashboard, {user?.name}!</h1>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

        {/* Progress Section */}
        <div className="card" style={{ padding: '1rem' }}> {/* Add padding back */}
          <h2>Your Progress</h2>
          {renderLevelProgress()}
          <p>Total Points: {user?.points}</p>
          {/* Add more dashboard elements later: progress bars, recent activity, badges etc. */}
        </div>

        {/* Skills Radar Chart Section */}
        <div className="card" style={{ padding: '1rem' }}> {/* Add padding back */}
          <h2>Your Skills Profile</h2>
          <div style={{ maxHeight: '350px', position: 'relative' }}> {/* Constrain chart size */}
             <Radar data={userSkillsData} options={radarOptions} />
          </div>
        </div>

        {/* Course Recommendations Section */}
        <div className="card" style={{ padding: '1rem', gridColumn: '1 / -1' }}> {/* Span full width */}
          <h2>Recommended Courses</h2>
          {loadingCourses ? (
            <LoadingSpinner />
          ) : errorCourses ? (
            <p style={{ color: 'red' }}>{errorCourses}</p>
          ) : recommendedCourses.length > 0 ? (
            <div className="recommendations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {recommendedCourses.map(course => (
                <div key={course.id} className="course-card-small card"> {/* Re-use card style or make smaller */}
                  <Link to={`/courses/${course.id}`} className="course-card-link">
                     <img
                        src={staticImageUrl} // Use static image
                        alt={`${course.title} course image`}
                        className="course-card-image" // Adjust height if needed for smaller card
                        style={{ height: '120px' }} // Example smaller height
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImageUrl; }}
                     />
                    <div className="course-card-content" style={{ padding: '0.8rem' }}> {/* Adjust padding */}
                      <h4 className="course-card-title" style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{course.title}</h4> {/* Adjust font size */}
                      <p className="course-card-description" style={{ fontSize: '0.8rem' }}>{course.description.substring(0, 60)}...</p> {/* Adjust font size */}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No course recommendations available right now.</p>
          )}
           <div style={{ marginTop: '1rem' }}>
             <Link to="/courses">Browse All Courses</Link>
           </div>
        </div>

      </div> {/* End dashboard-grid */}
    </div>
  );
};

export default DashboardPage;
