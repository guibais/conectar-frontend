import { type ReactNode } from "react";

type ActionButtonProps = {
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function ActionButton({ 
  onClick, 
  variant = "secondary", 
  children, 
  disabled = false,
  className = ""
}: ActionButtonProps) {
  const baseClasses = "px-6 py-3 rounded-lg font-medium cursor-pointer transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variantClasses = {
    primary: "bg-conectar-primary text-white hover:bg-conectar-600 hover:scale-105",
    secondary: "text-gray-600 border border-gray-200 hover:bg-gray-50 hover:scale-105",
    danger: "text-red-600 border border-red-300 hover:bg-red-50 hover:scale-105"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
