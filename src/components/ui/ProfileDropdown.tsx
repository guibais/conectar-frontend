import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../stores/auth-store";

type ProfileDropdownProps = {
  isMobile?: boolean;
};

export function ProfileDropdown({ isMobile = false }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-center text-gray-600 transition-colors cursor-pointer"
        >
          <User size={24} />
          <span className="text-xs mt-1 font-medium">Perfil</span>
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-150 cursor-pointer transform"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              Meu Perfil
            </Link>
            <hr className="my-2 border-gray-100" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-150 cursor-pointer w-full text-left transform"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User size={16} />
        </div>
        <span className="text-sm font-medium">{user?.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-150 cursor-pointer transform"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            Meu Perfil
          </Link>
          <hr className="my-2 border-gray-100" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-150 cursor-pointer w-full text-left transform"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
