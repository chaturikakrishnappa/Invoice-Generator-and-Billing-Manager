const Container = ({ children, className = '' }) => {
  return (
    <div className={`max-w-5xl mx-auto w-full px-4 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
