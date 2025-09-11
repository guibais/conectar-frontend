import { type ReactNode } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

type ClientFormData = {
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
  neighborhood?: string;
  city?: string;
  state?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  conectaPlus: boolean;
};

type ClientFormProps = {
  form: UseFormReturn<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
  isLoading?: boolean;
  submitText?: string;
  showPasswordFields?: boolean;
  children?: ReactNode;
};

export function ClientForm({
  form,
  onSubmit,
  isLoading = false,
  submitText = 'Salvar',
  showPasswordFields = false,
  children,
}: ClientFormProps) {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nome" error={errors.name} required>
          <Input
            {...register('name')}
            placeholder="Nome completo"
            error={errors.name?.message}
          />
        </FormField>

        <FormField label="E-mail" error={errors.email} required>
          <Input
            {...register('email')}
            type="email"
            placeholder="email@exemplo.com"
            error={errors.email?.message}
          />
        </FormField>

        {showPasswordFields && (
          <>
            <FormField label="Senha" error={errors.password} required>
              <Input
                {...register('password')}
                type="password"
                placeholder="Digite a senha"
                error={errors.password?.message}
              />
            </FormField>

            <FormField label="Confirmar Senha" error={errors.confirmPassword} required>
              <Input
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirme a senha"
                error={errors.confirmPassword?.message}
              />
            </FormField>
          </>
        )}

        <FormField label="Nome Fantasia" error={errors.tradeName}>
          <Input
            {...register('tradeName')}
            placeholder="Nome fantasia da empresa"
            error={errors.tradeName?.message}
          />
        </FormField>

        <FormField label="Razão Social" error={errors.companyName}>
          <Input
            {...register('companyName')}
            placeholder="Razão social da empresa"
            error={errors.companyName?.message}
          />
        </FormField>

        <FormField label="CNPJ" error={errors.taxId}>
          <Input
            {...register('taxId')}
            placeholder="00.000.000/0000-00"
            error={errors.taxId?.message}
          />
        </FormField>

        <FormField label="Telefone" error={errors.phone}>
          <Input
            {...register('phone')}
            placeholder="(00) 00000-0000"
            error={errors.phone?.message}
          />
        </FormField>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField label="CEP" error={errors.zipCode}>
            <Input
              {...register('zipCode')}
              placeholder="00000-000"
              error={errors.zipCode?.message}
            />
          </FormField>

          <FormField label="Rua" error={errors.street} className="lg:col-span-2">
            <Input
              {...register('street')}
              placeholder="Nome da rua"
              error={errors.street?.message}
            />
          </FormField>

          <FormField label="Número" error={errors.number}>
            <Input
              {...register('number')}
              placeholder="123"
              error={errors.number?.message}
            />
          </FormField>

          <FormField label="Complemento" error={errors.complement}>
            <Input
              {...register('complement')}
              placeholder="Apto, sala, etc."
              error={errors.complement?.message}
            />
          </FormField>

          <FormField label="Bairro" error={errors.neighborhood}>
            <Input
              {...register('neighborhood')}
              placeholder="Nome do bairro"
              error={errors.neighborhood?.message}
            />
          </FormField>

          <FormField label="Cidade" error={errors.city}>
            <Input
              {...register('city')}
              placeholder="Nome da cidade"
              error={errors.city?.message}
            />
          </FormField>

          <FormField label="Estado" error={errors.state}>
            <Select
              {...register('state')}
              options={[
                { value: '', label: 'Selecione o estado' },
                { value: 'AC', label: 'Acre' },
                { value: 'AL', label: 'Alagoas' },
                { value: 'AP', label: 'Amapá' },
                { value: 'AM', label: 'Amazonas' },
                { value: 'BA', label: 'Bahia' },
                { value: 'CE', label: 'Ceará' },
                { value: 'DF', label: 'Distrito Federal' },
                { value: 'ES', label: 'Espírito Santo' },
                { value: 'GO', label: 'Goiás' },
                { value: 'MA', label: 'Maranhão' },
                { value: 'MT', label: 'Mato Grosso' },
                { value: 'MS', label: 'Mato Grosso do Sul' },
                { value: 'MG', label: 'Minas Gerais' },
                { value: 'PA', label: 'Pará' },
                { value: 'PB', label: 'Paraíba' },
                { value: 'PR', label: 'Paraná' },
                { value: 'PE', label: 'Pernambuco' },
                { value: 'PI', label: 'Piauí' },
                { value: 'RJ', label: 'Rio de Janeiro' },
                { value: 'RN', label: 'Rio Grande do Norte' },
                { value: 'RS', label: 'Rio Grande do Sul' },
                { value: 'RO', label: 'Rondônia' },
                { value: 'RR', label: 'Roraima' },
                { value: 'SC', label: 'Santa Catarina' },
                { value: 'SP', label: 'São Paulo' },
                { value: 'SE', label: 'Sergipe' },
                { value: 'TO', label: 'Tocantins' },
              ]}
              error={errors.state?.message}
            />
          </FormField>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Status" error={errors.status} required>
            <Select
              {...register('status')}
              options={[
                { value: 'Active', label: 'Ativo' },
                { value: 'Inactive', label: 'Inativo' },
              ]}
              error={errors.status?.message}
            />
          </FormField>

          <FormField label="Conecta Plus" error={errors.conectaPlus}>
            <Select
              {...register('conectaPlus', { 
                setValueAs: (value) => value === 'true' 
              })}
              options={[
                { value: 'false', label: 'Não' },
                { value: 'true', label: 'Sim' },
              ]}
              error={errors.conectaPlus?.message}
            />
          </FormField>
        </div>
      </div>

      {children}

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Salvando...' : submitText}
        </button>
      </div>
    </form>
  );
}
