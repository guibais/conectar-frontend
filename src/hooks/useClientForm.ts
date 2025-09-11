import { useState } from "react";
import { useCepQuery } from "@/services/cep.service";
import { maskCEP, maskCNPJ, removeMask } from "@/utils/masks";
import type { FormFieldConfig } from "@/components/ui/DynamicForm";
import { clientFormFields } from "@/lib/form-fields";
import { Search } from "lucide-react";

export function useClientForm() {
  const [cepValue, setCepValue] = useState("");
  const cepQuery = useCepQuery(cepValue, cepValue.length >= 8);

  const handleCepChange = (value: string) => {
    const maskedValue = maskCEP(value);
    setCepValue(removeMask(maskedValue));
    return maskedValue;
  };

  const handleCnpjChange = (value: string) => {
    return maskCNPJ(value);
  };

  const getFieldsWithHandlers = (): FormFieldConfig[] => {
    return clientFormFields.map((field) => {
      if (field.name === "zipCode") {
        return {
          ...field,
          loading: cepQuery.isLoading,
          icon: cepQuery.data ? <Search className="h-4 w-4 text-green-500" /> : undefined,
          onChange: handleCepChange,
        };
      }
      if (field.name === "taxId") {
        return {
          ...field,
          onChange: handleCnpjChange,
        };
      }
      return field;
    });
  };

  const getDefaultValuesWithCep = (baseValues: Record<string, any>) => {
    return {
      ...baseValues,
      ...(cepQuery.data && !cepQuery.isLoading ? {
        street: cepQuery.data.street || baseValues.street || "",
        district: cepQuery.data.district || baseValues.district || "",
        city: cepQuery.data.city || baseValues.city || "",
        state: cepQuery.data.state || baseValues.state || "",
      } : {}),
    };
  };

  return {
    cepQuery,
    getFieldsWithHandlers,
    getDefaultValuesWithCep,
  };
}
