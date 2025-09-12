import { ProfileDropdown } from "@/components";
import { useAuthStore } from "@/stores/auth-store";
import { Link } from "@tanstack/react-router";
import { Users, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

export function MobileBottomNav() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  if (user?.role === "admin") {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 md:hidden">
        <div className="flex items-center justify-around">
          <Link
            to="/clients"
            className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors"
            activeProps={{ className: "text-conectar-primary" }}
          >
            <Users size={24} />
            <span className="text-xs mt-1 font-medium">
              {t("navigation.clients")}
            </span>
          </Link>

          <Link
            to="/notifications"
            className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors"
            activeProps={{ className: "text-conectar-primary" }}
          >
            <Bell size={24} />
            <span className="text-xs mt-1 font-medium">
              {t("navigation.notifications")}
            </span>
          </Link>

          <div className="flex flex-col items-center py-2 px-3">
            <ProfileDropdown isMobile />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 md:hidden">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center py-2 px-3">
          <ProfileDropdown isMobile />
        </div>
      </div>
    </div>
  );
}
