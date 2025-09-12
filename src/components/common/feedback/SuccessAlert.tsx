import { CheckCircle } from "lucide-react";

type SuccessAlertProps = {
  message: string;
  className?: string;
};

export function SuccessAlert({ message, className = "" }: SuccessAlertProps) {
  return (
    <div
      className={`p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
        <p className="text-sm text-green-600">{message}</p>
      </div>
    </div>
  );
}
