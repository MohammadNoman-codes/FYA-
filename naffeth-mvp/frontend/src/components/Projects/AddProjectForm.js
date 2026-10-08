import React, { useState } from 'react';
import { createProject } from '../../services/api'; // Import the API function

// Define categories matching the backend model
const projectCategories = ['IoT', 'AI', 'Programming', 'Electronics', 'Automation', 'Robotics', 'Web', 'Mobile', 'Other'];

const AddProjectForm = ({ onProjectAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [competitionName, setCompetitionName] = useState('');
  const [category, setCategory] = useState(projectCategories[0]); // Default to first category
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const projectData = { name, description, competitionName, category };
    const response = await createProject(projectData);

    setLoading(false);
    if (response.success) {
      // Clear form
      setName('');
      setDescription('');
      setCompetitionName('');
      setCategory(projectCategories[0]);
      // Notify parent component (ProjectListPage) to refresh the list
      if (onProjectAdded) {
        onProjectAdded(response.data); // Pass the newly added project data
      }
    } else {
      setError(response.message || 'Failed to add project. Please try again.');
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <h2>Add New Competition Project</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="projectDescription">Description:</label>
          <textarea
            id="projectDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="3"
            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} // Basic textarea style
          />
        </div>
        <div>
          <label htmlFor="competitionName">Competition Name:</label>
          <input
            type="text"
            id="competitionName"
            value={competitionName}
            onChange={(e) => setCompetitionName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="projectCategory">Category:</label>
          <select
            id="projectCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} // Basic select style
          >
            {projectCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Project'}
        </button>
      </form>
    </div>
  );
};

export default AddProjectForm;
