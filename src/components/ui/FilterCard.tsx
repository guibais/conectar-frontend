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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm my-2">
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-900">{title}</span>
            {itemCount !== undefined && (
              <span className="text-xs text-gray-500">
                • {itemCount} itens na página
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <div className="pt-4">{children}</div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-white transition-colors"
            >
              {clearLabel}
            </button>
            <button
              onClick={onApply}
              className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {applyLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
