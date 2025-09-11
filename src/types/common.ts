export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  lastLoginAt?: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  tradeName?: string;
  taxId?: string;
  companyName?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  complement?: string;
  status: "Active" | "Inactive";
  conectaPlus: boolean;
  createdAt: string;
  lastLoginAt?: string;
};

export type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  pagination?: PaginationData;
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
};

export type FilterOptions = {
  name?: string;
  email?: string;
  status?: "Active" | "Inactive";
  conectaPlus?: "Yes" | "No";
  taxId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};
