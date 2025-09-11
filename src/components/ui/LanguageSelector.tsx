import { useTranslation } from 'react-i18next';
import { Select } from '@/components/ui/Select';

type LanguageSelectorProps = {
  className?: string;
};

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const languageOptions = [
    { value: 'pt-BR', label: t('languages.pt-BR') },
    { value: 'en', label: t('languages.en') },
  ];

  return (
    <div className={className}>
      <Select
        label={t('profile.language')}
        value={i18n.language}
        onChange={handleLanguageChange}
        options={languageOptions}
      />
    </div>
  );
}
