import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/api'; // Import API function
import LoadingSpinner from '../components/Common/LoadingSpinner';
import AddProjectForm from '../components/Projects/AddProjectForm'; // Import the form

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle form visibility

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    const response = await getProjects();
    if (response.success) {
      setProjects(response.data);
    } else {
      setError(response.message || 'Failed to load projects.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Callback function for when a new project is added
  const handleProjectAdded = (newProject) => {
    setProjects(prevProjects => [newProject, ...prevProjects]); // Add new project to the top
    setShowAddForm(false); // Hide form after successful submission
  };

  if (loading && projects.length === 0) return <LoadingSpinner />; // Show spinner only on initial load

  // Define image URLs similar to CourseListPage
  const staticImageUrl = '/images/hackathon.jpg'; // Use the same static image
  const placeholderImageUrl = "https://via.placeholder.com/300x180.png?text=Project"; // Fallback

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Competition Projects</h1>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {/* Conditionally render the Add Project Form */}
      {showAddForm && <AddProjectForm onProjectAdded={handleProjectAdded} />}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Projects */}
      {projects.length === 0 && !loading && !showAddForm ? (
        <p>No projects submitted yet. Be the first!</p>
      ) : (
        <div className="course-grid" style={{ marginTop: '2rem' }}> {/* Reuse course-grid style */}
          {projects.map(project => (
            <div key={project.id} className="course-card card"> {/* Reuse course-card style */}
              {/* Link wrapper removed as there's no detail page yet */}
              {/* <Link to={`/projects/${project.id}`} className="course-card-link"> */}
                <img
                  src={staticImageUrl} // Use the static image path
                  alt={`${project.name} project image`}
                  className="course-card-image"
                  // Add error handling for broken images
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImageUrl; }}
                />
                <div className="course-card-content">
                  <h3 className="course-card-title">{project.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
                    Competition: {project.competitionName} | Category: {project.category}
                  </p>
                  <p className="course-card-description">{project.description.substring(0, 100)}...</p>
                </div>
              {/* </Link> */}
            </div>
          ))}
        </div>
      )}
       {loading && projects.length > 0 && <p>Loading more...</p>} {/* Indicate loading if refreshing */}
    </div>
  );
};

export default ProjectListPage;
