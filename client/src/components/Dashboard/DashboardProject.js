import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardProject.css';

const DashboardProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEmptyProject = () => ({
    title: '',
    description: '',
    tech: [''],
    abstract: '',
    video: '',
    view: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/projects')
      .then((res) => {
        setProjects(res.data.length ? res.data : [getEmptyProject()]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  }, []);

  const handleProjectChange = (e, i, field) => {
    const updated = [...projects];
    updated[i][field] = e.target.value;
    setProjects(updated);
  };

  const handleTechChange = (e, projIndex, techIndex) => {
    const updated = [...projects];
    updated[projIndex].tech[techIndex] = e.target.value;
    setProjects(updated);
  };

  const addTech = (projIndex) => {
    const updated = [...projects];
    updated[projIndex].tech.push('');
    setProjects(updated);
  };

  const deleteTech = (projIndex, techIndex) => {
    const updated = [...projects];
    updated[projIndex].tech.splice(techIndex, 1);
    setProjects(updated);
  };

  const addNewProject = () => {
    setProjects([...projects, getEmptyProject()]);
  };

  const deleteProject = async (id, index) => {
    if (id) await axios.delete(`http://localhost:5000/api/projects/${id}`);
    const updated = [...projects];
    updated.splice(index, 1);
    setProjects(updated);
  };

  const saveChanges = async () => {
    for (let project of projects) {
      if (project._id) {
        await axios.put(
          `http://localhost:5000/api/projects/${project._id}`,
          project
        );
      } else {
        await axios.post('http://localhost:5000/api/projects', project);
      }
    }
    alert('✅ Projects saved!');
    const res = await axios.get('http://localhost:5000/api/projects');
    setProjects(res.data);
  };

  return (
    <div className="dp-container">
      <h3 className="dp-heading">Manage Projects</h3>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <>
          {projects.map((project, i) => (
            <div className="dp-project-card" key={i}>
              <input
                className="dp-input"
                placeholder="Project Title"
                value={project.title}
                onChange={(e) => handleProjectChange(e, i, 'title')}
              />
              <textarea
                className="dp-textarea"
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => handleProjectChange(e, i, 'description')}
              />
              <div className="dp-tech-list">
                <label className="dp-label">Technologies:</label>
                {project.tech.map((tech, j) => (
                  <div className="dp-tech-row" key={j}>
                    <input
                      className="dp-tech-input"
                      placeholder="Tech"
                      value={tech}
                      onChange={(e) => handleTechChange(e, i, j)}
                    />
                    <button
                      className="dp-btn dp-delete-btn"
                      onClick={() => deleteTech(i, j)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className="dp-btn dp-add-btn"
                  onClick={() => addTech(i)}
                >
                  + Add Tech
                </button>
              </div>
              <input
                className="dp-input"
                placeholder="Abstract PDF Link"
                value={project.abstract}
                onChange={(e) => handleProjectChange(e, i, 'abstract')}
              />
              <input
                className="dp-input"
                placeholder="Deployment Video Link"
                value={project.video}
                onChange={(e) => handleProjectChange(e, i, 'video')}
              />
              <input
                className="dp-input"
                placeholder="Project View Link"
                value={project.view}
                onChange={(e) => handleProjectChange(e, i, 'view')}
              />
              <button
                className="dp-btn dp-delete-btn"
                onClick={() => deleteProject(project._id, i)}
              >
                🗑️ Delete Project
              </button>
            </div>
          ))}

          <button className="dp-btn dp-add-project-btn" onClick={addNewProject}>
            ➕ Add New Project
          </button>

          <button className="dp-btn dp-save-btn" onClick={saveChanges}>
            💾 Save Changes
          </button>
        </>
      )}
    </div>
  );
};

export default DashboardProjects;
