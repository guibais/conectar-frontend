import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    expect(spinner).toHaveAttribute('aria-label', 'Carregando...');
  });

  it('applies default size (md) styling', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('applies small size styling when size="sm"', () => {
    render(<LoadingSpinner size="sm" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('applies large size styling when size="lg"', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-32', 'w-32');
  });

  it('applies default styling classes', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'border-b-2',
      'border-white'
    );
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-spinner-class';
    render(<LoadingSpinner className={customClass} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(customClass);
  });

  it('applies default className when not provided', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner.className).not.toContain('undefined');
  });

  it('uses custom label when provided', () => {
    const customLabel = 'Loading data...';
    render(<LoadingSpinner label={customLabel} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', customLabel);
  });

  it('uses default label when not provided', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Carregando...');
  });

  it('renders as a div element', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner.tagName).toBe('DIV');
  });

  it('combines all size and custom classes correctly', () => {
    const customClass = 'border-blue-500';
    render(<LoadingSpinner size="sm" className={customClass} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-4', 'w-4', customClass);
  });

  it('handles empty custom className gracefully', () => {
    render(<LoadingSpinner className="" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner.className).not.toContain('undefined');
  });

  it('maintains accessibility with custom label and size', () => {
    const customLabel = 'Processing request...';
    render(<LoadingSpinner size="lg" label={customLabel} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', customLabel);
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    expect(spinner).toHaveClass('h-32', 'w-32');
  });

  it('handles special characters in label', () => {
    const specialLabel = 'Loading... <>&"\'';
    render(<LoadingSpinner label={specialLabel} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', specialLabel);
  });
});
