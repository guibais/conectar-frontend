type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

export function LoadingSpinner({ size = "md", className = "", label = "Carregando..." }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-32 w-32"
  };

  return (
    <div 
      className={`animate-spin rounded-full border-b-2 border-white ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={label}
      aria-live="polite"
    />
  );
}
