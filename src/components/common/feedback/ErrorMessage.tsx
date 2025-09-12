type ErrorMessageProps = {
  message: string;
  className?: string;
};

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  return (
    <div 
      className={`p-4 bg-red-50 border border-red-200 rounded-lg mb-6 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}
