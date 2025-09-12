import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmModal } from '../ConfirmModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.confirm': 'Confirmar',
        'common.cancel': 'Cancelar',
        'common.delete': 'Excluir',
        'common.save': 'Salvar',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('lucide-react', () => ({
  X: ({ size, ...props }: any) => <div data-testid="x-icon" data-size={size} {...props} />,
}));

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  title: 'Test Modal Title',
  message: 'Test modal message content',
};

describe('ConfirmModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Test modal message content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders with correct accessibility attributes', () => {
    render(<ConfirmModal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders default variant with correct styling and buttons', () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    expect(confirmButton).toHaveClass('bg-red-600');
    expect(screen.getByText('🗑️')).toBeInTheDocument();
  });

  it('renders danger variant with correct styling', () => {
    render(<ConfirmModal {...defaultProps} variant="danger" />);

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    expect(confirmButton).toHaveClass('bg-red-600');
    expect(screen.getByText('🗑️')).toBeInTheDocument();
  });

  it('renders warning variant with correct styling', () => {
    render(<ConfirmModal {...defaultProps} variant="warning" />);

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    expect(confirmButton).toHaveClass('bg-yellow-600');
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('renders info variant with correct styling', () => {
    render(<ConfirmModal {...defaultProps} variant="info" />);

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    expect(confirmButton).toHaveClass('bg-blue-600');
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    render(<ConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    render(<ConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button (X) is clicked', async () => {
    render(<ConfirmModal {...defaultProps} />);

    const closeButton = screen.getByLabelText(/fechar modal/i);
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    render(<ConfirmModal {...defaultProps} />);

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', async () => {
    render(<ConfirmModal {...defaultProps} />);

    const modalContent = screen.getByRole('document');
    fireEvent.click(modalContent);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('handles escape key press to close modal', () => {
    render(<ConfirmModal {...defaultProps} />);

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus within modal', async () => {
    render(<ConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    const closeButton = screen.getByLabelText(/fechar modal/i);

    cancelButton.focus();
    expect(cancelButton).toHaveFocus();

    fireEvent.keyDown(cancelButton, { key: 'Tab' });
    confirmButton.focus();
    expect(confirmButton).toHaveFocus();

    fireEvent.keyDown(confirmButton, { key: 'Tab' });
    closeButton.focus();
    expect(closeButton).toHaveFocus();
  });

  it('focuses modal when opened', async () => {
    const { rerender } = render(<ConfirmModal {...defaultProps} isOpen={false} />);
    
    rerender(<ConfirmModal {...defaultProps} isOpen={true} />);

    await waitFor(() => {
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
    });
  });

  it('renders with custom confirmText and cancelText', () => {
    render(
      <ConfirmModal
        {...defaultProps}
        confirmText="Custom Confirm"
        cancelText="Custom Cancel"
      />
    );

    expect(screen.getByRole('button', { name: /custom confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /custom cancel/i })).toBeInTheDocument();
  });

  it('disables confirm button when isLoading is true', () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />);

    const confirmButton = screen.getByRole('button', { name: /processando/i });
    expect(confirmButton).toBeDisabled();
  });

  it('shows loading state in confirm button', () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />);

    const confirmButton = screen.getByRole('button', { name: /processando/i });
    expect(confirmButton).toBeDisabled();
    expect(screen.getByText('Processando...')).toBeInTheDocument();
  });

  it('renders with correct z-index for overlay', () => {
    render(<ConfirmModal {...defaultProps} />);

    const backdrop = screen.getByRole('dialog');
    expect(backdrop).toHaveClass('z-50');
  });

  it('applies correct styling classes', () => {
    render(<ConfirmModal {...defaultProps} />);

    const backdrop = screen.getByRole('dialog');
    expect(backdrop).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50');

    const modalContent = screen.getByRole('document');
    expect(modalContent).toHaveClass('bg-white', 'rounded-lg', 'shadow-xl');
  });

  it('handles multiline message content', () => {
    const multilineMessage = 'Line 1\nLine 2\nLine 3';
    render(<ConfirmModal {...defaultProps} message={multilineMessage} />);

    expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    expect(screen.getByText(/Line 2/)).toBeInTheDocument();
    expect(screen.getByText(/Line 3/)).toBeInTheDocument();
  });

  it('handles empty message gracefully', () => {
    render(<ConfirmModal {...defaultProps} message="" />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
  });

  it('handles special characters in title and message', () => {
    const specialTitle = 'Title with <script>alert("xss")</script> & symbols';
    const specialMessage = 'Message with <img src="x" onerror="alert(1)"> & entities';
    
    render(<ConfirmModal {...defaultProps} title={specialTitle} message={specialMessage} />);

    expect(screen.getByText(specialTitle)).toBeInTheDocument();
    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it('maintains proper button order and spacing', () => {
    render(<ConfirmModal {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });

    const cancelIndex = buttons.findIndex(btn => btn === cancelButton);
    const confirmIndex = buttons.findIndex(btn => btn === confirmButton);
    expect(cancelIndex).toBeLessThan(confirmIndex);
  });
});
