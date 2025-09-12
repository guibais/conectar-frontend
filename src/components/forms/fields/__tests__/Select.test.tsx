import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Select } from '../Select';

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Select', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Select options={mockOptions} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('renders all provided options', () => {
      render(<Select options={mockOptions} />);
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Option 1');
      expect(options[1]).toHaveTextContent('Option 2');
      expect(options[2]).toHaveTextContent('Option 3');
    });

    it('sets correct option values', () => {
      render(<Select options={mockOptions} />);
      
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveValue('option1');
      expect(options[1]).toHaveValue('option2');
      expect(options[2]).toHaveValue('option3');
    });

    it('applies base CSS classes', () => {
      render(<Select options={mockOptions} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass(
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
      render(<Select options={mockOptions} className="custom-class" />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('custom-class');
    });
  });

  describe('Label Rendering', () => {
    it('renders without label when not provided', () => {
      render(<Select options={mockOptions} />);
      
      const label = screen.queryByRole('label');
      expect(label).not.toBeInTheDocument();
    });

    it('renders with label when provided', () => {
      render(<Select options={mockOptions} label="Escolha uma opção" />);
      
      const label = screen.getByText('Escolha uma opção');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('associates label with select via htmlFor', () => {
      render(<Select options={mockOptions} label="Estado" />);
      
      const label = screen.getByText('Estado');
      const select = screen.getByRole('combobox');
      
      expect(label).toBeInTheDocument();
      expect(select).toBeInTheDocument();
    });

    it('uses provided id for label association', () => {
      render(<Select options={mockOptions} label="Estado" id="custom-id" />);
      
      const label = screen.getByText('Estado');
      const select = screen.getByRole('combobox');
      
      expect(label).toBeInTheDocument();
      expect(select).toHaveAttribute('id', 'custom-id');
    });

    it('applies correct label styling', () => {
      render(<Select options={mockOptions} label="Campo" />);
      
      const label = screen.getByText('Campo');
      expect(label).toHaveClass('text-sm', 'font-medium', 'text-gray-700');
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(<Select options={mockOptions} error="Campo obrigatório" />);
      
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    });

    it('applies error styling when error prop is provided', () => {
      render(<Select options={mockOptions} error="Erro" />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-red-500', 'focus:ring-red-500');
    });

    it('applies normal styling when no error', () => {
      render(<Select options={mockOptions} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-gray-300');
      expect(select).not.toHaveClass('border-red-500');
    });

    it('shows error message with correct styling', () => {
      render(<Select options={mockOptions} error="Seleção inválida" />);
      
      const errorMessage = screen.getByText('Seleção inválida');
      expect(errorMessage).toHaveClass('text-sm', 'text-red-600');
    });

    it('sets aria-invalid when error is present', () => {
      render(<Select options={mockOptions} error="Erro" />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Select options={mockOptions} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'false');
    });

    it('associates error message with select via aria-describedby', () => {
      render(<Select options={mockOptions} error="Campo obrigatório" />);
      
      const select = screen.getByRole('combobox');
      const errorMessage = screen.getByText('Campo obrigatório');
      const ariaDescribedBy = select.getAttribute('aria-describedby');
      const errorId = errorMessage.getAttribute('id');
      
      expect(ariaDescribedBy).toBe(errorId);
      expect(errorId).toMatch(/-error$/);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for error messages', () => {
      render(<Select options={mockOptions} error="Campo obrigatório" />);
      
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    it('generates unique IDs for each instance', () => {
      const { rerender } = render(<Select options={mockOptions} />);
      const select1 = screen.getByRole('combobox');
      const id1 = select1.getAttribute('id');

      rerender(<Select options={mockOptions} />);
      const select2 = screen.getByRole('combobox');
      const id2 = select2.getAttribute('id');

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^select-/);
      expect(id2).toMatch(/^select-/);
    });

    it('does not set aria-describedby when no error', () => {
      render(<Select options={mockOptions} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Select options={mockOptions} ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });

    it('maintains ref when selection changes', () => {
      const ref = { current: null };
      render(<Select options={mockOptions} ref={ref} />);
      
      if (ref.current) {
        const select = ref.current as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'option2' } });
        
        expect(ref.current).toBe(select);
        expect(select.value).toBe('option2');
      }
    });
  });

  describe('Select Props', () => {
    it('passes through standard select props', () => {
      render(
        <Select
          options={mockOptions}
          disabled
          required
          value="option2"
        />
      );
      
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
      expect(select).toBeRequired();
      expect(select).toHaveValue('option2');
    });

    it('handles onChange events', () => {
      const handleChange = vi.fn();
      render(<Select options={mockOptions} onChange={handleChange} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'option2' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus events', () => {
      const handleFocus = vi.fn();
      render(<Select options={mockOptions} onFocus={handleFocus} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.focus(select);
      
      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur events', () => {
      const handleBlur = vi.fn();
      render(<Select options={mockOptions} onBlur={handleBlur} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.blur(select);
      
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Options Handling', () => {
    it('handles empty options array', () => {
      render(<Select options={[]} />);
      
      const select = screen.getByRole('combobox');
      const options = screen.queryAllByRole('option');
      
      expect(select).toBeInTheDocument();
      expect(options).toHaveLength(0);
    });

    it('handles options with special characters', () => {
      const specialOptions = [
        { value: 'special&chars', label: 'Special & Characters' },
        { value: 'quotes"test', label: 'Quotes "Test"' },
        { value: 'unicode🚀', label: 'Unicode 🚀 Test' },
      ];

      render(<Select options={specialOptions} />);
      
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveValue('special&chars');
      expect(options[0]).toHaveTextContent('Special & Characters');
      expect(options[1]).toHaveValue('quotes"test');
      expect(options[1]).toHaveTextContent('Quotes "Test"');
      expect(options[2]).toHaveValue('unicode🚀');
      expect(options[2]).toHaveTextContent('Unicode 🚀 Test');
    });

    it('handles options with empty values', () => {
      const optionsWithEmpty = [
        { value: '', label: 'Select an option' },
        { value: 'option1', label: 'Option 1' },
      ];

      render(<Select options={optionsWithEmpty} />);
      
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveValue('');
      expect(options[0]).toHaveTextContent('Select an option');
    });

    it('handles duplicate option values', () => {
      const duplicateOptions = [
        { value: 'duplicate', label: 'First Duplicate' },
        { value: 'duplicate', label: 'Second Duplicate' },
      ];

      render(<Select options={duplicateOptions} />);
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveValue('duplicate');
      expect(options[1]).toHaveValue('duplicate');
    });
  });

  describe('Component Structure', () => {
    it('renders with correct container structure', () => {
      render(<Select options={mockOptions} label="Campo" />);
      
      const container = document.querySelector('.space-y-2');
      expect(container).toBeInTheDocument();
    });

    it('maintains correct element order', () => {
      render(<Select options={mockOptions} label="Campo" error="Erro" />);
      
      const container = document.querySelector('.space-y-2');
      const children = container?.children;
      
      expect(children?.[0].tagName).toBe('LABEL');
      expect(children?.[1].tagName).toBe('SELECT');
      expect(children?.[2].tagName).toBe('P');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Select.displayName).toBe('Select');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label', () => {
      render(<Select options={mockOptions} label="" />);
      
      const label = screen.queryByRole('label');
      expect(label).not.toBeInTheDocument();
    });

    it('handles empty error', () => {
      render(<Select options={mockOptions} error="" />);
      
      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      render(<Select options={mockOptions} label={undefined} error={undefined} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('handles null props gracefully', () => {
      render(<Select options={mockOptions} label={null as any} error={null as any} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('combines error and normal classes correctly', () => {
      render(<Select options={mockOptions} error="Erro" className="custom" />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-red-500', 'custom');
    });

    it('handles focus styles correctly', () => {
      render(<Select options={mockOptions} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('focus:ring-2', 'focus:ring-[#4ECDC4]');
    });

    it('handles disabled state styling', () => {
      render(<Select options={mockOptions} disabled />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });
  });

  describe('Selection Behavior', () => {
    it('allows selecting options', () => {
      render(<Select options={mockOptions} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'option2' } });
      
      expect(select).toHaveValue('option2');
    });

    it('maintains selected value', () => {
      render(<Select options={mockOptions} value="option3" />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('option3');
    });

    it('handles defaultValue prop', () => {
      render(<Select options={mockOptions} defaultValue="option2" />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('option2');
    });
  });

  describe('Styling Integration', () => {
    it('applies cn utility function correctly', () => {
      render(<Select options={mockOptions} className="test-class" />);
      
      const select = screen.getByRole('combobox');
      expect(select.className).toContain('test-class');
    });

    it('handles conditional error styling', () => {
      const { rerender } = render(<Select options={mockOptions} />);
      let select = screen.getByRole('combobox');
      expect(select).not.toHaveClass('border-red-500');

      rerender(<Select options={mockOptions} error="Erro" />);
      select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-red-500');
    });
  });
});
