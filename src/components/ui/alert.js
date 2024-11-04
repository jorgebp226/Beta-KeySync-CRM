import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Alert = React.forwardRef(({ className, variant = 'info', children, ...props }, ref) => {
  const colors = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    destructive: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border-l-4 p-4 rounded-md ${colors[variant]} ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </motion.div>
  );
});

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm ${className}`}
    {...props}
  />
));

Alert.displayName = "Alert";
AlertDescription.displayName = "AlertDescription";

Alert.propTypes = {
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'destructive']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

AlertDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export { Alert, AlertDescription };
