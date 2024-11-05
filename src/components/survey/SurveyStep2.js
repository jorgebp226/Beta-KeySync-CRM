import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Car, Laptop, Shield, GraduationCap, 
         Wallet, Heart, Cloud, Sun, Shirt, Apple, Plane, 
         Factory, Target, Sofa, Phone, Scale, Truck, Smile } from 'lucide-react';

const SurveyStep2 = () => {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState('');

  const sectors = [
    { id: 'Inmobiliaria', label: 'Inmobiliaria', icon: Building2 },
    { id: 'Construcción de Piscinas', label: 'Construcción de Piscinas', icon: Building2 },
    { id: 'Automóviles', label: 'Automóviles', icon: Car },
    { id: 'Tecnología', label: 'Tecnología', icon: Laptop },
    { id: 'Seguros', label: 'Seguros', icon: Shield },
    { id: 'Educación', label: 'Educación', icon: GraduationCap },
    { id: 'Servicios Financieros', label: 'Servicios Financieros', icon: Wallet },
    { id: 'Salud y Bienestar', label: 'Salud y Bienestar', icon: Heart },
    { id: 'Software como Servicio (SaaS)', label: 'Software como Servicio (SaaS)', icon: Cloud },
    { id: 'Energías Renovables', label: 'Energías Renovables', icon: Sun },
    { id: 'Moda y Textiles', label: 'Moda y Textiles', icon: Shirt },
    { id: 'Alimentación y Bebidas', label: 'Alimentación y Bebidas', icon: Apple },
    { id: 'Viajes y Turismo', label: 'Viajes y Turismo', icon: Plane },
    { id: 'Equipos Industriales', label: 'Equipos Industriales', icon: Factory },
    { id: 'Publicidad y Marketing', label: 'Publicidad y Marketing', icon: Target },
    { id: 'Muebles y Decoración', label: 'Muebles y Decoración', icon: Sofa },
    { id: 'Telecomunicaciones', label: 'Telecomunicaciones', icon: Phone },
    { id: 'Servicios Legales', label: 'Servicios Legales', icon: Scale },
    { id: 'Transporte y Logística', label: 'Transporte y Logística', icon: Truck },
    { id: 'Productos de Belleza', label: 'Productos de Belleza', icon: Smile }
  ];

  const handleSectorSelect = (sectorId) => {
    setSelectedSector(sectorId);
  };

  const handleNext = () => {
    if (selectedSector) {
      localStorage.setItem('surveyStep2', JSON.stringify(selectedSector));
      navigate('/survey/step3');
    }
  };

  return (
    <div className="survey2-container">
      <div className="survey2-header">
        <img src={`${process.env.PUBLIC_URL}/KS-removebg-preview.png`} alt="Logo" className="survey2-logo" />
      </div>
      <div className="survey2-content">
        <div className="survey2-question">
          <h2>¿En qué sector opera tu empresa?</h2>
          <p>Selecciona el sector que mejor describa tu actividad principal.</p>
          
          <div className="sectors-grid">
            {sectors.map(sector => {
              const IconComponent = sector.icon;
              return (
                <div
                  key={sector.id}
                  className={`sector-card ${selectedSector === sector.id ? 'selected' : ''}`}
                  onClick={() => handleSectorSelect(sector.id)}
                >
                  <IconComponent size={24} />
                  <span>{sector.label}</span>
                </div>
              );
            })}
          </div>

          <button 
            className={`next-button ${!selectedSector ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={!selectedSector}
          >
            Siguiente
          </button>
        </div>
      </div>
      <div className="survey2-image">
        <img src={`${process.env.PUBLIC_URL}/survey2.png`} alt="Survey Step 2" />
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: "50%" }}></div>
      </div>
    </div>
  );
};

export default SurveyStep2;