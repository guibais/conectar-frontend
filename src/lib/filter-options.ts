export type SelectOption = {
  value: string;
  label: string;
};

export const filterOptions = {
  status: [
    { value: "", label: "Todos" },
    { value: "Active", label: "Ativo" },
    { value: "Inactive", label: "Inativo" },
  ] as SelectOption[],

  conectaPlus: [
    { value: "", label: "Todos" },
    { value: "Yes", label: "Sim" },
    { value: "No", label: "Não" },
  ] as SelectOption[],

  userRole: [
    { value: "", label: "Todos" },
    { value: "user", label: "Usuário" },
    { value: "admin", label: "Administrador" },
  ] as SelectOption[],
};
