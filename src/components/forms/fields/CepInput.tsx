import { useState, useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { Loader2, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import type { ClientFormData } from "@/lib/schemas";
import { useCepQuery } from "@/services/cep.service";

type CepInputProps = {
  value: string;
  onChange: (value: string) => void;
  setValue: UseFormSetValue<ClientFormData>;
  error?: string;
  className?: string;
};

export const CepInput = ({
  value,
  onChange,
  setValue,
  error,
  className = "",
}: CepInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const {
    data: cepData,
    isLoading,
    error: cepError,
    isSuccess,
  } = useCepQuery(inputValue);

  const formatCepDisplay = (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length <= 5) return cleanCep;
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5, 8)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length <= 8) {
      const formattedValue = formatCepDisplay(rawValue);
      setInputValue(formattedValue);
      onChange(rawValue);
    }
  };

  useEffect(() => {
    if (cepData && isSuccess) {
      setValue("street", cepData.street || "");
      setValue("district", cepData.district || "");
      setValue("city", cepData.city || "");
      setValue("state", cepData.state || "");

      if (cepData.location?.coordinates) {
        setValue("latitude", cepData.location.coordinates.latitude || "");
        setValue("longitude", cepData.location.coordinates.longitude || "");
      }
    }
  }, [cepData, isSuccess, setValue]);

  useEffect(() => {
    setInputValue(formatCepDisplay(value));
  }, [value]);

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    }
    if (cepError) {
      return <AlertCircle className="h-4 w-4 text-error" />;
    }
    if (isSuccess && cepData) {
      return <CheckCircle className="h-4 w-4 text-success" />;
    }
    return <MapPin className="h-4 w-4 text-gray-400" />;
  };

  const getStatusMessage = () => {
    if (isLoading) return "Buscando CEP...";
    if (cepError) return "CEP não encontrado";
    if (isSuccess && cepData) return `${cepData.city}/${cepData.state}`;
    return "";
  };

  const inputId = `cep-input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const statusId = `${inputId}-status`;

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="00000-000"
          maxLength={9}
          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent focus:outline-none ${
            error ? "border-error" : "border-gray-200"
          } ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${errorId} ${statusId}`.trim()}
          aria-label="CEP - Código de Endereçamento Postal"
        />
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          aria-hidden="true"
        >
          {getStatusIcon()}
        </div>
      </div>

      {(isLoading || cepError || (isSuccess && cepData)) && (
        <div
          id={statusId}
          className={`text-sm flex items-center gap-1 ${
            cepError
              ? "text-error"
              : isSuccess
                ? "text-success"
                : "text-gray-500"
          }`}
          aria-live="polite"
          role="status"
        >
          {getStatusMessage()}
        </div>
      )}

      {error && (
        <p 
          id={errorId}
          className="text-sm text-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {isSuccess && cepData?.location?.coordinates && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Lat: {cepData.location.coordinates.latitude}, Lng:{" "}
          {cepData.location.coordinates.longitude}
        </div>
      )}
    </div>
  );
};
