import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardSkills.css';

const DashboardSkills = () => {
  const getEmptySkill = () => ({
    name: '',
    percent: '',
    note: '',
  });

  const getEmptyCategory = () => ({
    category: '',
    skills: [getEmptySkill()],
  });

  const [skillsData, setSkillsData] = useState([getEmptyCategory()]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/skills')
      .then((res) => {
        if (res.data.length > 0) {
          setSkillsData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading skills:', err);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (e, i) => {
    const updated = [...skillsData];
    updated[i].category = e.target.value;
    setSkillsData(updated);
  };

  const handleSkillChange = (e, catIdx, skillIdx, field) => {
    const updated = [...skillsData];
    updated[catIdx].skills[skillIdx][field] = e.target.value;
    setSkillsData(updated);
  };

  const addCategory = () => {
    setSkillsData([...skillsData, getEmptyCategory()]);
  };

  const deleteCategory = (index) => {
    const updated = [...skillsData];
    updated.splice(index, 1);
    setSkillsData(updated);
  };

  const addSkill = (catIdx) => {
    const updated = [...skillsData];
    updated[catIdx].skills.push(getEmptySkill());
    setSkillsData(updated);
  };

  const deleteSkill = (catIdx, skillIdx) => {
    const updated = [...skillsData];
    updated[catIdx].skills.splice(skillIdx, 1);
    if (updated[catIdx].skills.length === 0) {
      updated[catIdx].skills.push(getEmptySkill());
    }
    setSkillsData(updated);
  };

  const saveToDB = async () => {
    try {
      await axios.post('http://localhost:5000/api/skills', skillsData);
      alert('✅ Skills saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('❌ Error saving skills');
    }
  };

  return (
    <div className="ds-container">
      <h2 className="ds-heading">Manage Skills</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        skillsData.map((cat, catIdx) => (
          <div key={catIdx} className="ds-category">
            <input
              type="text"
              className="ds-category-input"
              placeholder="Category Name"
              value={cat.category}
              onChange={(e) => handleCategoryChange(e, catIdx)}
            />
            {cat.skills.map((skill, skillIdx) => (
              <div className="ds-skill-row" key={skillIdx}>
                <input
                  type="text"
                  className="ds-input"
                  placeholder="Skill Name"
                  value={skill.name}
                  onChange={(e) =>
                    handleSkillChange(e, catIdx, skillIdx, 'name')
                  }
                />
                <input
                  type="number"
                  className="ds-input"
                  placeholder="%"
                  value={skill.percent}
                  onChange={(e) =>
                    handleSkillChange(e, catIdx, skillIdx, 'percent')
                  }
                />
                <input
                  type="text"
                  className="ds-input"
                  placeholder="Note"
                  value={skill.note}
                  onChange={(e) =>
                    handleSkillChange(e, catIdx, skillIdx, 'note')
                  }
                />
                <button
                  className="ds-btn ds-delete-btn"
                  onClick={() => deleteSkill(catIdx, skillIdx)}
                >
                  Delete Skill
                </button>
              </div>
            ))}
            <button
              className="ds-btn ds-add-btn"
              onClick={() => addSkill(catIdx)}
            >
              ➕ Add Skill
            </button>
            <button
              className="ds-btn ds-delete-btn"
              onClick={() => deleteCategory(catIdx)}
            >
              🗑️ Delete Category
            </button>
          </div>
        ))
      )}
      <button className="ds-btn ds-add-category-btn" onClick={addCategory}>
        ➕ Add Category
      </button>
      <button className="ds-btn ds-save-btn" onClick={saveToDB}>
        💾 Save Changes
      </button>
    </div>
  );
};

export default DashboardSkills;
