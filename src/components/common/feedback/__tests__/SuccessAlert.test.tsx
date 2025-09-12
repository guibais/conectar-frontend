import { render, screen } from '@testing-library/react';
import { SuccessAlert } from '../SuccessAlert';

describe('SuccessAlert', () => {
  it('renders success message with proper accessibility attributes', () => {
    const message = 'Test success message';
    render(<SuccessAlert message={message} />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'polite');
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders CheckCircle icon with proper accessibility attributes', () => {
    render(<SuccessAlert message="Test message" />);
    
    const container = screen.getByRole('alert');
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies default styling classes', () => {
    render(<SuccessAlert message="Test message" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('p-4', 'bg-green-50', 'border', 'border-green-200', 'rounded-lg');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-success-class';
    render(<SuccessAlert message="Test message" className={customClass} />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass(customClass);
  });

  it('applies default className when not provided', () => {
    render(<SuccessAlert message="Test message" />);
    
    const alert = screen.getByRole('alert');
    expect(alert.className).not.toContain('undefined');
  });

  it('renders message text with proper styling', () => {
    const message = 'Success message text';
    render(<SuccessAlert message={message} />);
    
    const messageElement = screen.getByText(message);
    expect(messageElement).toHaveClass('text-sm', 'text-green-600');
  });

  it('renders icon and message in flex container', () => {
    render(<SuccessAlert message="Test message" />);
    
    const alert = screen.getByRole('alert');
    const flexContainer = alert.firstChild;
    expect(flexContainer).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('renders icon with proper styling', () => {
    render(<SuccessAlert message="Test message" />);
    
    const container = screen.getByRole('alert');
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('h-4', 'w-4', 'text-green-600');
  });

  it('handles empty message gracefully', () => {
    render(<SuccessAlert message="" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    
    const messageElement = alert.querySelector('p');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement?.textContent).toBe('');
  });

  it('handles special characters in message', () => {
    const specialMessage = 'Success: <script>alert("xss")</script> & special chars';
    render(<SuccessAlert message={specialMessage} />);
    
    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it('maintains proper DOM structure', () => {
    render(<SuccessAlert message="Test message" />);
    
    const alert = screen.getByRole('alert');
    expect(alert.children).toHaveLength(1);
    
    const flexContainer = alert.firstElementChild;
    expect(flexContainer?.children).toHaveLength(2);
  });

  it('maintains consistent styling across different message lengths', () => {
    const shortMessage = 'Success';
    const longMessage = 'This is a very long success message that should still maintain proper styling and accessibility attributes regardless of its length';
    
    const { rerender } = render(<SuccessAlert message={shortMessage} />);
    let alert = screen.getByRole('alert');
    expect(alert).toHaveClass('p-4', 'bg-green-50', 'border', 'border-green-200', 'rounded-lg');
    
    rerender(<SuccessAlert message={longMessage} />);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('p-4', 'bg-green-50', 'border', 'border-green-200', 'rounded-lg');
  });

  it('preserves whitespace in messages', () => {
    const messageWithSpaces = '  Success message with spaces  ';
    render(<SuccessAlert message={messageWithSpaces} />);
    
    expect(screen.getByText('Success message with spaces')).toBeInTheDocument();
  });

  it('handles multiline messages', () => {
    const multilineMessage = 'Line 1\nLine 2\nLine 3';
    render(<SuccessAlert message={multilineMessage} />);
    
    expect(screen.getByText(/Line 1.*Line 2.*Line 3/s)).toBeInTheDocument();
  });

  it('combines custom className with default classes', () => {
    const customClass = 'shadow-lg';
    render(<SuccessAlert message="Test message" className={customClass} />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('p-4', 'bg-green-50', 'border', 'border-green-200', 'rounded-lg', customClass);
  });
});
