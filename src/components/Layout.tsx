import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, HelpCircle, Bell } from "lucide-react";
import { useAuthStore } from "../stores/auth-store";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#00B894] text-white">
        <div className="max-w-full">
          <div className="flex items-center h-16">
            <div className="flex items-center">
              <Link
                to="/clients"
                className="px-6 py-4 text-xl font-bold bg-[#00A085] h-16 flex items-center cursor-pointer"
              >
                Conéctar
              </Link>

              {user?.role === "admin" && (
                <nav className="flex h-16 mb-1">
                  <Link
                    to="/clients"
                    className="px-6 py-4 text-base font-medium bg-[#00B894] hover:bg-[#00A085] transition-colors h-16 flex items-center cursor-pointer border-b-2 border-transparent"
                    activeProps={{ className: "bg-[#00A085] border-b-white" }}
                  >
                    Clientes
                  </Link>
                  <Link
                    to="/notifications"
                    className="px-6 py-4 text-base font-medium bg-[#00B894] hover:bg-[#00A085] transition-colors h-16 flex items-center cursor-pointer border-b-2 border-transparent"
                    activeProps={{ className: "bg-[#00A085] border-b-white" }}
                  >
                    Notificações
                  </Link>
                </nav>
              )}
            </div>

            <div className="flex items-center ml-auto mr-6 space-x-3">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                <HelpCircle size={20} />
              </button>
              <Link
                to="/notifications"
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <Bell size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
