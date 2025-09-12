import { useTranslation } from 'react-i18next';

type StatusBadgeProps = {
  status: 'Active' | 'Inactive';
  variant?: 'default' | 'small';
};

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  const sizeClasses = variant === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';
  const colorClasses = status === 'Active' 
    ? 'bg-green-50 text-green-700' 
    : 'bg-red-50 text-red-700';

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {status === 'Active' ? t('clients.options.active') : t('clients.options.inactive')}
    </span>
  );
}

type RoleBadgeProps = {
  role: 'admin' | 'user';
  variant?: 'default' | 'small';
};

export function RoleBadge({ role, variant = 'default' }: RoleBadgeProps) {
  const { t } = useTranslation();
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  const sizeClasses = variant === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';
  const colorClasses = role === 'admin' 
    ? 'bg-purple-100 text-purple-700' 
    : 'bg-gray-100 text-gray-700';

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {role === 'admin' ? t('users.roles.admin') : t('users.roles.client')}
    </span>
  );
}

type ConectaPlusBadgeProps = {
  conectaPlus: boolean;
  variant?: 'default' | 'small';
};

export function ConectaPlusBadge({ conectaPlus, variant = 'default' }: ConectaPlusBadgeProps) {
  const { t } = useTranslation();
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  const sizeClasses = variant === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';
  const colorClasses = conectaPlus 
    ? 'bg-blue-50 text-blue-700' 
    : 'bg-gray-50 text-gray-700';

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {conectaPlus ? t('common.yes') : t('common.no')}
    </span>
  );
}
