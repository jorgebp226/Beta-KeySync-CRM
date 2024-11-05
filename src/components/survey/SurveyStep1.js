import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Survey.css';

const SurveyStep1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    denominacion: '',
    telefono: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData, 
      [name]: value 
    }));
  };

  const handleNext = () => {
    localStorage.setItem('surveyStep1', JSON.stringify(formData));
    navigate('/survey/step2');
  };

  return (
    <div className="survey1-container">
      <div className="survey1-header">
        <img src={`${process.env.PUBLIC_URL}/KS-removebg-preview.png`} alt="Logo" className="survey1-logo" />
      </div>
      <div className="survey1-content">
        <div className="survey1-question">
          <h2>Háblanos un poco de ti</h2>
          <div className="form-group">
            <label>
              Nombre
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Apellidos
              <input 
                type="text" 
                name="apellidos" 
                value={formData.apellidos} 
                onChange={handleChange}
              />
            </label>
          </div>
          <button className="button1" onClick={handleNext}>Siguiente</button>
        </div>
      </div>
      <div className="survey1-image">
        <img src={`${process.env.PUBLIC_URL}/survey1.png`} alt="Survey Step 1" />
      </div>
      <div className="progress-bar">
        <div className="progress" style={{width: "25%"}}></div>
      </div>
    </div>
  );
};

export default SurveyStep1;