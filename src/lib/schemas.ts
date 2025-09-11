import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const clientSchema = z.object({
  tradeName: z.string().min(1, 'Trade name é obrigatório'),
  taxId: z.string().regex(/^[0-9]{14}$/, 'Tax ID deve conter 14 dígitos'),
  companyName: z.string().min(1, 'Company name é obrigatória'),
  status: z.enum(['Active', 'Inactive'], { required_error: 'Status é obrigatório' }),
  zipCode: z.string().regex(/^[0-9]{8}$|^[0-9]{5}-[0-9]{3}$/, 'Zip code deve conter 8 dígitos'),
  street: z.string().min(1, 'Street é obrigatória'),
  number: z.string().min(1, 'Number é obrigatório'),
  district: z.string().min(1, 'District é obrigatório'),
  city: z.string().min(1, 'City é obrigatória'),
  state: z.string().min(2, 'State é obrigatório'),
  complement: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export const userProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
});

export const filterSchema = z.object({
  name: z.string().optional(),
  taxId: z.string().optional(),
  status: z.enum(['Active', 'Inactive', '']).optional(),
  conectaPlus: z.enum(['Sim', 'Não', '']).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type FilterFormData = z.infer<typeof filterSchema>;
