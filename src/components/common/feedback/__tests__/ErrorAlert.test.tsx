import { render, screen } from '@testing-library/react';
import { ErrorAlert } from '../ErrorAlert';

describe('ErrorAlert', () => {
  it('renders error message with proper accessibility attributes', () => {
    const message = 'Test error message';
    render(<ErrorAlert message={message} />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'polite');
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders AlertTriangle icon with proper accessibility attributes', () => {
    render(<ErrorAlert message="Test message" />);
    
    const container = screen.getByRole('alert');
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies default styling classes', () => {
    render(<ErrorAlert message="Test message" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-error-class';
    render(<ErrorAlert message="Test message" className={customClass} />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass(customClass);
  });

  it('applies default className when not provided', () => {
    render(<ErrorAlert message="Test message" />);
    
    const alert = screen.getByRole('alert');
    expect(alert.className).not.toContain('undefined');
  });

  it('renders message text with proper styling', () => {
    const message = 'Error message text';
    render(<ErrorAlert message={message} />);
    
    const messageElement = screen.getByText(message);
    expect(messageElement).toHaveClass('text-sm', 'text-red-600');
  });

  it('renders icon and message in flex container', () => {
    render(<ErrorAlert message="Test message" />);
    
    const alert = screen.getByRole('alert');
    const flexContainer = alert.firstChild;
    expect(flexContainer).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('handles empty message gracefully', () => {
    render(<ErrorAlert message="" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    
    const messageElement = alert.querySelector('p');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement?.textContent).toBe('');
  });

  it('handles special characters in message', () => {
    const specialMessage = 'Error: <script>alert("xss")</script> & special chars';
    render(<ErrorAlert message={specialMessage} />);
    
    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it('maintains proper DOM structure', () => {
    render(<ErrorAlert message="Test message" />);
    
    const alert = screen.getByRole('alert');
    expect(alert.children).toHaveLength(1);
    
    const flexContainer = alert.firstElementChild;
    expect(flexContainer?.children).toHaveLength(2);
  });
});
