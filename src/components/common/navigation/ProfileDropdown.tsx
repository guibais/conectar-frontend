import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/auth-store";

type ProfileDropdownProps = {
  isMobile?: boolean;
};

export function ProfileDropdown({ isMobile = false }: ProfileDropdownProps) {
  const { t } = useTranslation();
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-center text-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-conectar-primary focus:ring-offset-2 rounded"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={`Menu do perfil de ${user?.name || 'usuário'}`}
          type="button"
        >
          <User size={24} aria-hidden="true" />
          <span className="text-xs mt-1 font-medium">
            {t("navigation.profile")}
          </span>
        </button>

        {isOpen && (
          <div 
            className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200"
            role="menu"
            aria-label="Menu do perfil"
          >
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-150 cursor-pointer transform focus:outline-none focus:bg-gray-50"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <User size={16} aria-hidden="true" />
              {t("profile.myProfile")}
            </Link>
            <hr className="my-2 border-gray-100" role="separator" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-150 cursor-pointer w-full text-left transform focus:outline-none focus:bg-gray-50"
              role="menuitem"
              type="button"
            >
              <LogOut size={16} aria-hidden="true" />
              {t("auth.logout")}
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
        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#00B894]"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Menu do perfil de ${user?.name || 'usuário'}`}
        type="button"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User size={16} aria-hidden="true" />
        </div>
        <span className="text-sm font-medium">{user?.name}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200"
          role="menu"
          aria-label="Menu do perfil"
        >
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-150 cursor-pointer transform focus:outline-none focus:bg-gray-50"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <User size={16} aria-hidden="true" />
            {t("profile.myProfile")}
          </Link>
          <hr className="my-2 border-gray-100" role="separator" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-150 cursor-pointer w-full text-left transform focus:outline-none focus:bg-gray-50"
            role="menuitem"
            type="button"
          >
            <LogOut size={16} aria-hidden="true" />
            {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
