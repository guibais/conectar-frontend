import { useState } from "react";

type ErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function useErrorHandler() {
  const [errorMessage, setErrorMessage] = useState("");

  const handleError = (error: ErrorResponse, defaultMessage = "Erro inesperado. Tente novamente.") => {
    const message = error.response?.data?.message || defaultMessage;
    setErrorMessage(message);
  };

  const clearError = () => setErrorMessage("");

  return {
    errorMessage,
    handleError,
    clearError,
  };
}
