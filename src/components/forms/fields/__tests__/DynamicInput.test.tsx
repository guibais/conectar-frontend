import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { DynamicInput } from '../DynamicInput';

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('DynamicInput', () => {
  const defaultProps = {
    name: 'test-field',
    type: 'text' as const,
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders text input correctly', () => {
      render(<DynamicInput {...defaultProps} type="text" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders email input correctly', () => {
      render(<DynamicInput {...defaultProps} type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password input correctly', () => {
      render(<DynamicInput {...defaultProps} type="password" />);
      
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('renders number input correctly', () => {
      render(<DynamicInput {...defaultProps} type="number" />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders textarea correctly', () => {
      render(<DynamicInput {...defaultProps} type="textarea" />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders select correctly', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];
      
      render(<DynamicInput {...defaultProps} type="select" options={options} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('renders checkbox correctly', () => {
      render(<DynamicInput {...defaultProps} type="checkbox" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('Input Properties', () => {
    it('applies name attribute correctly', () => {
      render(<DynamicInput {...defaultProps} name="custom-name" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'custom-name');
    });

    it('applies value correctly', () => {
      render(<DynamicInput {...defaultProps} value="test value" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test value');
    });

    it('applies placeholder correctly', () => {
      render(<DynamicInput {...defaultProps} placeholder="Enter text" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('applies disabled state correctly', () => {
      render(<DynamicInput {...defaultProps} disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('applies readOnly state correctly', () => {
      render(<DynamicInput {...defaultProps} readOnly />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('applies required state correctly', () => {
      render(<DynamicInput {...defaultProps} required />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });
  });

  describe('Styling and Classes', () => {
    it('applies base CSS classes', () => {
      render(<DynamicInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('w-full');
    });

    it('applies custom className', () => {
      render(<DynamicInput {...defaultProps} className="custom-class" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });


  describe('Password Input', () => {
    it('renders password input correctly', () => {
      render(<DynamicInput {...defaultProps} type="password" />);
      
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Textarea Specific', () => {
    it('applies correct rows for textarea', () => {
      render(<DynamicInput {...defaultProps} type="textarea" rows={5} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('applies default rows when not specified', () => {
      render(<DynamicInput {...defaultProps} type="textarea" />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('renders textarea correctly', () => {
      render(<DynamicInput {...defaultProps} type="textarea" />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders textarea with base classes', () => {
      render(<DynamicInput {...defaultProps} type="textarea" />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('w-full');
    });
  });

  describe('Select Specific', () => {
    const selectOptions = [
      { value: '', label: 'Select option' },
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];

    it('renders all select options', () => {
      render(<DynamicInput {...defaultProps} type="select" options={selectOptions} />);
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Select option');
      expect(options[1]).toHaveTextContent('Option 1');
      expect(options[2]).toHaveTextContent('Option 2');
    });

    it('handles empty options array', () => {
      render(<DynamicInput {...defaultProps} type="select" options={[]} />);
      
      const select = screen.getByRole('combobox');
      const options = screen.queryAllByRole('option');
      
      expect(select).toBeInTheDocument();
      expect(options).toHaveLength(0);
    });

    it('renders select with base classes', () => {
      render(<DynamicInput {...defaultProps} type="select" options={selectOptions} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('w-full');
    });
  });

  describe('Checkbox Specific', () => {
    it('renders checkbox with correct styling', () => {
      render(<DynamicInput {...defaultProps} type="checkbox" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass(
        'h-4',
        'w-4',
        'text-conectar-primary',
        'border-gray-300',
        'rounded'
      );
    });

    it('handles checkbox checked state', () => {
      render(<DynamicInput {...defaultProps} type="checkbox" checked />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('handles checkbox onChange', () => {
      const onChange = vi.fn();
      render(<DynamicInput {...defaultProps} type="checkbox" onChange={onChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('calls onChange for text input', () => {
      const onChange = vi.fn();
      render(<DynamicInput {...defaultProps} onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange for select', () => {
      const onChange = vi.fn();
      const options = [{ value: 'option1', label: 'Option 1' }];
      
      render(<DynamicInput {...defaultProps} type="select" options={options} onChange={onChange} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'option1' } });
      
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange for textarea', () => {
      const onChange = vi.fn();
      render(<DynamicInput {...defaultProps} type="textarea" onChange={onChange} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'new text' } });
      
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onFocus when provided', () => {
      const onFocus = vi.fn();
      render(<DynamicInput {...defaultProps} onFocus={onFocus} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      
      expect(onFocus).toHaveBeenCalled();
    });

    it('calls onBlur when provided', () => {
      const onBlur = vi.fn();
      render(<DynamicInput {...defaultProps} onBlur={onBlur} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      
      expect(onBlur).toHaveBeenCalled();
    });
  });


  describe('Accessibility', () => {
    it('renders input with proper accessibility', () => {
      render(<DynamicInput {...defaultProps} name="test-field" type="text" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders different input types correctly', () => {
      const { rerender } = render(<DynamicInput {...defaultProps} type="email" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();

      rerender(<DynamicInput {...defaultProps} type="password" />);
      expect(document.querySelector('input[type="password"]')).toBeInTheDocument();

      rerender(<DynamicInput {...defaultProps} type="textarea" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();

      rerender(<DynamicInput {...defaultProps} type="select" options={[]} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();

      rerender(<DynamicInput {...defaultProps} type="checkbox" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders password input without toggle functionality', () => {
      render(<DynamicInput {...defaultProps} type="password" />);
      
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined options for select', () => {
      render(<DynamicInput {...defaultProps} type="select" />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('handles empty string values', () => {
      render(<DynamicInput {...defaultProps} value="" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('handles null values gracefully', () => {
      render(<DynamicInput {...defaultProps} value={null as any} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('handles missing onChange gracefully', () => {
      render(<DynamicInput name="test" type="text" value="" />);
      
      const input = screen.getByRole('textbox');
      expect(() => fireEvent.change(input, { target: { value: 'test' } })).not.toThrow();
    });

  });

});
