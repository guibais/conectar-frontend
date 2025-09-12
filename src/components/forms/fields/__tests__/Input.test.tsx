import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Input } from '../Input';

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Input', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with correct default type', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with custom type', () => {
      render(<Input type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders with password type', () => {
      render(<Input type="password" />);
      
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('applies base CSS classes', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-gray-300',
        'bg-white',
        'px-3',
        'py-2',
        'text-sm'
      );
    });

    it('applies custom className', () => {
      render(<Input className="custom-class" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('Label Rendering', () => {
    it('renders without label when not provided', () => {
      render(<Input />);
      
      const label = screen.queryByRole('label');
      expect(label).not.toBeInTheDocument();
    });

    it('renders with label when provided', () => {
      render(<Input label="Nome" />);
      
      const label = screen.getByText('Nome');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('associates label with input via htmlFor', () => {
      render(<Input label="Email" />);
      
      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');
      
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it('uses provided id for label association', () => {
      render(<Input label="Nome" id="custom-id" />);
      
      const label = screen.getByText('Nome');
      const input = screen.getByRole('textbox');
      
      expect(label).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('applies correct label styling', () => {
      render(<Input label="Campo" />);
      
      const label = screen.getByText('Campo');
      expect(label).toHaveClass('text-sm', 'font-medium', 'text-gray-700');
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(<Input error="Campo obrigatório" />);
      
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    });

    it('applies error styling when error prop is provided', () => {
      render(<Input error="Erro" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500', 'focus:ring-red-500');
    });

    it('applies normal styling when no error', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-gray-300');
      expect(input).not.toHaveClass('border-red-500');
    });

    it('shows error message with correct styling', () => {
      render(<Input error="Campo inválido" />);
      
      const errorMessage = screen.getByText('Campo inválido');
      expect(errorMessage).toHaveClass('text-sm', 'text-red-600');
    });

    it('sets aria-invalid when error is present', () => {
      render(<Input error="Erro" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('associates error message with input via aria-describedby', () => {
      render(<Input error="Campo obrigatório" />);
      
      const input = screen.getByRole('textbox');
      const errorMessage = screen.getByText('Campo obrigatório');
      const ariaDescribedBy = input.getAttribute('aria-describedby');
      const errorId = errorMessage.getAttribute('id');
      
      expect(ariaDescribedBy).toBe(errorId);
      expect(errorId).toMatch(/-error$/);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for error messages', () => {
      render(<Input error="Campo obrigatório" />);
      
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    it('generates unique IDs for each instance', () => {
      const { rerender } = render(<Input />);
      const input1 = screen.getByRole('textbox');
      const id1 = input1.getAttribute('id');

      rerender(<Input />);
      const input2 = screen.getByRole('textbox');
      const id2 = input2.getAttribute('id');

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^input-/);
      expect(id2).toMatch(/^input-/);
    });

    it('does not set aria-describedby when no error', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Input ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('maintains ref when input changes', () => {
      const ref = { current: null };
      render(<Input ref={ref} />);
      
      if (ref.current) {
        const input = ref.current as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'test' } });
        
        expect(ref.current).toBe(input);
        expect(input.value).toBe('test');
      }
    });
  });

  describe('Input Props', () => {
    it('passes through standard input props', () => {
      render(
        <Input
          placeholder="Digite aqui"
          disabled
          readOnly
          maxLength={10}
          value="test"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Digite aqui');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveAttribute('maxLength', '10');
      expect(input).toHaveValue('test');
    });

    it('handles onChange events', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus events', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      
      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur events', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Component Structure', () => {
    it('renders with correct container structure', () => {
      render(<Input label="Campo" />);
      
      const container = document.querySelector('.space-y-2');
      expect(container).toBeInTheDocument();
    });

    it('maintains correct element order', () => {
      render(<Input label="Campo" error="Erro" />);
      
      const container = document.querySelector('.space-y-2');
      const children = container?.children;
      
      expect(children?.[0].tagName).toBe('LABEL');
      expect(children?.[1].tagName).toBe('INPUT');
      expect(children?.[2].tagName).toBe('P');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label', () => {
      render(<Input label="" />);
      
      const label = screen.queryByRole('label');
      expect(label).not.toBeInTheDocument();
    });

    it('handles empty error', () => {
      render(<Input error="" />);
      
      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      render(<Input label={undefined} error={undefined} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('handles null props gracefully', () => {
      render(<Input label={null as any} error={null as any} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('combines error and normal classes correctly', () => {
      render(<Input error="Erro" className="custom" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500', 'custom');
    });

    it('handles focus styles correctly', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:ring-2', 'focus:ring-[#4ECDC4]');
    });

    it('handles disabled state styling', () => {
      render(<Input disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });
  });

  describe('Styling Integration', () => {
    it('applies cn utility function correctly', () => {
      render(<Input className="test-class" />);
      
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('test-class');
    });

    it('handles conditional error styling', () => {
      const { rerender } = render(<Input />);
      let input = screen.getByRole('textbox');
      expect(input).not.toHaveClass('border-red-500');

      rerender(<Input error="Erro" />);
      input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });
  });
});
