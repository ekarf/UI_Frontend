import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    study_hours: '',
    internet_access: '1',
    sleep_hours: '',
    total_score: '',
    stress_level: ''
  });

  const [result, setResult] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      "Study_Hours_per_Week": parseFloat(formData.study_hours),
      "Internet_Access_at_Home": parseInt(formData.internet_access),
      "Sleep_Hours_per_Night": parseFloat(formData.sleep_hours),
      "Total_Score": parseFloat(formData.total_score),
      "Stress_Level (1-10)": parseInt(formData.stress_level)
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.Prediction) {
        setResult(`Prediction: ${result.Prediction}`);
      } else {
        setResult("Error: " + JSON.stringify(result));
      }
    } catch (error) {
      setResult("Error connecting to backend.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h2>Student Pass/Fail Prediction</h2>

      <label htmlFor="study_hours">Study Hours per Week</label>
      <input type="number" id="study_hours" value={formData.study_hours} onChange={handleChange} />

      <label htmlFor="internet_access">Internet Access at Home</label>
      <select id="internet_access" value={formData.internet_access} onChange={handleChange}>
        <option value="1">Yes (1)</option>
        <option value="0">No (0)</option>
      </select>

      <label htmlFor="sleep_hours">Sleep Hours per Night</label>
      <input type="number" id="sleep_hours" value={formData.sleep_hours} onChange={handleChange} />

      <label htmlFor="total_score">Total Score</label>
      <input type="number" id="total_score" value={formData.total_score} onChange={handleChange} />

      <label htmlFor="stress_level">Stress Level (1-10)</label>
      <input type="number" id="stress_level" min="1" max="10" value={formData.stress_level} onChange={handleChange} />

      <button onClick={handleSubmit}>Predict</button>

      <div className="result">{result}</div>
    </div>
  );
}

export default App;
