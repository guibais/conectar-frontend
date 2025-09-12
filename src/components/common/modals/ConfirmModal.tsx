import { type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  children?: ReactNode;
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
  children,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getVariantStyles = () => {
    return {
      danger: {
        icon: "🗑️",
        confirmButton: "bg-red-600 hover:bg-red-700 text-white",
        titleColor: "text-red-600",
      },
      warning: {
        icon: "⚠️",
        confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
        titleColor: "text-yellow-600",
      },
      info: {
        icon: "ℹ️",
        confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
        titleColor: "text-blue-600",
      },
    }[variant];
  };

  const styles = getVariantStyles();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{styles.icon}</span>
            <h3 className={`text-lg font-semibold ${styles.titleColor}`}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">{message}</p>
          {children}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${styles.confirmButton}`}
          >
            {isLoading ? "Processando..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
