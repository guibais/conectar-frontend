import { type FormFieldConfig } from "@/components/ui/DynamicForm";

export const commonFields = {
  name: {
    name: "name",
    label: "Nome completo",
    type: "text",
    placeholder: "Digite o nome completo",
    required: true,
    gridCols: 1,
  } as FormFieldConfig,

  email: {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Digite o email",
    required: true,
    gridCols: 1,
  } as FormFieldConfig,

  password: {
    name: "password",
    label: "Senha",
    type: "password",
    placeholder: "••••••",
    required: true,
    showPasswordToggle: true,
    gridCols: 1,
  } as FormFieldConfig,

  role: {
    name: "role",
    label: "Perfil",
    type: "select",
    options: [
      { value: "user", label: "Usuário" },
      { value: "admin", label: "Administrador" },
    ],
    required: true,
    gridCols: 1,
  } as FormFieldConfig,

  tradeName: {
    name: "tradeName",
    label: "Nome Fantasia",
    type: "text",
    placeholder: "Digite o nome fantasia",
    gridCols: 1,
  } as FormFieldConfig,

  taxId: {
    name: "taxId",
    label: "CNPJ",
    type: "text",
    placeholder: "00.000.000/0000-00",
    gridCols: 1,
  } as FormFieldConfig,

  companyName: {
    name: "companyName",
    label: "Razão Social",
    type: "text",
    placeholder: "Digite a razão social",
    gridCols: 2,
  } as FormFieldConfig,

  zipCode: {
    name: "zipCode",
    label: "CEP",
    type: "text",
    placeholder: "00000-000",
    gridCols: 1,
  } as FormFieldConfig,

  city: {
    name: "city",
    label: "Cidade",
    type: "text",
    placeholder: "Digite a cidade",
    gridCols: 1,
  } as FormFieldConfig,

  street: {
    name: "street",
    label: "Rua",
    type: "text",
    placeholder: "Digite a rua",
    gridCols: 1,
  } as FormFieldConfig,

  number: {
    name: "number",
    label: "Número",
    type: "text",
    placeholder: "Digite o número",
    gridCols: 1,
  } as FormFieldConfig,

  district: {
    name: "district",
    label: "Bairro",
    type: "text",
    placeholder: "Digite o bairro",
    gridCols: 1,
  } as FormFieldConfig,

  state: {
    name: "state",
    label: "Estado",
    type: "text",
    placeholder: "Digite o estado",
    gridCols: 1,
  } as FormFieldConfig,

  complement: {
    name: "complement",
    label: "Complemento",
    type: "text",
    placeholder: "Digite o complemento",
    gridCols: 1,
  } as FormFieldConfig,

  status: {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Active", label: "Ativo" },
      { value: "Inactive", label: "Inativo" },
    ],
    required: true,
    gridCols: 1,
  } as FormFieldConfig,

  conectaPlus: {
    name: "conectaPlus",
    label: "Conecta+",
    type: "select",
    options: [
      { value: "Yes", label: "Sim" },
      { value: "No", label: "Não" },
    ],
    required: true,
    gridCols: 1,
  } as FormFieldConfig,
};

export const clientFormFields: FormFieldConfig[] = [
  commonFields.name,
  commonFields.email,
  commonFields.password,
  commonFields.role,
  commonFields.tradeName,
  commonFields.taxId,
  commonFields.companyName,
  commonFields.zipCode,
  commonFields.city,
  commonFields.street,
  commonFields.number,
  commonFields.district,
  commonFields.state,
  commonFields.complement,
  commonFields.status,
  commonFields.conectaPlus,
];

export const authFormFields = {
  login: [
    { ...commonFields.email, gridCols: 2 },
    { ...commonFields.password, gridCols: 2 },
  ],

  register: [
    { ...commonFields.name, gridCols: 2 },
    { ...commonFields.email, gridCols: 2 },
    { ...commonFields.password, gridCols: 1 },
    {
      name: "confirmPassword",
      label: "Confirmar senha",
      type: "password",
      placeholder: "••••••",
      required: true,
      showPasswordToggle: true,
      gridCols: 1,
    } as FormFieldConfig,
  ],

  profile: [
    commonFields.name,
    commonFields.email,
    {
      name: "password",
      label: "Nova senha (opcional)",
      type: "password",
      placeholder: "Digite uma nova senha",
      gridCols: 2,
    } as FormFieldConfig,
  ],
};
