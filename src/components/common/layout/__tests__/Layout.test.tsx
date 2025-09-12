import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { Layout } from '../Layout';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useRouterState: vi.fn(() => ({
    location: { pathname: '/dashboard' }
  })),
  useNavigate: vi.fn(() => vi.fn()),
  Link: vi.fn(({ children, to, ...props }) => 
    React.createElement('a', { href: to, ...props }, children)
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('lucide-react', () => {
  const MockIcon = ({ size, ...props }: any) => 
    React.createElement('div', { 'data-testid': 'mock-icon', 'data-size': size, ...props });
  
  return {
    Home: MockIcon,
    Users: MockIcon,
    BarChart3: MockIcon,
    Settings: MockIcon,
    HelpCircle: MockIcon,
    User: MockIcon,
    ChevronDown: MockIcon,
    LogOut: MockIcon,
    X: MockIcon,
  };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', role: 'admin' },
    logout: vi.fn(),
  }),
}));

vi.mock('../ProfileDropdown', () => ({
  ProfileDropdown: vi.fn(({ isMobile }) => 
    React.createElement('div', { 
      'data-testid': isMobile ? 'mobile-profile-dropdown' : 'profile-dropdown' 
    }, 'Profile Dropdown')
  ),
}));

vi.mock('../MobileBottomNav', () => ({
  MobileBottomNav: vi.fn(() => 
    React.createElement('div', { 'data-testid': 'mobile-bottom-nav' }, 'Mobile Bottom Nav')
  ),
}));

const TestChild = () => <div data-testid="test-child">Test Content</div>;

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders layout structure correctly', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const headers = screen.getAllByRole('banner');
    expect(headers).toHaveLength(2); // Desktop and mobile headers
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders header with correct branding', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const logos = screen.getAllByRole('img', { name: /logotipo conéctar/i });
    expect(logos).toHaveLength(2); // Desktop and mobile logos
    logos.forEach(logo => {
      expect(logo).toHaveClass('h-8');
      expect(logo).toHaveAttribute('src', '/logo-white.png');
    });
  });

  it('renders only profile links in layout', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const profileLinks = screen.getAllByRole('link');
    expect(profileLinks).toHaveLength(2); // Desktop and mobile profile links
    profileLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/profile');
    });
  });

  it('renders mock icons with correct accessibility attributes', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const mockIcons = screen.getAllByTestId('mock-icon');
    expect(mockIcons.length).toBeGreaterThan(0);
    mockIcons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('renders header with correct accessibility attributes', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const headers = screen.getAllByRole('banner');
    expect(headers).toHaveLength(2); // Desktop and mobile headers
    
    const profileLinks = screen.getAllByRole('link', { name: /ir para perfil/i });
    expect(profileLinks).toHaveLength(2); // Desktop and mobile profile links
  });

  it('renders profile links with correct accessibility attributes', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const profileLinks = screen.getAllByRole('link', { name: /ir para perfil/i });
    expect(profileLinks).toHaveLength(2);
    profileLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/profile');
      expect(link).toHaveAttribute('aria-label', 'Ir para perfil');
    });
  });

  it('renders profile dropdown with correct accessibility attributes', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const profileButton = screen.getByRole('button', { name: /menu do perfil de usuário/i });
    expect(profileButton).toHaveAttribute('aria-expanded', 'false');
    expect(profileButton).toHaveAttribute('aria-haspopup', 'menu');
    expect(profileButton).toHaveAttribute('aria-label', 'Menu do perfil de usuário');
  });

  it('renders profile button in header', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const profileButton = screen.getByRole('button', { name: /menu do perfil de usuário/i });
    expect(profileButton).toBeInTheDocument();
    expect(profileButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('applies correct CSS classes for main content', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('pb-20', 'md:pb-0');
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('renders mobile bottom navigation', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const mobileNav = screen.getByTestId('mobile-bottom-nav');
    expect(mobileNav).toBeInTheDocument();
    expect(mobileNav).toHaveTextContent('Mobile Bottom Nav');
  });

  it('renders children content in main area', () => {
    const customChild = <div data-testid="custom-content">Custom Layout Content</div>;
    
    render(<Layout>{customChild}</Layout>);

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Layout Content')).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout structure', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const headers = screen.getAllByRole('banner');
    expect(headers[0]).toHaveClass('bg-[#00B894]', 'text-white');
    expect(headers[1]).toHaveClass('bg-[#00B894]', 'text-white');
  });

  it('has proper semantic HTML structure', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const headers = screen.getAllByRole('banner');
    expect(headers).toHaveLength(2);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('main content has proper ARIA labeling', () => {
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveAttribute('tabindex', '-1');
  });

});
