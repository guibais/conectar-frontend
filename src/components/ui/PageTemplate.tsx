import { type ReactNode } from 'react';

type PageTemplateProps = {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
  isLoading?: boolean;
};

export function PageTemplate({
  title,
  description,
  children,
  action,
  isLoading = false,
}: PageTemplateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conectar-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        {action && action}
      </div>
      {children}
    </div>
  );
}
