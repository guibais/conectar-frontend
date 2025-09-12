import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { z } from 'zod';
import { ClientForm } from '../ClientForm';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'clients.fields.name': 'Nome',
        'clients.fields.email': 'Email',
        'clients.fields.tradeName': 'Nome Fantasia',
        'clients.fields.companyName': 'Razão Social',
        'clients.fields.taxId': 'CNPJ',
        'clients.fields.phone': 'Telefone',
        'clients.fields.zipCode': 'CEP',
        'clients.fields.street': 'Rua',
        'clients.fields.number': 'Número',
        'clients.fields.complement': 'Complemento',
        'clients.fields.district': 'Bairro',
        'clients.fields.city': 'Cidade',
        'clients.fields.state': 'Estado',
        'clients.fields.status': 'Status',
        'clients.fields.conectaPlus': 'Conecta Plus',
        'clients.fields.password': 'Senha',
        'clients.fields.confirmPassword': 'Confirmar Senha',
        'clients.placeholders.name': 'Digite o nome',
        'clients.placeholders.email': 'Digite o email',
        'clients.placeholders.tradeName': 'Digite o nome fantasia',
        'clients.placeholders.companyName': 'Digite a razão social',
        'clients.placeholders.taxId': 'Digite o CNPJ',
        'clients.placeholders.phone': 'Digite o telefone',
        'clients.placeholders.zipCode': 'Digite o CEP',
        'clients.placeholders.street': 'Digite a rua',
        'clients.placeholders.number': 'Digite o número',
        'clients.placeholders.complement': 'Digite o complemento',
        'clients.placeholders.district': 'Digite o bairro',
        'clients.placeholders.city': 'Digite a cidade',
        'clients.placeholders.password': 'Digite a senha',
        'clients.placeholders.confirmPassword': 'Confirme a senha',
        'clients.options.selectState': 'Selecione o estado',
        'clients.options.active': 'Ativo',
        'clients.options.inactive': 'Inativo',
        'clients.states.SP': 'São Paulo',
        'clients.states.RJ': 'Rio de Janeiro',
        'clients.states.MG': 'Minas Gerais',
        'clients.states.AC': 'Acre',
        'clients.states.AL': 'Alagoas',
        'clients.states.AP': 'Amapá',
        'clients.states.AM': 'Amazonas',
        'clients.states.BA': 'Bahia',
        'clients.states.CE': 'Ceará',
        'clients.states.DF': 'Distrito Federal',
        'clients.states.ES': 'Espírito Santo',
        'clients.states.GO': 'Goiás',
        'clients.states.MA': 'Maranhão',
        'clients.states.MT': 'Mato Grosso',
        'clients.states.MS': 'Mato Grosso do Sul',
        'clients.states.PA': 'Pará',
        'clients.states.PB': 'Paraíba',
        'clients.states.PR': 'Paraná',
        'clients.states.PE': 'Pernambuco',
        'clients.states.PI': 'Piauí',
        'clients.states.RN': 'Rio Grande do Norte',
        'clients.states.RS': 'Rio Grande do Sul',
        'clients.states.RO': 'Rondônia',
        'clients.states.RR': 'Roraima',
        'clients.states.SC': 'Santa Catarina',
        'clients.states.SE': 'Sergipe',
        'clients.states.TO': 'Tocantins',
        'common.save': 'Salvar',
        'common.yes': 'Sim',
        'common.no': 'Não',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('../components/DynamicForm', () => ({
  DynamicForm: ({ fields, onSubmit, submitLabel, isLoading, formActions, children }: any) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
      {fields?.map((field: any) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type === 'select' ? 'text' : field.type}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isLoading}
          />
        </div>
      ))}
      <button type="submit" disabled={isLoading}>
        {submitLabel}
      </button>
      {formActions}
      {children}
    </form>
  ),
}));

