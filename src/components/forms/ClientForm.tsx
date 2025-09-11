import { type ReactNode } from 'react';
import { type ZodSchema } from 'zod';
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

const defaultClientFields: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nome",
    type: "text",
    placeholder: "Nome completo",
    required: true,
  },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    placeholder: "email@exemplo.com",
    required: true,
  },
  {
    name: "tradeName",
    label: "Nome Fantasia",
    type: "text",
    placeholder: "Nome fantasia da empresa",
  },
  {
    name: "companyName",
    label: "Razão Social",
    type: "text",
    placeholder: "Razão social da empresa",
  },
  {
    name: "taxId",
    label: "CNPJ",
    type: "text",
    placeholder: "00.000.000/0000-00",
  },
  {
    name: "phone",
    label: "Telefone",
    type: "text",
    placeholder: "(00) 00000-0000",
  },
  {
    name: "zipCode",
    label: "CEP",
    type: "text",
    placeholder: "00000-000",
  },
  {
    name: "street",
    label: "Rua",
    type: "text",
    placeholder: "Nome da rua",
    gridCols: 2,
  },
  {
    name: "number",
    label: "Número",
    type: "text",
    placeholder: "123",
  },
  {
    name: "complement",
    label: "Complemento",
    type: "text",
    placeholder: "Apto, sala, etc.",
  },
  {
    name: "district",
    label: "Bairro",
    type: "text",
    placeholder: "Nome do bairro",
  },
  {
    name: "city",
    label: "Cidade",
    type: "text",
    placeholder: "Nome da cidade",
  },
  {
    name: "state",
    label: "Estado",
    type: "select",
    options: [
      { value: "", label: "Selecione o estado" },
      { value: "AC", label: "Acre" },
      { value: "AL", label: "Alagoas" },
      { value: "AP", label: "Amapá" },
      { value: "AM", label: "Amazonas" },
      { value: "BA", label: "Bahia" },
      { value: "CE", label: "Ceará" },
      { value: "DF", label: "Distrito Federal" },
      { value: "ES", label: "Espírito Santo" },
      { value: "GO", label: "Goiás" },
      { value: "MA", label: "Maranhão" },
      { value: "MT", label: "Mato Grosso" },
      { value: "MS", label: "Mato Grosso do Sul" },
      { value: "MG", label: "Minas Gerais" },
      { value: "PA", label: "Pará" },
      { value: "PB", label: "Paraíba" },
      { value: "PR", label: "Paraná" },
      { value: "PE", label: "Pernambuco" },
      { value: "PI", label: "Piauí" },
      { value: "RJ", label: "Rio de Janeiro" },
      { value: "RN", label: "Rio Grande do Norte" },
      { value: "RS", label: "Rio Grande do Sul" },
      { value: "RO", label: "Rondônia" },
      { value: "RR", label: "Roraima" },
      { value: "SC", label: "Santa Catarina" },
      { value: "SP", label: "São Paulo" },
      { value: "SE", label: "Sergipe" },
      { value: "TO", label: "Tocantins" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "Active", label: "Ativo" },
      { value: "Inactive", label: "Inativo" },
    ],
  },
  {
    name: "conectaPlus",
    label: "Conecta Plus",
    type: "select",
    options: [
      { value: "false", label: "Não" },
      { value: "true", label: "Sim" },
    ],
  },
];

export function ClientForm({
  schema,
  onSubmit,
  defaultValues,
  isLoading = false,
  submitText = "Salvar",
  showPasswordFields = false,
  children,
  formActions,
  fields,
}: ClientFormProps) {
  const clientFields = fields || defaultClientFields;
  
  const formFields = showPasswordFields
    ? [
        ...clientFields.slice(0, 2),
        {
          name: "password",
          label: "Senha",
          type: "password" as const,
          placeholder: "Digite a senha",
          required: true,
        },
        {
          name: "confirmPassword",
          label: "Confirmar Senha",
          type: "password" as const,
          placeholder: "Confirme a senha",
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
      submitLabel={submitText}
      isLoading={isLoading}
      formActions={formActions}
    >
      {children}
    </DynamicForm>
  );
}
