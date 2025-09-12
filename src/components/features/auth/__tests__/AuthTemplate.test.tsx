import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthTemplate } from '../AuthTemplate';

describe('AuthTemplate', () => {
  const defaultProps = {
    subtitle: 'Test subtitle',
    children: <div>Test content</div>,
  };

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<AuthTemplate {...defaultProps} />);

      expect(screen.getByText('Test subtitle')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders logo with correct attributes', () => {
      render(<AuthTemplate {...defaultProps} />);

      const logo = screen.getByAltText('Conéctar');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo-white.png');
      expect(logo).toHaveClass('h-16', 'w-auto');
    });

    it('applies correct layout classes', () => {
      render(<AuthTemplate {...defaultProps} />);

      const container = screen.getByText('Test subtitle').closest('.min-h-screen');
      expect(container).toHaveClass(
        'min-h-screen',
        'bg-conectar-primary',
        'flex',
        'items-center',
        'justify-center',
        'p-4'
      );
    });

    it('renders white card container with correct styling', () => {
      render(<AuthTemplate {...defaultProps} />);

      const card = screen.getByText('Test content').closest('.bg-white');
      expect(card).toHaveClass(
        'bg-white',
        'rounded-2xl',
        'shadow-xl',
        'p-8'
      );
    });
  });

  describe('Success State', () => {
    const successProps = {
      subtitle: 'Success subtitle',
      children: <div>Should not render</div>,
      success: {
        icon: <div>✓</div>,
        title: 'Success Title',
        message: 'Success message text',
      },
    };

    it('renders success state when success prop is provided', () => {
      render(<AuthTemplate {...successProps} />);

      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(screen.getByText('Success Title')).toBeInTheDocument();
      expect(screen.getByText('Success message text')).toBeInTheDocument();
    });

    it('does not render children when success state is active', () => {
      render(<AuthTemplate {...successProps} />);

      expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
    });

    it('renders success icon with correct container styling', () => {
      render(<AuthTemplate {...successProps} />);

      const iconContainer = screen.getByText('✓').parentElement;
      expect(iconContainer).toHaveClass(
        'w-16',
        'h-16',
        'bg-success/10',
        'rounded-full',
        'flex',
        'items-center',
        'justify-center',
        'mx-auto'
      );
    });

    it('renders success title with correct styling', () => {
      render(<AuthTemplate {...successProps} />);

      const title = screen.getByText('Success Title');
      expect(title).toHaveClass(
        'text-xl',
        'font-semibold',
        'text-gray-900',
        'mb-2'
      );
    });

    it('renders success message with correct styling', () => {
      render(<AuthTemplate {...successProps} />);

      const message = screen.getByText('Success message text');
      expect(message).toHaveClass('text-success');
    });

    it('renders success content with correct layout', () => {
      render(<AuthTemplate {...successProps} />);

      const successContainer = screen.getByText('Success Title').closest('.text-center');
      expect(successContainer).toHaveClass('text-center', 'space-y-4');
    });
  });

  describe('Subtitle Styling', () => {
    it('renders subtitle with correct text color class', () => {
      render(<AuthTemplate {...defaultProps} />);

      const subtitle = screen.getByText('Test subtitle');
      expect(subtitle).toHaveClass('text-conectar-100', 'mt-2');
    });

    it('renders different subtitle text correctly', () => {
      const customProps = {
        ...defaultProps,
        subtitle: 'Custom subtitle text',
      };

      render(<AuthTemplate {...customProps} />);

      expect(screen.getByText('Custom subtitle text')).toBeInTheDocument();
      expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
    });
  });

  describe('Children Rendering', () => {
    it('renders complex children content', () => {
      const complexChildren = (
        <div>
          <h1>Child Title</h1>
          <form>
            <input aria-label="test input" />
            <button>Submit</button>
          </form>
        </div>
      );

      render(
        <AuthTemplate subtitle="Test" children={complexChildren} />
      );

      expect(screen.getByText('Child Title')).toBeInTheDocument();
      expect(screen.getByLabelText('test input')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders multiple child elements', () => {
      const multipleChildren = (
        <>
          <div>First child</div>
          <div>Second child</div>
          <div>Third child</div>
        </>
      );

      render(
        <AuthTemplate subtitle="Test" children={multipleChildren} />
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });
  });

  describe('Success State Variations', () => {
    it('handles success state with complex icon', () => {
      const complexIcon = (
        <svg viewBox="0 0 24 24" aria-label="success icon">
          <path d="M9 12l2 2 4-4" />
        </svg>
      );

      const successProps = {
        subtitle: 'Test',
        children: <div>Children</div>,
        success: {
          icon: complexIcon,
          title: 'Complex Icon Success',
          message: 'Success with SVG icon',
        },
      };

      render(<AuthTemplate {...successProps} />);

      expect(screen.getByLabelText('success icon')).toBeInTheDocument();
      expect(screen.getByText('Complex Icon Success')).toBeInTheDocument();
    });

    it('handles success state with empty strings', () => {
      const successProps = {
        subtitle: 'Test',
        children: <div>Children</div>,
        success: {
          icon: <span></span>,
          title: '',
          message: '',
        },
      };

      render(<AuthTemplate {...successProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('');
    });

    it('handles success state with long text content', () => {
      const longText = 'This is a very long success message that should still render correctly and maintain proper styling even with extensive content that might wrap to multiple lines.';
      
      const successProps = {
        subtitle: 'Test',
        children: <div>Children</div>,
        success: {
          icon: <div>✓</div>,
          title: 'Very Long Success Title That Might Wrap',
          message: longText,
        },
      };

      render(<AuthTemplate {...successProps} />);

      expect(screen.getByText('Very Long Success Title That Might Wrap')).toBeInTheDocument();
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure in success state', () => {
      const successProps = {
        subtitle: 'Test',
        children: <div>Children</div>,
        success: {
          icon: <div>✓</div>,
          title: 'Success Title',
          message: 'Success message',
        },
      };

      render(<AuthTemplate {...successProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Success Title');
    });

    it('logo has proper alt text for accessibility', () => {
      render(<AuthTemplate {...defaultProps} />);

      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('alt', 'Conéctar');
    });
  });

  describe('Layout Structure', () => {
    it('maintains proper responsive structure', () => {
      render(<AuthTemplate {...defaultProps} />);

      const wrapper = screen.getByText('Test subtitle').closest('.w-full');
      expect(wrapper).toHaveClass('w-full', 'max-w-md');

      const textCenter = screen.getByText('Test subtitle').closest('.text-center');
      expect(textCenter).toHaveClass('text-center', 'mb-8');
    });

    it('logo container has correct flex classes', () => {
      render(<AuthTemplate {...defaultProps} />);

      const logoContainer = screen.getByAltText('Conéctar').closest('.flex');
      expect(logoContainer).toHaveClass('flex', 'justify-center', 'mb-4');
    });
  });
});
