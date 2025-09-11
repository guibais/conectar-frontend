import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type PaginationProps = {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({ pagination, onPageChange, className = "" }: PaginationProps) {
  const { t } = useTranslation();
  const { page, limit, total, totalPages } = pagination;
  
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);
  
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className={`flex items-center justify-between px-6 py-4 border-t border-gray-200 ${className}`}>
      <div className="text-sm text-gray-500">
        {t('pagination.showing', { start: startItem, end: endItem, total })}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrevious}
          className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('common.previous')}
        </button>
        
        <span className="px-3 py-2 text-sm">
          {t('pagination.pageOf', { page, totalPages })}
        </span>
        
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {t('common.next')}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
