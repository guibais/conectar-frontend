import { type ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-gray-600">{description}</p>
      </div>
      {actions && (
        <div 
          className="flex items-center gap-3"
          role="toolbar"
          aria-label="Ações do cabeçalho"
        >
          {actions}
        </div>
      )}
    </header>
  );
}
