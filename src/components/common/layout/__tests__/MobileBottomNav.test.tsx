import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MobileBottomNav } from '../MobileBottomNav';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: '/dashboard' }),
  useNavigate: () => vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.clients': 'Clientes',
        'navigation.notifications': 'Notificações',
        'navigation.profile': 'Perfil',
      };
      return translations[key] || key;
    },
  }),
}));

const mockAuthStore = {
  user: { name: 'Test User', role: 'admin' },
  logout: vi.fn(),
};

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => mockAuthStore,
}));

vi.mock('lucide-react', () => ({
  BarChart3: (props: any) => <div data-testid="bar-chart-icon" {...props} />,
  Users: (props: any) => <div data-testid="users-icon" {...props} />,
  Bell: (props: any) => <div data-testid="bell-icon" {...props} />,
  FileText: (props: any) => <div data-testid="file-text-icon" {...props} />,
  Settings: (props: any) => <div data-testid="settings-icon" {...props} />,
  User: (props: any) => <div data-testid="user-icon" {...props} />,
}));

vi.mock('@/components', () => ({
  ProfileDropdown: ({ isMobile }: { isMobile?: boolean }) => (
    <div data-testid="profile-dropdown" data-mobile={isMobile}>
      Profile Dropdown
    </div>
  ),
}));

describe('MobileBottomNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.user.role = 'admin';
  });

  it('renders mobile navigation with correct structure', () => {
    render(<MobileBottomNav />);

    const nav = screen.getByRole('navigation', { name: /navegação móvel/i });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('md:hidden');
  });

  it('renders navigation links correctly for admin users', () => {
    render(<MobileBottomNav />);

    const clientsLink = screen.getByRole('link', { name: /clientes/i });
    expect(clientsLink).toBeInTheDocument();
    expect(clientsLink).toHaveAttribute('href', '/clients');

    const notificationsLink = screen.getByRole('link', { name: /notificações/i });
    expect(notificationsLink).toBeInTheDocument();
    expect(notificationsLink).toHaveAttribute('href', '/notifications');
  });

  it('renders all navigation links for admin users', () => {
    render(<MobileBottomNav />);

    expect(screen.getByRole('link', { name: /clientes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /notificações/i })).toBeInTheDocument();
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
  });

  it('renders profile section for admin users', () => {
    render(<MobileBottomNav />);

    const profileDropdown = screen.getByTestId('profile-dropdown');
    expect(profileDropdown).toBeInTheDocument();
    expect(profileDropdown).toHaveAttribute('data-mobile', 'true');
  });

  it('renders only profile for non-admin users', () => {
    mockAuthStore.user.role = 'user';
    render(<MobileBottomNav />);

    expect(screen.queryByRole('link', { name: /clientes/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /notificações/i })).not.toBeInTheDocument();
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
  });

  it('has proper mobile navigation structure for admin', () => {
    render(<MobileBottomNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navegação móvel principal');
    expect(nav).toHaveAttribute('role', 'navigation');
  });

  it('applies correct CSS classes for mobile navigation', () => {
    render(<MobileBottomNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass(
      'fixed',
      'bottom-0',
      'left-0',
      'right-0',
      'bg-white',
      'border-t',
      'border-gray-200',
      'px-4',
      'py-2',
      'z-50',
      'md:hidden'
    );
  });

  it('renders navigation icons with correct accessibility attributes for admin', () => {
    render(<MobileBottomNav />);

    const usersIcon = screen.getByTestId('users-icon');
    expect(usersIcon).toHaveAttribute('aria-hidden', 'true');

    const bellIcon = screen.getByTestId('bell-icon');
    expect(bellIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('has correct navigation label for non-admin users', () => {
    mockAuthStore.user.role = 'user';
    render(<MobileBottomNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navegação móvel');
  });

  it('renders links with proper focus styles for admin', () => {
    render(<MobileBottomNav />);

    const clientsLink = screen.getByRole('link', { name: /clientes/i });
    expect(clientsLink).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-conectar-primary');
  });

  it('has proper mobile navigation structure for admin', () => {
    render(<MobileBottomNav />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    links.forEach(link => {
      expect(link).toHaveClass('flex', 'flex-col', 'items-center', 'transition-colors');
    });
  });

  it('renders navigation labels with correct typography for admin', () => {
    render(<MobileBottomNav />);

    const clientsLabel = screen.getByText('Clientes');
    expect(clientsLabel).toHaveClass('text-xs', 'mt-1', 'font-medium');

    const notificationsLabel = screen.getByText('Notificações');
    expect(notificationsLabel).toHaveClass('text-xs', 'mt-1', 'font-medium');
  });

  it('maintains consistent icon sizing across navigation items for admin', () => {
    render(<MobileBottomNav />);

    const usersIcon = screen.getByTestId('users-icon');
    expect(usersIcon).toHaveAttribute('size', '24');

    const bellIcon = screen.getByTestId('bell-icon');
    expect(bellIcon).toHaveAttribute('size', '24');
  });

  it('handles role-based navigation correctly for admin', () => {
    render(<MobileBottomNav />);

    expect(screen.getByRole('link', { name: /clientes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /notificações/i })).toBeInTheDocument();
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
  });
});
