import { type ReactNode } from 'react';
import { type ZodSchema } from 'zod';
import { useTranslation } from 'react-i18next';
import { DynamicForm, type FormFieldConfig } from '../ui/DynamicForm';

export type ClientFormData = {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  tradeName?: string;
  companyName?: string;
  taxId?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  conectaPlus: boolean;
};

type ClientFormProps = {
  schema: ZodSchema<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
  defaultValues?: Partial<ClientFormData>;
  isLoading?: boolean;
  submitText?: string;
  showPasswordFields?: boolean;
  children?: ReactNode;
  formActions?: ReactNode;
  fields?: FormFieldConfig[];
};

function getDefaultClientFields(t: (key: string) => string): FormFieldConfig[] {
  return [
    {
      name: "name",
      label: t("clients.fields.name"),
      type: "text",
      placeholder: t("clients.placeholders.name"),
      required: true,
    },
    {
      name: "email",
      label: t("clients.fields.email"),
      type: "email",
      placeholder: t("clients.placeholders.email"),
      required: true,
    },
    {
      name: "tradeName",
      label: t("clients.fields.tradeName"),
      type: "text",
      placeholder: t("clients.placeholders.tradeName"),
    },
    {
      name: "companyName",
      label: t("clients.fields.companyName"),
      type: "text",
      placeholder: t("clients.placeholders.companyName"),
    },
    {
      name: "taxId",
      label: t("clients.fields.taxId"),
      type: "text",
      placeholder: t("clients.placeholders.taxId"),
    },
    {
      name: "phone",
      label: t("clients.fields.phone"),
      type: "text",
      placeholder: t("clients.placeholders.phone"),
    },
    {
      name: "zipCode",
      label: t("clients.fields.zipCode"),
      type: "text",
      placeholder: t("clients.placeholders.zipCode"),
    },
    {
      name: "street",
      label: t("clients.fields.street"),
      type: "text",
      placeholder: t("clients.placeholders.street"),
      gridCols: 2,
    },
    {
      name: "number",
      label: t("clients.fields.number"),
      type: "text",
      placeholder: t("clients.placeholders.number"),
    },
    {
      name: "complement",
      label: t("clients.fields.complement"),
      type: "text",
      placeholder: t("clients.placeholders.complement"),
    },
    {
      name: "district",
      label: t("clients.fields.district"),
      type: "text",
      placeholder: t("clients.placeholders.district"),
    },
    {
      name: "city",
      label: t("clients.fields.city"),
      type: "text",
      placeholder: t("clients.placeholders.city"),
    },
    {
      name: "state",
      label: t("clients.fields.state"),
      type: "select",
      options: [
        { value: "", label: t("clients.options.selectState") },
        { value: "AC", label: t("clients.states.AC") },
        { value: "AL", label: t("clients.states.AL") },
        { value: "AP", label: t("clients.states.AP") },
        { value: "AM", label: t("clients.states.AM") },
        { value: "BA", label: t("clients.states.BA") },
        { value: "CE", label: t("clients.states.CE") },
        { value: "DF", label: t("clients.states.DF") },
        { value: "ES", label: t("clients.states.ES") },
        { value: "GO", label: t("clients.states.GO") },
        { value: "MA", label: t("clients.states.MA") },
        { value: "MT", label: t("clients.states.MT") },
        { value: "MS", label: t("clients.states.MS") },
        { value: "MG", label: t("clients.states.MG") },
        { value: "PA", label: t("clients.states.PA") },
        { value: "PB", label: t("clients.states.PB") },
        { value: "PR", label: t("clients.states.PR") },
        { value: "PE", label: t("clients.states.PE") },
        { value: "PI", label: t("clients.states.PI") },
        { value: "RJ", label: t("clients.states.RJ") },
        { value: "RN", label: t("clients.states.RN") },
        { value: "RS", label: t("clients.states.RS") },
        { value: "RO", label: t("clients.states.RO") },
        { value: "RR", label: t("clients.states.RR") },
        { value: "SC", label: t("clients.states.SC") },
        { value: "SP", label: t("clients.states.SP") },
        { value: "SE", label: t("clients.states.SE") },
        { value: "TO", label: t("clients.states.TO") },
      ],
    },
    {
      name: "status",
      label: t("clients.fields.status"),
      type: "select",
      required: true,
      options: [
        { value: "Active", label: t("clients.options.active") },
        { value: "Inactive", label: t("clients.options.inactive") },
      ],
    },
    {
      name: "conectaPlus",
      label: t("clients.fields.conectaPlus"),
      type: "select",
      options: [
        { value: "false", label: t("common.no") },
        { value: "true", label: t("common.yes") },
      ],
    },
  ];
}

export function ClientForm({
  schema,
  onSubmit,
  defaultValues,
  isLoading = false,
  submitText,
  showPasswordFields = false,
  children,
  formActions,
  fields,
}: ClientFormProps) {
  const { t } = useTranslation();
  const clientFields = fields || getDefaultClientFields(t);
  const defaultSubmitText = submitText || t("common.save");
  
  const formFields = showPasswordFields
    ? [
        ...clientFields.slice(0, 2),
        {
          name: "password",
          label: t("clients.fields.password"),
          type: "password" as const,
          placeholder: t("clients.placeholders.password"),
          required: true,
        },
        {
          name: "confirmPassword",
          label: t("clients.fields.confirmPassword"),
          type: "password" as const,
          placeholder: t("clients.placeholders.confirmPassword"),
          required: true,
        },
        ...clientFields.slice(2),
      ]
    : clientFields;

  return (
    <DynamicForm
      fields={formFields}
      schema={schema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      submitLabel={defaultSubmitText}
      isLoading={isLoading}
      formActions={formActions}
    >
      {children}
    </DynamicForm>
  );
}
