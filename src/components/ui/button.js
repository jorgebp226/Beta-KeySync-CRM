import React from "react";

const getButtonClasses = ({ variant = "default", size = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    link: "text-slate-900 underline-offset-4 hover:underline",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600"
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
    xs: "h-8 px-2.5"
  };

  return `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`.trim();
};

const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={getButtonClasses({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, getButtonClasses };