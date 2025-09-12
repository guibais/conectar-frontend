import { useState } from "react";
import { useCepQuery } from "@/services/cep.service";
import { maskCEP, maskCNPJ, removeMask } from "@/utils/masks";
import type { FormFieldConfig } from "@/components/forms/components/DynamicForm";
import { clientFormFields } from "@/lib/form-fields";

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
