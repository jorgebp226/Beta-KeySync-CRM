import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Alert = ({ variant = 'info', children }) => {
  const colors = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    destructive: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border-l-4 p-4 rounded-md ${colors[variant]}`}
      role="alert"
    >
      <p>{children}</p>
    </motion.div>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'destructive']),
  children: PropTypes.node.isRequired
};

export default Alert;
