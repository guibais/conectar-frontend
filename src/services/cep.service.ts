import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import axios from 'axios';

type CepData = {
  cep: string;
  state: string;
  city: string;
  district: string;
  street: string;
  service: string;
  location?: {
    type: string;
    coordinates: {
      longitude: string;
      latitude: string;
    };
  };
};

type CepError = {
  name: string;
  message: string;
  type: string;
  errors: Array<{
    name: string;
    message: string;
  }>;
};


const formatCep = (cep: string): string => {
  return cep.replace(/\D/g, '');
};

const validateCep = (cep: string): boolean => {
  const cleanCep = formatCep(cep);
  return /^[0-9]{8}$/.test(cleanCep);
};

const fetchCepData = async (cep: string): Promise<CepData> => {
  const cleanCep = formatCep(cep);
  
  if (!validateCep(cleanCep)) {
    throw new Error('CEP deve conter exatamente 8 dígitos');
  }

  try {
    const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
    
    return {
      cep: response.data.cep,
      state: response.data.state,
      city: response.data.city,
      district: response.data.neighborhood,
      street: response.data.street,
      service: response.data.service
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw new Error('Erro ao buscar CEP');
  }
};

export const useCepQuery = (cep: string, enabled: boolean = true) => {
  const debouncedCep = useDebounce(cep, 500);
  
  const isValidCep = useMemo(() => {
    return debouncedCep.length >= 8 && validateCep(debouncedCep);
  }, [debouncedCep]);

  return useQuery({
    queryKey: ['cep', debouncedCep],
    queryFn: () => fetchCepData(debouncedCep),
    enabled: enabled && isValidCep,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error) => {
      if (error.message === 'CEP não encontrado') {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export type { CepData, CepError };
