type StatusBadgeProps = {
  status: 'Active' | 'Inactive';
  variant?: 'default' | 'small';
};

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  const sizeClasses = variant === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';
  const colorClasses = status === 'Active' 
    ? 'bg-green-50 text-green-700' 
    : 'bg-red-50 text-red-700';

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {status === 'Active' ? 'Ativo' : 'Inativo'}
    </span>
  );
}

type RoleBadgeProps = {
  role: 'admin' | 'user';
  variant?: 'default' | 'small';
};

export function RoleBadge({ role, variant = 'default' }: RoleBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  const sizeClasses = variant === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';
  const colorClasses = role === 'admin' 
    ? 'bg-purple-100 text-purple-700' 
    : 'bg-gray-100 text-gray-700';

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {role === 'admin' ? 'Administrador' : 'Cliente'}
    </span>
  );
}

type ConectaPlusBadgeProps = {
  conectaPlus: boolean;
  variant?: 'default' | 'small';
};

export function ConectaPlusBadge({ conectaPlus, variant = 'default' }: ConectaPlusBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  const sizeClasses = variant === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';
  const colorClasses = conectaPlus 
    ? 'bg-blue-50 text-blue-700' 
    : 'bg-gray-50 text-gray-700';

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {conectaPlus ? 'Sim' : 'Não'}
    </span>
  );
}
