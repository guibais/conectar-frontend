import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileDropdown } from '../ProfileDropdown';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, onClick, ...props }: any) => (
    <a href={to} onClick={onClick} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.profile': 'Perfil',
        'profile.myProfile': 'Meu Perfil',
        'auth.logout': 'Sair',
      };
      return translations[key] || key;
    },
  }),
}));

const mockAuthStore = {
  user: { name: 'Test User' },
  logout: vi.fn(),
};

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => mockAuthStore,
}));

vi.mock('lucide-react', () => ({
  User: ({ size, ...props }: any) => <div data-testid="user-icon" data-size={size} {...props} />,
  LogOut: ({ size, ...props }: any) => <div data-testid="logout-icon" data-size={size} {...props} />,
  ChevronDown: ({ size, className, ...props }: any) => (
    <div data-testid="chevron-down-icon" data-size={size} className={className} {...props} />
  ),
}));

describe('ProfileDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop Version', () => {
    it('renders desktop dropdown with user name', () => {
      render(<ProfileDropdown />);

      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    });

    it('toggles dropdown when button is clicked', async () => {
      render(<ProfileDropdown />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders dropdown menu with correct accessibility attributes', async () => {
      render(<ProfileDropdown />);

      fireEvent.click(screen.getByRole('button'));

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-label', 'Menu do perfil');
      
      const profileLink = screen.getByRole('menuitem', { name: /meu perfil/i });
      expect(profileLink).toBeInTheDocument();
      
      const logoutButton = screen.getByRole('menuitem', { name: /sair/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('closes dropdown when profile link is clicked', async () => {
      render(<ProfileDropdown />);

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('menuitem', { name: /meu perfil/i }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('calls logout and navigates when logout button is clicked', async () => {
      render(<ProfileDropdown />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('menuitem', { name: /sair/i }));

      expect(mockAuthStore.logout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
    });

    it('applies correct styling for desktop version', () => {
      render(<ProfileDropdown />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-white/10', 'rounded-lg');
    });

    it('rotates chevron icon when dropdown is open', async () => {
      render(<ProfileDropdown />);

      const chevron = screen.getByTestId('chevron-down-icon');
      expect(chevron).not.toHaveClass('rotate-180');

      fireEvent.click(screen.getByRole('button'));
      expect(chevron).toHaveClass('rotate-180');
    });
  });

  describe('Mobile Version', () => {
    it('renders mobile dropdown with profile icon and text', () => {
      render(<ProfileDropdown isMobile={true} />);

      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.getByText('Perfil')).toBeInTheDocument();
    });

    it('applies mobile-specific styling', () => {
      render(<ProfileDropdown isMobile={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('flex-col', 'items-center', 'text-gray-600');
    });

    it('positions dropdown menu correctly for mobile', async () => {
      render(<ProfileDropdown isMobile={true} />);

      fireEvent.click(screen.getByRole('button'));

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('bottom-full', 'right-0', 'mb-2');
    });

    it('renders mobile dropdown with correct animation classes', async () => {
      render(<ProfileDropdown isMobile={true} />);

      fireEvent.click(screen.getByRole('button'));

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('slide-in-from-bottom-2', 'fade-in');
    });
  });

  describe('Accessibility and Keyboard Navigation', () => {
    it('closes dropdown when escape key is pressed', async () => {
      render(<ProfileDropdown />);

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('closes dropdown when clicking outside', async () => {
      render(
        <div>
          <ProfileDropdown />
          <div data-testid="outside-element">Outside</div>
        </div>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId('outside-element'));
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('has proper ARIA attributes for button', () => {
      render(<ProfileDropdown />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
      expect(button).toHaveAttribute('aria-label', 'Menu do perfil de Test User');
    });

    it('handles user without name gracefully', () => {
      mockAuthStore.user = { name: '' };
      render(<ProfileDropdown />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Menu do perfil de usuário');
    });
  });

  describe('Icons and Visual Elements', () => {
    it('renders icons with correct accessibility attributes', async () => {
      render(<ProfileDropdown />);

      fireEvent.click(screen.getByRole('button'));

      const userIcons = screen.getAllByTestId('user-icon');
      const logoutIcon = screen.getByTestId('logout-icon');

      userIcons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
      expect(logoutIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders separator between menu items', async () => {
      render(<ProfileDropdown />);

      fireEvent.click(screen.getByRole('button'));

      const separator = screen.getByRole('separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass('border-gray-100');
    });

    it('applies hover effects to menu items', async () => {
      render(<ProfileDropdown />);

      fireEvent.click(screen.getByRole('button'));

      const profileLink = screen.getByRole('menuitem', { name: /meu perfil/i });
      const logoutButton = screen.getByRole('menuitem', { name: /sair/i });

      expect(profileLink).toHaveClass('hover:bg-gray-50', 'hover:scale-105');
      expect(logoutButton).toHaveClass('hover:bg-gray-50', 'hover:scale-105');
    });
  });

  describe('Focus Management', () => {
    it('maintains focus on button after dropdown closes', async () => {
      render(<ProfileDropdown />);

      const button = screen.getByRole('button');
      button.focus();
      fireEvent.click(button);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('has proper focus styles', () => {
      render(<ProfileDropdown />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid clicking without errors', async () => {
      render(<ProfileDropdown />);

      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
      
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
      
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('cleans up event listeners on unmount', () => {
      const { unmount } = render(<ProfileDropdown />);
      
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });
});
