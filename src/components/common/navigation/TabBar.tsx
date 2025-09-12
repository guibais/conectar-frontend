import { useTranslation } from 'react-i18next';

type TabBarProps = {
  activeTab?: string;
  tabs?: Array<{
    id: string;
    label: string;
    href?: string;
  }>;
};

export function TabBar({ activeTab = "dados-basicos", tabs }: TabBarProps) {
  const { t } = useTranslation();
  const defaultTabs = [
    { id: "dados-basicos", label: t('clients.tabs.basicData') }
  ];

  const tabsToRender = tabs || defaultTabs;

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6">
        <nav className="flex space-x-8">
          {tabsToRender.map((tab) => (
            <button
              key={tab.id}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-conectar-primary text-conectar-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
