import React from 'react';

const LeadScore = ({ score, grade = 'A' }) => {
  // Calcula el porcentaje para el relleno del círculo
  const strokeDasharray = 2 * Math.PI * 45; // 45 es el radio del círculo
  const progress = (score / 100) * strokeDasharray;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Círculo base */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="8"
        />
        {/* Círculo de progreso */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={score >= 70 ? '#4CAF50' : score >= 40 ? '#FFA726' : '#F44336'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDasharray - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Texto central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-sm text-gray-500">Grade {grade}</span>
      </div>
    </div>
  );
};

export default LeadScore;