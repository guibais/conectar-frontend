import type { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { LogOut, HelpCircle, Bell } from 'lucide-react';
import { useAuthStore } from '../stores/auth-store';

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
      <header className="bg-conectar-primary text-white">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/clients" className="text-xl font-bold">
                Conéctar
              </Link>
              
              {user?.role === 'admin' && (
                <nav className="flex space-x-1">
                  <Link
                    to="/clients"
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
                    activeProps={{ className: 'bg-white/10' }}
                  >
                    <span>Clientes</span>
                  </Link>
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <HelpCircle size={20} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Bell size={20} />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-white">
        {children}
      </main>
    </div>
  );
}
