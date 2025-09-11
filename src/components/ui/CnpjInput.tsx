import { useState, useEffect } from 'react';

type CnpjInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  label?: string;
  placeholder?: string;
};

export const CnpjInput = ({ value, onChange, error, className = '', label, placeholder = '00.000.000/0000-00' }: CnpjInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  const formatCnpjDisplay = (cnpj: string) => {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    if (cleanCnpj.length <= 2) return cleanCnpj;
    if (cleanCnpj.length <= 5) return `${cleanCnpj.slice(0, 2)}.${cleanCnpj.slice(2)}`;
    if (cleanCnpj.length <= 8) return `${cleanCnpj.slice(0, 2)}.${cleanCnpj.slice(2, 5)}.${cleanCnpj.slice(5)}`;
    if (cleanCnpj.length <= 12) return `${cleanCnpj.slice(0, 2)}.${cleanCnpj.slice(2, 5)}.${cleanCnpj.slice(5, 8)}/${cleanCnpj.slice(8)}`;
    return `${cleanCnpj.slice(0, 2)}.${cleanCnpj.slice(2, 5)}.${cleanCnpj.slice(5, 8)}/${cleanCnpj.slice(8, 12)}-${cleanCnpj.slice(12, 14)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue.length <= 14) {
      const formattedValue = formatCnpjDisplay(rawValue);
      setInputValue(formattedValue);
      onChange(rawValue);
    }
  };

  useEffect(() => {
    setInputValue(formatCnpjDisplay(value));
  }, [value]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        maxLength={18}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-conectar-primary focus:border-transparent ${
          error ? 'border-error' : 'border-gray-200'
        } ${className}`}
      />
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};
