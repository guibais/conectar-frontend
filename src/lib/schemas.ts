import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const clientSchema = z.object({
  nomeFachada: z.string().min(1, 'Nome na fachada é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  razaoSocial: z.string().min(1, 'Razão social é obrigatória'),
  cep: z.string().min(8, 'CEP inválido'),
  rua: z.string().min(1, 'Rua é obrigatória'),
  numero: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado é obrigatório'),
  complemento: z.string().optional(),
});

export const userProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
});

export const filterSchema = z.object({
  name: z.string().optional(),
  cnpj: z.string().optional(),
  status: z.enum(['Ativo', 'Inativo', '']).optional(),
  conectaPlus: z.enum(['Sim', 'Não', '']).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type FilterFormData = z.infer<typeof filterSchema>;