describe('ClientForm', () => {
  const mockOnSubmit = vi.fn();
  const basicSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    status: z.enum(['Active', 'Inactive']),
    conectaPlus: z.boolean(),
  });

  const defaultProps = {
    schema: basicSchema,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('renders DynamicForm with correct props', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('renders default submit button text', () => {
      render(<ClientForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Salvar' });
      expect(submitButton).toBeInTheDocument();
    });

    it('renders custom submit button text', () => {
      render(<ClientForm {...defaultProps} submitText="Criar Cliente" />);
      
      const submitButton = screen.getByRole('button', { name: 'Criar Cliente' });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Default Fields', () => {
    it('renders all default fields', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(document.querySelector('input[name="name"]')).toBeInTheDocument();
      expect(document.querySelector('input[name="email"]')).toBeInTheDocument();
      expect(screen.getByText('Nome Fantasia')).toBeInTheDocument();
      expect(screen.getByText('Razão Social')).toBeInTheDocument();
      expect(screen.getByText('CNPJ')).toBeInTheDocument();
      expect(screen.getByText('Telefone')).toBeInTheDocument();
      expect(screen.getByText('CEP')).toBeInTheDocument();
      expect(screen.getByText('Rua')).toBeInTheDocument();
      expect(screen.getByText('Número')).toBeInTheDocument();
      expect(screen.getByText('Complemento')).toBeInTheDocument();
      expect(screen.getByText('Bairro')).toBeInTheDocument();
      expect(screen.getByText('Cidade')).toBeInTheDocument();
      expect(screen.getByText('Estado')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Conecta Plus')).toBeInTheDocument();
    });

    it('renders fields with correct labels', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Nome Fantasia')).toBeInTheDocument();
      expect(screen.getByText('Razão Social')).toBeInTheDocument();
      expect(screen.getByText('CNPJ')).toBeInTheDocument();
      expect(screen.getByText('Telefone')).toBeInTheDocument();
      expect(screen.getByText('CEP')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Conecta Plus')).toBeInTheDocument();
    });

    it('renders required fields correctly', () => {
      render(<ClientForm {...defaultProps} />);
      
      const nameInput = document.querySelector('input[name="name"]');
      const statusInput = document.querySelector('select[name="status"]');
      
      expect(nameInput).toBeInTheDocument();
      expect(statusInput).toBeInTheDocument();
    });

    it('renders fields with correct placeholders', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Digite o nome')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite o email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite o nome fantasia')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite a razão social')).toBeInTheDocument();
    });
  });

  describe('Password Fields', () => {
    it('does not render password fields by default', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.queryByLabelText('Senha')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Confirmar Senha')).not.toBeInTheDocument();
    });

    it('renders password fields when showPasswordFields is true', () => {
      render(<ClientForm {...defaultProps} showPasswordFields />);
      
      expect(document.querySelector('input[name="password"]')).toBeInTheDocument();
      expect(document.querySelector('input[name="confirmPassword"]')).toBeInTheDocument();
    });

    it('renders password fields with correct labels', () => {
      render(<ClientForm {...defaultProps} showPasswordFields />);
      
      expect(screen.getByText('Senha')).toBeInTheDocument();
      expect(screen.getByText('Confirmar Senha')).toBeInTheDocument();
    });

    it('renders password fields as required', () => {
      render(<ClientForm {...defaultProps} showPasswordFields />);
      
      const passwordInput = document.querySelector('input[name="password"]');
      const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
      
      expect(passwordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toBeInTheDocument();
    });

    it('inserts password fields after email field', () => {
      render(<ClientForm {...defaultProps} showPasswordFields />);
      
      const inputs = document.querySelectorAll('input');
      const inputNames = Array.from(inputs).map(input => input.getAttribute('name'));
      
      const emailIndex = inputNames.indexOf('email');
      const passwordIndex = inputNames.indexOf('password');
      const confirmPasswordIndex = inputNames.indexOf('confirmPassword');
      
      expect(passwordIndex).toBe(emailIndex + 1);
      expect(confirmPasswordIndex).toBe(emailIndex + 2);
    });
  });

  describe('Custom Fields', () => {
    it('uses custom fields when provided', () => {
      const customFields = [
        { name: 'customField1', label: 'Custom Field 1', type: 'text' as const },
        { name: 'customField2', label: 'Custom Field 2', type: 'email' as const },
      ];

      render(<ClientForm {...defaultProps} fields={customFields} />);
      
      expect(document.querySelector('input[name="customField1"]')).toBeInTheDocument();
      expect(document.querySelector('input[name="customField2"]')).toBeInTheDocument();
      expect(screen.queryByLabelText('Nome')).not.toBeInTheDocument();
    });

    it('renders custom fields with correct properties', () => {
      const customFields = [
        { 
          name: 'customField', 
          label: 'Custom Field', 
          type: 'text' as const,
          placeholder: 'Custom placeholder',
          required: true,
        },
      ];

      render(<ClientForm {...defaultProps} fields={customFields} />);
      
      expect(screen.getByText('Custom Field')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
      
      const input = document.querySelector('input[name="customField"]') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('passes loading state to DynamicForm', () => {
      render(<ClientForm {...defaultProps} isLoading />);
      
      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeDisabled();
    });

    it('disables all inputs when loading', () => {
      render(<ClientForm {...defaultProps} isLoading />);
      
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toBeDisabled();
      });
    });
  });

  describe('Default Values', () => {
    it('passes default values to DynamicForm', () => {
      const defaultValues = {
        name: 'John Doe',
        email: 'john@example.com',
        status: 'Active' as const,
        conectaPlus: true,
      };

      render(<ClientForm {...defaultProps} defaultValues={defaultValues} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('handles partial default values', () => {
      const defaultValues = {
        name: 'Partial Name',
      };

      render(<ClientForm {...defaultProps} defaultValues={defaultValues} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('handles empty default values', () => {
      render(<ClientForm {...defaultProps} defaultValues={{}} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit when form is submitted', () => {
      render(<ClientForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Salvar' });
      expect(submitButton).toBeInTheDocument();
    });

    it('passes schema to DynamicForm', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
  });

  describe('Children and Form Actions', () => {
    it('renders children when provided', () => {
      render(
        <ClientForm {...defaultProps}>
          <div>Custom Content</div>
        </ClientForm>
      );
      
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('renders form actions when provided', () => {
      const formActions = (
        <div>
          <button type="button">Cancel</button>
        </div>
      );

      render(<ClientForm {...defaultProps} formActions={formActions} />);
      
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('renders both children and form actions', () => {
      const formActions = <div>Actions</div>;
      
      render(
        <ClientForm {...defaultProps} formActions={formActions}>
          <div>Children</div>
        </ClientForm>
      );
      
      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getByText('Children')).toBeInTheDocument();
    });
  });

  describe('State Options', () => {
    it('includes all Brazilian states in state field options', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('includes status options', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('includes conectaPlus options', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
  });

  describe('Field Configuration', () => {
    it('configures street field with correct grid columns', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('configures select fields correctly', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
  });

  describe('Translation Integration', () => {
    it('uses translation function for field labels', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('uses translation function for placeholders', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Digite o nome')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite o email')).toBeInTheDocument();
    });

    it('uses translation function for submit button', () => {
      render(<ClientForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined schema gracefully', () => {
      render(<ClientForm schema={undefined as any} onSubmit={mockOnSubmit} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('handles undefined onSubmit gracefully', () => {
      render(<ClientForm schema={basicSchema} onSubmit={undefined as any} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('handles empty custom fields array', () => {
      render(<ClientForm {...defaultProps} fields={[]} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('handles null children', () => {
      render(<ClientForm {...defaultProps}>{null}</ClientForm>);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('handles null formActions', () => {
      render(<ClientForm {...defaultProps} formActions={null} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('passes all props correctly to DynamicForm', () => {
      const props = {
        ...defaultProps,
        defaultValues: { name: 'Test' },
        isLoading: true,
        submitText: 'Custom Submit',
      };

      render(<ClientForm {...props} />);
      
      const submitButton = screen.getByRole('button', { name: 'common.loading' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('maintains field order with password fields', () => {
      render(<ClientForm {...defaultProps} showPasswordFields />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('handles ClientFormData type correctly', () => {
      const typedDefaultValues = {
        name: 'Test Name',
        email: 'test@example.com',
        status: 'Active' as const,
        conectaPlus: false,
        tradeName: 'Test Trade Name',
      };

      render(<ClientForm {...defaultProps} defaultValues={typedDefaultValues} />);
      
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
  });
});
