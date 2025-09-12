import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { z } from 'zod';
import { DynamicForm, type FormFieldConfig } from '../DynamicForm';

const mockT = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    'common.submit': 'Enviar',
    'common.loading': 'Carregando...',
  };
  return translations[key] || key;
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockT }),
}));

vi.mock('../FormField', () => ({
  FormField: ({ children, label, required, error, className }: any) => (
    <div data-testid="form-field" className={className}>
      <label data-testid="field-label">
        {label}
        {required && <span data-testid="required-indicator">*</span>}
      </label>
      {children}
      {error && <div data-testid="field-error">{error.message}</div>}
    </div>
  ),
}));

vi.mock('../fields/DynamicInput', () => ({
  DynamicInput: ({ type, placeholder, error, ...props }: any) => {
    const Component = type === 'textarea' ? 'textarea' : 'input';
    return (
      <Component
        data-testid={`dynamic-input-${type}`}
        type={type === 'textarea' ? undefined : type}
        placeholder={placeholder}
        {...props}
      />
    );
  },
}));

describe('DynamicForm', () => {
  const mockOnSubmit = vi.fn();
  
  const basicSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
  });

  const basicFields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
        />
      );

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('renders all form fields correctly', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getAllByTestId('form-field')).toHaveLength(2);
      expect(document.querySelector('input[name="name"]')).toBeInTheDocument();
      expect(document.querySelector('input[name="email"]')).toBeInTheDocument();
    });

    it('renders submit button with default label', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Enviar' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('renders submit button with custom label', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
          submitLabel="Salvar"
        />
      );

      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with form data when valid', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Enviar' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('handles async onSubmit function', async () => {
      const asyncOnSubmit = vi.fn().mockResolvedValue(undefined);
      
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={asyncOnSubmit}
        />
      );

      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      const submitButton = screen.getByRole('button', { name: 'Enviar' });

      fireEvent.change(nameInput!, { target: { value: 'João Silva' } });
      fireEvent.change(emailInput!, { target: { value: 'joao@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(asyncOnSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('shows loading text on submit button when isLoading is true', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
          isLoading={true}
        />
      );

      const submitButton = screen.getByRole('button');
      expect(submitButton).toHaveTextContent('Carregando...');
      expect(submitButton).toBeDisabled();
    });

    it('disables form fields when isLoading is true', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
          isLoading={true}
        />
      );

      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      
      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
    });
  });

  describe('Field Configuration', () => {
    it('handles different field types', () => {
      const complexFields: FormFieldConfig[] = [
        { name: 'text', label: 'Text', type: 'text' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'number', label: 'Number', type: 'number' },
        { name: 'textarea', label: 'Textarea', type: 'textarea' },
        { name: 'select', label: 'Select', type: 'select', options: [{ value: 'opt1', label: 'Option 1' }] },
      ];

      const complexSchema = z.object({
        text: z.string(),
        password: z.string(),
        number: z.number(),
        textarea: z.string(),
        select: z.string(),
      });

      render(
        <DynamicForm
          fields={complexFields}
          schema={complexSchema}
          onSubmit={mockOnSubmit}
        />
      );

      expect(document.querySelector('input[name="text"]')).toBeInTheDocument();
      expect(document.querySelector('input[name="password"]')).toBeInTheDocument();
      expect(document.querySelector('input[name="number"]')).toBeInTheDocument();
      expect(document.querySelector('textarea[name="textarea"]')).toBeInTheDocument();
      expect(document.querySelector('select[name="select"]')).toBeInTheDocument();
    });

    it('applies grid column classes correctly', () => {
      const fieldsWithGrid: FormFieldConfig[] = [
        { name: 'field1', label: 'Field 1', type: 'text', gridCols: 1 },
        { name: 'field2', label: 'Field 2', type: 'text', gridCols: 2 },
      ];

      render(
        <DynamicForm
          fields={fieldsWithGrid}
          schema={z.object({ field1: z.string(), field2: z.string() })}
          onSubmit={mockOnSubmit}
        />
      );

      const formFields = screen.getAllByTestId('form-field');
      expect(formFields[0]).toHaveClass('md:col-span-1');
      expect(formFields[1]).toHaveClass('md:col-span-2');
    });

    it('handles field with custom className', () => {
      const fieldsWithClass: FormFieldConfig[] = [
        { name: 'field1', label: 'Field 1', type: 'text', className: 'custom-class' },
      ];

      render(
        <DynamicForm
          fields={fieldsWithClass}
          schema={z.object({ field1: z.string() })}
          onSubmit={mockOnSubmit}
        />
      );

      const formField = screen.getByTestId('form-field');
      expect(formField).toHaveClass('custom-class');
    });

    it('handles disabled fields', () => {
      const fieldsWithDisabled: FormFieldConfig[] = [
        { name: 'field1', label: 'Field 1', type: 'text', disabled: true },
      ];

      render(
        <DynamicForm
          fields={fieldsWithDisabled}
          schema={z.object({ field1: z.string() })}
          onSubmit={mockOnSubmit}
        />
      );

      const input = document.querySelector('input[name="field1"]');
      expect(input).toBeDisabled();
    });
  });

  describe('Field Change Handling', () => {
    it('calls field onChange when provided', () => {
      const mockFieldChange = vi.fn();
      const fieldsWithChange: FormFieldConfig[] = [
        { name: 'field1', label: 'Field 1', type: 'text', onChange: mockFieldChange },
      ];

      render(
        <DynamicForm
          fields={fieldsWithChange}
          schema={z.object({ field1: z.string() })}
          onSubmit={mockOnSubmit}
        />
      );

      const input = document.querySelector('input[name="field1"]');
      fireEvent.change(input!, { target: { value: 'test value' } });

      expect(mockFieldChange).toHaveBeenCalledWith('test value');
    });

    it('handles checkbox field changes correctly', () => {
      const mockFieldChange = vi.fn();
      const fieldsWithCheckbox: FormFieldConfig[] = [
        { name: 'checkbox', label: 'Checkbox', type: 'checkbox', onChange: mockFieldChange },
      ];

      render(
        <DynamicForm
          fields={fieldsWithCheckbox}
          schema={z.object({ checkbox: z.boolean() })}
          onSubmit={mockOnSubmit}
        />
      );

      const checkbox = document.querySelector('input[name="checkbox"]');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });
  });

  describe('Messages and Feedback', () => {
    it('displays success message when provided', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
          successMessage="Formulário enviado com sucesso!"
        />
      );

      const successMessage = screen.getByText('Formulário enviado com sucesso!');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage.closest('div')).toHaveClass('bg-green-50');
    });

    it('displays error message when provided', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
          errorMessage="Erro ao enviar formulário!"
        />
      );

      const errorMessage = screen.getByText('Erro ao enviar formulário!');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.closest('div')).toHaveClass('bg-red-50');
    });
  });

  describe('Layout and Styling', () => {
    it('applies custom className to form', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
          className="custom-form-class"
        />
      );

      const form = document.querySelector('form');
      expect(form).toHaveClass('custom-form-class');
    });

    it('renders children content', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
        >
          <div data-testid="custom-content">Custom Content</div>
        </DynamicForm>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('handles fullWidthSubmit layout', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
          fullWidthSubmit={true}
          formActions={<button data-testid="custom-action">Custom Action</button>}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Enviar' });
      expect(submitButton).toHaveClass('w-full');
      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });

    it('handles regular layout with form actions', () => {
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
          fullWidthSubmit={false}
          formActions={<button data-testid="custom-action">Custom Action</button>}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Enviar' });
      expect(submitButton).not.toHaveClass('w-full');
      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('applies default values to form fields', () => {
      const defaultValues = {
        name: 'João Silva',
        email: 'joao@example.com',
      };

      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
          defaultValues={defaultValues}
        />
      );

      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      
      expect(nameInput).toHaveValue('João Silva');
      expect(emailInput).toHaveValue('joao@example.com');
    });
  });

  describe('Field Properties', () => {
    it('passes all field properties to DynamicInput', () => {
      const complexField: FormFieldConfig[] = [
        {
          name: 'complex',
          label: 'Complex Field',
          type: 'text',
          placeholder: 'Enter text',
          required: true,
          disabled: false,
          readOnly: false,
          min: 1,
          max: 100,
          step: 1,
          accept: '.txt',
          multiple: true,
          loading: true,
          showPasswordToggle: true,
          icon: <span data-testid="field-icon">Icon</span>,
        },
      ];

      render(
        <DynamicForm
          fields={complexField}
          schema={z.object({ complex: z.string() })}
          onSubmit={mockOnSubmit}
        />
      );

      const input = document.querySelector('input[name="complex"]');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
      expect(input).toHaveAttribute('min', '1');
      expect(input).toHaveAttribute('max', '100');
      expect(input).toHaveAttribute('step', '1');
      expect(input).toHaveAttribute('accept', '.txt');
      expect(input).toHaveAttribute('multiple');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty fields array', () => {
      render(
        <DynamicForm
          fields={[]}
          schema={z.object({})}
          onSubmit={mockOnSubmit}
        />
      );

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
    });

    it('handles fields without gridCols property', () => {
      const fieldsWithoutGrid: FormFieldConfig[] = [
        { name: 'field1', label: 'Field 1', type: 'text' },
      ];

      render(
        <DynamicForm
          fields={fieldsWithoutGrid}
          schema={z.object({ field1: z.string() })}
          onSubmit={mockOnSubmit}
        />
      );

      const formField = screen.getByTestId('form-field');
      expect(formField).toHaveClass('md:col-span-2');
    });

    it('handles missing translation keys', () => {
      mockT.mockReturnValue('missing.key');
      
      render(
        <DynamicForm
          fields={basicFields}
          schema={basicSchema}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByRole('button', { name: 'missing.key' })).toBeInTheDocument();
    });
  });
});
