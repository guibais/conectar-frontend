import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message with proper accessibility attributes', () => {
    const message = 'Test error message';
    render(<ErrorMessage message={message} />);
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveAttribute('aria-live', 'polite');
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('applies default styling classes', () => {
    render(<ErrorMessage message="Test message" />);
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveClass('p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'mb-6');
    
    const messageElement = errorElement.querySelector('p');
    expect(messageElement).toHaveClass('text-sm', 'text-red-600');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-error-class';
    render(<ErrorMessage message="Test message" className={customClass} />);
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveClass(customClass);
  });

  it('applies default className when not provided', () => {
    render(<ErrorMessage message="Test message" />);
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement.className).not.toContain('undefined');
  });

  it('handles empty message gracefully', () => {
    render(<ErrorMessage message="" />);
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toBeInTheDocument();
    
    const messageElement = errorElement.querySelector('p');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement?.textContent).toBe('');
  });

  it('handles special characters in message', () => {
    const specialMessage = 'Error: <script>alert("xss")</script> & special chars';
    render(<ErrorMessage message={specialMessage} />);
    
    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it('renders as a div with paragraph inside', () => {
    render(<ErrorMessage message="Test message" />);
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement.tagName).toBe('DIV');
    
    const messageElement = errorElement.querySelector('p');
    expect(messageElement?.tagName).toBe('P');
  });

  it('maintains consistent styling across different message lengths', () => {
    const shortMessage = 'Error';
    const longMessage = 'This is a very long error message that should still maintain proper styling and accessibility attributes regardless of its length';
    
    const { rerender } = render(<ErrorMessage message={shortMessage} />);
    let errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveClass('p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'mb-6');
    
    rerender(<ErrorMessage message={longMessage} />);
    errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveClass('p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'mb-6');
  });

  it('preserves whitespace in messages', () => {
    const messageWithSpaces = '  Error message with spaces  ';
    render(<ErrorMessage message={messageWithSpaces} />);
    
    expect(screen.getByText('Error message with spaces')).toBeInTheDocument();
  });

  it('handles multiline messages', () => {
    const multilineMessage = 'Line 1\nLine 2\nLine 3';
    render(<ErrorMessage message={multilineMessage} />);
    
    expect(screen.getByText(/Line 1.*Line 2.*Line 3/s)).toBeInTheDocument();
  });
});
