import { type ReactNode } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Pagination } from './Pagination';

type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  actions?: (item: T) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  sortBy,
  sortOrder,
  onSort,
  actions,
  isLoading,
  emptyMessage = 'Nenhum item encontrado',
  pagination,
  onPageChange,
}: DataTableProps<T>) {
  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conectar-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((column) => (
                <th key={column.key} className={`px-6 py-4 text-left ${column.className || ''}`}>
                  {column.sortable && onSort ? (
                    <button
                      onClick={() => onSort(column.key)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:scale-105 transition-all duration-150 cursor-pointer transform active:scale-95"
                    >
                      {column.header}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {column.header}
                    </span>
                  )}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-25 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && onPageChange && (
        <Pagination 
          pagination={pagination} 
          onPageChange={onPageChange} 
        />
      )}
    </div>
  );
}
