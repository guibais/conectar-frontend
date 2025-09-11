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
    return (
      <div ref={ref} className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
