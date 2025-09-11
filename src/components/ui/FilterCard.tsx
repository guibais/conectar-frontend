import { type ReactNode, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

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
      <div className="px-6 py-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-conectar-primary" />
            <span className="font-medium text-gray-900 text-base">{title}</span>
            {itemCount !== undefined && (
              <span className="text-sm text-gray-500 ml-2">
                Filtre e busque itens na página
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-6 grid grid-cols-4 gap-4">{children}</div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClear}
              className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {clearLabel}
            </button>
            <button
              onClick={onApply}
              className="px-6 py-2 text-sm font-medium bg-conectar-primary text-white rounded-lg hover:bg-conectar-600 transition-colors cursor-pointer"
            >
              {applyLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
