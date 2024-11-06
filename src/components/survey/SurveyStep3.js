import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import './SurveyStep3.css';

const SurveyStep3 = () => {
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState('');

  const contactRanges = [
    { id: '10-20', label: '10-20 contactos' },
    { id: '20-50', label: '20-50 contactos' },
    { id: '50-100', label: '50-100 contactos' },
    { id: '100-200', label: '100-200 contactos' },
    { id: '200-300', label: '200-300 contactos' },
    { id: '300-500', label: '300-500 contactos' },
    { id: '500+', label: 'Más de 500 contactos' }
  ];

  const handleRangeSelect = (rangeId) => {
    setSelectedRange(rangeId);
  };

  const handleSubmit = () => {
    if (selectedRange) {
      localStorage.setItem('surveyStep3', JSON.stringify(selectedRange));
      navigate('/loading');
    }
  };

  return (
    <div className="survey3-container">
      <div className="survey3-header">
        <img src={`${process.env.PUBLIC_URL}/KS-removebg-preview.png`} alt="Logo" className="survey3-logo" />
      </div>
      <div className="survey3-content">
        <div className="survey3-question">
          <h2>¿Cuántos contactos tienes aproximadamente en WhatsApp?</h2>
          <p>Selecciona el rango que mejor represente tu lista de contactos.</p>
          
          <div className="ranges-grid">
            {contactRanges.map(range => (
              <div
                key={range.id}
                className={`range-card ${selectedRange === range.id ? 'selected' : ''}`}
                onClick={() => handleRangeSelect(range.id)}
              >
                <Users size={24} />
                <span>{range.label}</span>
              </div>
            ))}
          </div>

          <button 
            className={`submit-button ${!selectedRange ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!selectedRange}
          >
            Finalizar
          </button>
        </div>
      </div>
      <div className="survey3-image">
        <img src={`${process.env.PUBLIC_URL}/survey12.png`} alt="Survey Step 3" />
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: "75%" }}></div>
      </div>
    </div>
  );
};

export default SurveyStep3;