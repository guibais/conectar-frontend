import { AlertTriangle } from "lucide-react";

type ErrorAlertProps = {
  message: string;
  className?: string;
};

export function ErrorAlert({ message, className = "" }: ErrorAlertProps) {
  return (
    <div
      className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-red-600" aria-hidden="true" />
        <p className="text-sm text-red-600">{message}</p>
      </div>
    </div>
  );
}
