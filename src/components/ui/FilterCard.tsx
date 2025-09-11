import { type ReactNode, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

type FilterCardProps = {
  title?: string;
  itemCount?: number;
  children: ReactNode;
  onClear: () => void;
  onApply: () => void;
  clearLabel?: string;
  applyLabel?: string;
  defaultExpanded?: boolean;
};

export function FilterCard({
  title = "Filtros",
  itemCount,
  children,
  onClear,
  onApply,
  clearLabel = "Limpar campos",
  applyLabel = "Filtrar",
  defaultExpanded = false,
}: FilterCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="px-4 sm:px-6 py-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-conectar-primary" />
              <span className="font-medium text-gray-900 text-base">{title}</span>
            </div>
            {itemCount !== undefined && (
              <span className="text-xs sm:text-sm text-gray-500 sm:ml-2">
                Filtre e busque itens na página
              </span>
            )}
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ease-in-out flex-shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`} />
        </button>
      </div>

      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 sm:px-6 pb-6 border-t border-gray-100">
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transform transition-transform duration-300 ease-out">
            {children}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6">
            <button
              onClick={onClear}
              className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 cursor-pointer transform active:scale-95"
            >
              {clearLabel}
            </button>
            <button
              onClick={onApply}
              className="w-full sm:w-auto px-6 py-2 text-sm font-medium bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 hover:scale-105 transition-all duration-200 cursor-pointer transform active:scale-95"
            >
              {applyLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
