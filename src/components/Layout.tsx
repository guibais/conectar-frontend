import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { LogOut, User, Users, Building2 } from 'lucide-react';
import { useAuthStore } from '../stores/auth-store';
import { Button } from './ui/Button';

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#4ECDC4] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/clients" className="text-xl font-bold underline decoration-2 underline-offset-4">
                Conéctar
              </Link>
              
              {user?.role === 'admin' && (
                <nav className="flex space-x-6">
                  <Link
                    to="/clients"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                    activeProps={{ className: 'bg-white/20' }}
                  >
                    <Building2 size={16} />
                    <span>Clientes</span>
                  </Link>
                  <Link
                    to="/users"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                    activeProps={{ className: 'bg-white/20' }}
                  >
                    <Users size={16} />
                    <span>Usuários</span>
                  </Link>
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <User size={16} />
                <span>{user?.name}</span>
              </Link>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-white text-white hover:bg-white hover:text-[#4ECDC4]"
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
