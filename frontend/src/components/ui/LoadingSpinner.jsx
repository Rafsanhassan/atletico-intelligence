const LoadingSpinner = ({ text = "Loading", className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-2 text-sm text-[#8b949e] ${className}`}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#30363d] border-t-[#00d4b4]"></span>
      {text ? <span>{text}</span> : null}
    </div>
  );
};

export default LoadingSpinner;
