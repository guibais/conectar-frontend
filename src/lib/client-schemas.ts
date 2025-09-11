import { z } from "zod";

export const baseClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "user"]),
  tradeName: z.string().optional(),
  taxId: z.string().optional(),
  companyName: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  complement: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
  conectaPlus: z.string(),
});

export const createClientSchema = baseClientSchema.extend({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const updateClientSchema = baseClientSchema.extend({
  password: z.string().optional(),
});

export type BaseClientFormData = z.infer<typeof baseClientSchema>;
export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
