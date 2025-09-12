import { type ReactNode, forwardRef } from 'react';
import { type FieldError } from 'react-hook-form';

type FormFieldProps = {
  label: string;
  error?: FieldError;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, required, children, className = '' }, ref) => {
    const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${fieldId}-error` : undefined;

    return (
      <div ref={ref} className={className}>
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && (
            <span 
              className="text-red-500 ml-1"
              aria-label="campo obrigatório"
            >
              *
            </span>
          )}
        </label>
        <div id={fieldId}>
          {children}
        </div>
        {error && (
          <p 
            id={errorId}
            className="mt-1 text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
