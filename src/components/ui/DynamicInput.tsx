import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { type FieldError } from "react-hook-form";

export type InputType = 
  | "text" 
  | "email" 
  | "password" 
  | "number" 
  | "tel" 
  | "url" 
  | "search"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "file"
  | "date"
  | "datetime-local"
  | "time";

export type SelectOption = {
  value: string;
  label: string;
};

export type DynamicInputProps = {
  type: InputType;
  placeholder?: string;
  error?: FieldError;
  className?: string;
  options?: SelectOption[];
  rows?: number;
  showPasswordToggle?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  multiple?: boolean;
  accept?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export const DynamicInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  DynamicInputProps
>(({ 
  type, 
  placeholder, 
  error, 
  className = "", 
  options = [],
  rows = 4,
  showPasswordToggle = false,
  icon,
  loading = false,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const baseClasses = `w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent outline-none transition-all ${
    error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
  } ${className}`;

  const inputType = type === "password" && showPassword ? "text" : type;

  if (type === "textarea") {
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        placeholder={placeholder}
        rows={rows}
        className={baseClasses}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }

  if (type === "select") {
    return (
      <select
        ref={ref as React.Ref<HTMLSelectElement>}
        className={baseClasses}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (type === "checkbox") {
    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type="checkbox"
        className="h-4 w-4 text-conectar-primary focus:ring-conectar-primary border-gray-300 rounded"
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  }

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={inputType}
        placeholder={placeholder}
        className={`${baseClasses} ${icon ? "pl-10" : ""} ${
          (type === "password" && showPasswordToggle) || loading ? "pr-12" : ""
        }`}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      
      {type === "password" && showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-conectar-primary"></div>
        </div>
      )}
    </div>
  );
});

DynamicInput.displayName = "DynamicInput";
