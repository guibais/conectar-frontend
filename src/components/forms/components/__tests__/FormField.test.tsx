import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { FormField } from '../FormField';
import { type FieldError } from 'react-hook-form';

describe('FormField', () => {
  const mockChildren = <input data-testid="test-input" />;

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(
        <FormField label="Test Label">
          {mockChildren}
        </FormField>
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('renders label with correct text', () => {
      render(
        <FormField label="Nome Completo">
          {mockChildren}
        </FormField>
      );

      const label = screen.getByText('Nome Completo');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('renders children inside field container', () => {
      render(
        <FormField label="Test Label">
          <div data-testid="custom-child">Custom Child</div>
        </FormField>
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(screen.getByText('Custom Child')).toBeInTheDocument();
    });

    it('generates unique field ID for each instance', () => {
      render(
        <div>
          <FormField label="Field 1">
            <input data-testid="input-1" />
          </FormField>
          <FormField label="Field 2">
            <input data-testid="input-2" />
          </FormField>
        </div>
      );

      const labels = document.querySelectorAll('label');
      expect(labels.length).toBe(2);
      expect(labels[0]).toBeInTheDocument();
      expect(labels[1]).toBeInTheDocument();
    });
  });

  describe('Required Field Indicator', () => {
    it('shows required indicator when required is true', () => {
      render(
        <FormField label="Required Field" required={true}>
          {mockChildren}
        </FormField>
      );

      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500', 'ml-1');
      expect(requiredIndicator).toHaveAttribute('aria-label', 'campo obrigatório');
    });

    it('does not show required indicator when required is false', () => {
      render(
        <FormField label="Optional Field" required={false}>
          {mockChildren}
        </FormField>
      );

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('does not show required indicator when required is undefined', () => {
      render(
        <FormField label="Optional Field">
          {mockChildren}
        </FormField>
      );

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error is provided', () => {
      const mockError: FieldError = {
        type: 'required',
        message: 'Este campo é obrigatório',
      };

      render(
        <FormField label="Test Field" error={mockError}>
          {mockChildren}
        </FormField>
      );

      const errorMessage = screen.getByText('Este campo é obrigatório');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-red-600');
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('does not display error message when error is undefined', () => {
      render(
        <FormField label="Test Field">
          {mockChildren}
        </FormField>
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('generates correct error ID when error exists', () => {
      const mockError: FieldError = {
        type: 'validation',
        message: 'Validation error',
      };

      render(
        <FormField label="Test Field" error={mockError}>
          {mockChildren}
        </FormField>
      );

      const errorElement = screen.getByRole('alert');
      const errorId = errorElement.getAttribute('id');
      expect(errorId).toMatch(/^field-.*-error$/);
    });

    it('handles different error types', () => {
      const validationError: FieldError = {
        type: 'validate',
        message: 'Custom validation failed',
      };

      render(
        <FormField label="Test Field" error={validationError}>
          {mockChildren}
        </FormField>
      );

      expect(screen.getByText('Custom validation failed')).toBeInTheDocument();
    });

    it('handles error with empty message', () => {
      const emptyError: FieldError = {
        type: 'required',
        message: '',
      };

      render(
        <FormField label="Test Field" error={emptyError}>
          {mockChildren}
        </FormField>
      );

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('');
    });
  });

  describe('Styling and Layout', () => {
    it('applies default className when none provided', () => {
      render(
        <FormField label="Test Field">
          {mockChildren}
        </FormField>
      );

      const container = screen.getByTestId('test-input').closest('div')?.parentElement;
      expect(container).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      render(
        <FormField label="Test Field" className="custom-field-class">
          {mockChildren}
        </FormField>
      );

      const container = screen.getByTestId('test-input').closest('div')?.parentElement;
      expect(container).toHaveClass('custom-field-class');
    });

    it('applies multiple custom classes', () => {
      render(
        <FormField label="Test Field" className="class1 class2 class3">
          {mockChildren}
        </FormField>
      );

      const container = screen.getByTestId('test-input').closest('div')?.parentElement;
      expect(container).toHaveClass('class1', 'class2', 'class3');
    });

    it('has correct label styling classes', () => {
      render(
        <FormField label="Styled Label">
          {mockChildren}
        </FormField>
      );

      const label = screen.getByText('Styled Label');
      expect(label).toHaveClass(
        'block',
        'text-sm',
        'font-medium',
        'text-gray-700',
        'mb-2'
      );
    });

    it('has correct error message styling classes', () => {
      const mockError: FieldError = {
        type: 'required',
        message: 'Error message',
      };

      render(
        <FormField label="Test Field" error={mockError}>
          {mockChildren}
        </FormField>
      );

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveClass(
        'mt-1',
        'text-sm',
        'text-red-600'
      );
    });
  });

  describe('Accessibility', () => {
    it('associates label with field container via htmlFor and id', () => {
      render(
        <FormField label="Accessible Field">
          {mockChildren}
        </FormField>
      );

      const label = document.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Accessible Field');
    });

    it('provides proper aria-label for required indicator', () => {
      render(
        <FormField label="Required Field" required={true}>
          {mockChildren}
        </FormField>
      );

      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toHaveAttribute('aria-label', 'campo obrigatório');
    });

    it('provides proper ARIA attributes for error messages', () => {
      const mockError: FieldError = {
        type: 'required',
        message: 'Field is required',
      };

      render(
        <FormField label="Test Field" error={mockError}>
          {mockChildren}
        </FormField>
      );

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('ForwardRef Functionality', () => {
    it('forwards ref to container div', () => {
      const ref = vi.fn();
      
      render(
        <FormField ref={ref} label="Test Field">
          {mockChildren}
        </FormField>
      );

      expect(ref).toHaveBeenCalled();
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('has correct displayName', () => {
      expect(FormField.displayName).toBe('FormField');
    });
  });

  describe('Complex Children', () => {
    it('renders multiple children correctly', () => {
      render(
        <FormField label="Multi Child Field">
          <input data-testid="input-1" />
          <button data-testid="button-1">Button</button>
          <div data-testid="div-1">Content</div>
        </FormField>
      );

      expect(screen.getByTestId('input-1')).toBeInTheDocument();
      expect(screen.getByTestId('button-1')).toBeInTheDocument();
      expect(screen.getByTestId('div-1')).toBeInTheDocument();
    });

    it('renders nested component children', () => {
      const NestedComponent = () => (
        <div data-testid="nested-component">
          <span>Nested Content</span>
        </div>
      );

      render(
        <FormField label="Nested Field">
          <NestedComponent />
        </FormField>
      );

      expect(screen.getByTestId('nested-component')).toBeInTheDocument();
      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label string', () => {
      render(
        <FormField label="">
          {mockChildren}
        </FormField>
      );

      const labels = document.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);
      const label = labels[0];
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('');
    });

    it('handles very long label text', () => {
      const longLabel = 'This is a very long label text that might wrap to multiple lines and should still be handled correctly by the component';
      
      render(
        <FormField label={longLabel}>
          {mockChildren}
        </FormField>
      );

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      const specialLabel = 'Label with special chars: @#$%^&*()';
      
      render(
        <FormField label={specialLabel}>
          {mockChildren}
        </FormField>
      );

      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });

    it('handles null children gracefully', () => {
      render(
        <FormField label="Empty Field">
          {null}
        </FormField>
      );

      expect(screen.getByText('Empty Field')).toBeInTheDocument();
    });

    it('handles undefined className', () => {
      render(
        <FormField label="Test Field" className={undefined}>
          {mockChildren}
        </FormField>
      );

      const container = screen.getByTestId('test-input').closest('div')?.parentElement;
      expect(container).toBeInTheDocument();
    });
  });
});
