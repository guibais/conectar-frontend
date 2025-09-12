import { type ReactNode } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ZodSchema } from "zod";
import { useTranslation } from "react-i18next";
import { FormField } from "./FormField";
import { DynamicInput, type InputType, type SelectOption } from "../fields/DynamicInput";

export type FormFieldConfig = {
  name: string;
  label: string;
  type: InputType;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  rows?: number;
  showPasswordToggle?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
  gridCols?: number;
  disabled?: boolean;
  readOnly?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  accept?: string;
  multiple?: boolean;
  onChange?: (value: any) => void;
};

export type DynamicFormProps<T extends FieldValues> = {
  fields: FormFieldConfig[];
  schema: ZodSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: any;
  submitLabel?: string;
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
  formActions?: ReactNode;
  errorMessage?: string;
  successMessage?: string;
  fullWidthSubmit?: boolean;
};

export function DynamicForm<T extends FieldValues>({
  fields,
  schema,
  onSubmit,
  defaultValues,
  submitLabel,
  isLoading = false,
  children,
  className = "",
  formActions,
  errorMessage,
  successMessage,
  fullWidthSubmit = false,
}: DynamicFormProps<T>) {
  const { t } = useTranslation();
  const defaultSubmitLabel = submitLabel || t('common.submit');
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const { register, handleSubmit, formState: { errors }, setValue } = form;

  const handleFieldChange = (fieldName: string, onChange?: (value: any) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target as HTMLInputElement;
      const value = target.type === "checkbox" ? target.checked : target.value;
      setValue(fieldName as any, value as any);
      onChange?.(value);
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className={`space-y-6 ${className}`}>
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const fieldError = errors[field.name as keyof typeof errors];
          const gridColsClass = field.gridCols === 1 ? "md:col-span-1" : "md:col-span-2";

          return (
            <FormField
              key={field.name}
              label={field.label}
              required={field.required}
              error={fieldError as any}
              className={`${gridColsClass} ${field.className || ""}`}
            >
              <DynamicInput
                type={field.type}
                placeholder={field.placeholder}
                error={fieldError as any}
                options={field.options}
                rows={field.rows}
                showPasswordToggle={field.showPasswordToggle}
                icon={field.icon}
                loading={field.loading}
                disabled={field.disabled || isLoading}
                readOnly={field.readOnly}
                min={field.min}
                max={field.max}
                step={field.step}
                accept={field.accept}
                multiple={field.multiple}
                {...register(field.name as any)}
                onChange={handleFieldChange(field.name, field.onChange)}
              />
            </FormField>
          );
        })}
      </div>

      {children}

      {errors.root && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.root.message}</p>
        </div>
      )}

      <div className={fullWidthSubmit ? "space-y-3 pt-6" : "flex justify-end gap-3 pt-6"}>
        {fullWidthSubmit && formActions && (
          <div className="flex justify-center">
            {formActions}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer transform active:scale-95 disabled:hover:scale-100 ${
            fullWidthSubmit ? "w-full" : ""
          }`}
        >
          {isLoading ? t('common.loading') : defaultSubmitLabel}
        </button>
        {!fullWidthSubmit && formActions}
      </div>
    </form>
  );
}
