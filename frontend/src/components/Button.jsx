import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  loading = false, 
  icon: Icon,
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 outline-none";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm",
    secondary: "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm"
  };

  return (
    <button
      disabled={loading || disabled}
      className={clsx(
        baseStyles,
        variants[variant],
        (loading || disabled) && "opacity-70 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;
