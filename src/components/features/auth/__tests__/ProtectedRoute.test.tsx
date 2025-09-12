import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProtectedRoute } from '../ProtectedRoute';

const mockNavigate = vi.fn();
const mockInitializeAuth = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

const mockAuthStore = {
  isAuthenticated: false,
  user: null as any,
  isLoading: false,
  initializeAuth: mockInitializeAuth,
};

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => mockAuthStore,
}));

describe('ProtectedRoute', () => {
  const TestChild = () => <div>Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.isAuthenticated = false;
    mockAuthStore.user = null;
    mockAuthStore.isLoading = false;
  });

  describe('Authentication Initialization', () => {
    it('calls initializeAuth on mount', () => {
      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(mockInitializeAuth).toHaveBeenCalledTimes(1);
    });

    it('calls initializeAuth only once on re-renders', () => {
      const { rerender } = render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      rerender(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(mockInitializeAuth).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State', () => {
    it('renders loading spinner when isLoading is true', () => {
      mockAuthStore.isLoading = true;

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass(
        'animate-spin',
        'rounded-full',
        'h-32',
        'w-32',
        'border-b-2',
        'border-[#4ECDC4]'
      );
    });

    it('renders loading container with correct styling', () => {
      mockAuthStore.isLoading = true;

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      const container = document.querySelector('.min-h-screen');
      expect(container).toHaveClass(
        'min-h-screen',
        'flex',
        'items-center',
        'justify-center'
      );
    });

    it('does not render children when loading', () => {
      mockAuthStore.isLoading = true;

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('does not navigate when loading', () => {
      mockAuthStore.isLoading = true;
      mockAuthStore.isAuthenticated = false;

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Unauthenticated User', () => {
    it('navigates to login when not authenticated and not loading', async () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = false;

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
      });
    });

    it('returns null when not authenticated and not loading', () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = false;

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('does not render children when not authenticated', () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = false;

      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated User Without Role Requirement', () => {
    beforeEach(() => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      (mockAuthStore as any).user = { name: 'Test User', role: 'user' };
    });

    it('renders children when authenticated without role requirement', () => {
      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('does not navigate when authenticated without role requirement', () => {
      render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('renders multiple children correctly', () => {
      const MultipleChildren = () => (
        <>
          <div>Child 1</div>
          <div>Child 2</div>
        </>
      );

      render(
        <ProtectedRoute>
          <MultipleChildren />
        </ProtectedRoute>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('Role-Based Access Control', () => {
    describe('Admin Role Requirement', () => {
      it('renders children when user has admin role and admin is required', () => {
        mockAuthStore.isLoading = false;
        mockAuthStore.isAuthenticated = true;
        mockAuthStore.user = { name: 'Admin User', role: 'admin' };

        render(
          <ProtectedRoute requireRole="admin">
            <TestChild />
          </ProtectedRoute>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      it('navigates to clients when user role does not match admin requirement', async () => {
        mockAuthStore.isLoading = false;
        mockAuthStore.isAuthenticated = true;
        mockAuthStore.user = { name: 'Regular User', role: 'user' };

        render(
          <ProtectedRoute requireRole="admin">
            <TestChild />
          </ProtectedRoute>
        );

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith({ to: '/clients' });
        });
      });

      it('returns null when user role does not match admin requirement', () => {
        mockAuthStore.isLoading = false;
        mockAuthStore.isAuthenticated = true;
        mockAuthStore.user = { name: 'Regular User', role: 'user' };

        render(
          <ProtectedRoute requireRole="admin">
            <TestChild />
          </ProtectedRoute>
        );

        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });
    });

    describe('User Role Requirement', () => {
      it('renders children when user has user role and user is required', () => {
        mockAuthStore.isLoading = false;
        mockAuthStore.isAuthenticated = true;
        mockAuthStore.user = { name: 'Regular User', role: 'user' };

        render(
          <ProtectedRoute requireRole="user">
            <TestChild />
          </ProtectedRoute>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      it('renders children when admin has user role requirement', () => {
        mockAuthStore.isLoading = false;
        mockAuthStore.isAuthenticated = true;
        mockAuthStore.user = { name: 'Admin User', role: 'admin' };

        render(
          <ProtectedRoute requireRole="user">
            <TestChild />
          </ProtectedRoute>
        );

        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });

      it('navigates to clients when admin tries to access user-only route', async () => {
        mockAuthStore.isLoading = false;
        mockAuthStore.isAuthenticated = true;
        mockAuthStore.user = { name: 'Admin User', role: 'admin' };

        render(
          <ProtectedRoute requireRole="user">
            <TestChild />
          </ProtectedRoute>
        );

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith({ to: '/clients' });
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles null user when authenticated', () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = null;

      render(
        <ProtectedRoute requireRole="admin">
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('handles undefined user role', async () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      (mockAuthStore as any).user = { name: 'User', role: undefined };

      render(
        <ProtectedRoute requireRole="admin">
          <TestChild />
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/clients' });
      });
    });

    it('handles user with different role than expected', async () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      (mockAuthStore as any).user = { name: 'User', role: 'moderator' };

      render(
        <ProtectedRoute requireRole="admin">
          <TestChild />
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/clients' });
      });
    });

    it('does not navigate when role matches exactly', () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      (mockAuthStore as any).user = { name: 'Test User', role: 'user' };

      render(
        <ProtectedRoute requireRole="user">
          <TestChild />
        </ProtectedRoute>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('handles transition from loading to authenticated', async () => {
      mockAuthStore.isLoading = true;
      mockAuthStore.isAuthenticated = false;

      const { rerender } = render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      (mockAuthStore as any).user = { name: 'Test User', role: 'user' };

      rerender(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('handles transition from loading to unauthenticated', async () => {
      mockAuthStore.isLoading = true;

      const { rerender } = render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = false;

      rerender(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
      });
    });

    it('handles authentication state changes', async () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      (mockAuthStore as any).user = { name: 'Test User', role: 'user' };

      const { rerender } = render(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();

      mockAuthStore.isAuthenticated = false;
      mockAuthStore.user = null;

      rerender(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
      });
    });
  });

  describe('Complex Children', () => {
    it('renders complex nested components', () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      (mockAuthStore as any).user = { name: 'Test User', role: 'user' };

      const ComplexChild = () => (
        <div>
          <header>Header</header>
          <main>
            <section>Section</section>
          </main>
          <footer>Footer</footer>
        </div>
      );

      render(
        <ProtectedRoute>
          <ComplexChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Section')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });
});
