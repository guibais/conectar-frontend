import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TabBar } from '../TabBar';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'clients.tabs.basicData': 'Dados Básicos',
      };
      return translations[key] || key;
    },
  }),
}));

const defaultProps = {
  activeTab: 'dados-basicos',
};

const customTabs = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

describe('TabBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default tab when no tabs provided', () => {
    render(<TabBar {...defaultProps} />);

    expect(screen.getByRole('tab', { name: /dados básicos/i })).toBeInTheDocument();
  });

  it('renders custom tabs when provided', () => {
    render(<TabBar {...defaultProps} tabs={customTabs} />);

    expect(screen.getByRole('tab', { name: /tab 1/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab 2/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab 3/i })).toBeInTheDocument();
  });

  it('renders with correct accessibility structure', () => {
    render(<TabBar {...defaultProps} tabs={customTabs} />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    expect(tablist).toHaveAttribute('aria-label', 'Navegação por abas');

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });

  it('applies active styling to current tab', () => {
    render(<TabBar activeTab="tab2" tabs={customTabs} />);

    const activeTab = screen.getByRole('tab', { name: /tab 2/i });
    const inactiveTab = screen.getByRole('tab', { name: /tab 1/i });

    expect(activeTab).toHaveClass('border-conectar-primary', 'text-conectar-primary');
    expect(inactiveTab).toHaveClass('border-transparent', 'text-gray-500');
  });

  it('applies inactive styling to non-current tabs', () => {
    render(<TabBar activeTab="tab1" tabs={customTabs} />);

    const inactiveTab = screen.getByRole('tab', { name: /tab 2/i });
    expect(inactiveTab).toHaveClass(
      'border-transparent',
      'text-gray-500',
      'hover:text-gray-700',
      'hover:border-gray-300'
    );
  });

  it('renders tabs with correct ARIA attributes', () => {
    render(<TabBar activeTab="tab1" tabs={customTabs} />);

    const activeTab = screen.getByRole('tab', { name: /tab 1/i });
    const inactiveTab = screen.getByRole('tab', { name: /tab 2/i });

    expect(activeTab).toHaveAttribute('aria-selected', 'true');
    expect(activeTab).toHaveAttribute('aria-controls', 'tabpanel-tab1');
    expect(activeTab).toHaveAttribute('id', 'tab-tab1');

    expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    expect(inactiveTab).toHaveAttribute('aria-controls', 'tabpanel-tab2');
    expect(inactiveTab).toHaveAttribute('id', 'tab-tab2');
  });

  it('applies correct CSS classes for layout and styling', () => {
    render(<TabBar {...defaultProps} tabs={customTabs} />);

    const container = screen.getByRole('tablist').parentElement?.parentElement;
    expect(container).toHaveClass('border-b', 'border-gray-200', 'bg-white');

    const navigation = screen.getByRole('tablist');
    expect(navigation).toHaveClass('flex', 'space-x-8');

    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab).toHaveClass(
        'py-4',
        'px-1',
        'border-b-2',
        'font-medium',
        'text-sm',
        'transition-colors',
        'cursor-pointer'
      );
    });
  });

  it('has proper focus styling', () => {
    render(<TabBar {...defaultProps} tabs={customTabs} />);

    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-conectar-primary',
        'focus:ring-offset-2'
      );
    });
  });

  it('renders as buttons with correct type', () => {
    render(<TabBar {...defaultProps} tabs={customTabs} />);

    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('type', 'button');
    });
  });

  it('handles default activeTab when not provided', () => {
    render(<TabBar tabs={customTabs} />);

    const defaultActiveTab = screen.getByRole('tab', { name: /tab 1/i });
    expect(defaultActiveTab).toHaveAttribute('aria-selected', 'false');
  });

  it('uses default activeTab value correctly', () => {
    render(<TabBar />);

    const defaultTab = screen.getByRole('tab', { name: /dados básicos/i });
    expect(defaultTab).toHaveAttribute('aria-selected', 'true');
    expect(defaultTab).toHaveClass('border-conectar-primary', 'text-conectar-primary');
  });

  it('handles empty tabs array gracefully', () => {
    render(<TabBar activeTab="test" tabs={[]} />);

    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('renders with proper container structure', () => {
    render(<TabBar {...defaultProps} tabs={customTabs} />);

    const outerContainer = screen.getByRole('tablist').parentElement?.parentElement;
    const innerContainer = screen.getByRole('tablist').parentElement;

    expect(outerContainer).toHaveClass('border-b', 'border-gray-200', 'bg-white');
    expect(innerContainer).toHaveClass('px-6');
  });

  it('maintains consistent spacing between tabs', () => {
    render(<TabBar {...defaultProps} tabs={customTabs} />);

    const navigation = screen.getByRole('tablist');
    expect(navigation).toHaveClass('space-x-8');
  });

  it('handles tab IDs with special characters', () => {
    const specialTabs = [
      { id: 'tab-with-dashes', label: 'Tab with Dashes' },
      { id: 'tab_with_underscores', label: 'Tab with Underscores' },
    ];

    render(<TabBar activeTab="tab-with-dashes" tabs={specialTabs} />);

    const dashTab = screen.getByRole('tab', { name: /tab with dashes/i });
    const underscoreTab = screen.getByRole('tab', { name: /tab with underscores/i });

    expect(dashTab).toHaveAttribute('id', 'tab-tab-with-dashes');
    expect(dashTab).toHaveAttribute('aria-controls', 'tabpanel-tab-with-dashes');

    expect(underscoreTab).toHaveAttribute('id', 'tab-tab_with_underscores');
    expect(underscoreTab).toHaveAttribute('aria-controls', 'tabpanel-tab_with_underscores');
  });

  it('handles long tab labels correctly', () => {
    const longLabelTabs = [
      { id: 'long', label: 'This is a very long tab label that might wrap' },
    ];

    render(<TabBar activeTab="long" tabs={longLabelTabs} />);

    const longTab = screen.getByRole('tab', { name: /this is a very long tab label/i });
    expect(longTab).toBeInTheDocument();
    expect(longTab).toHaveClass('font-medium', 'text-sm');
  });

  it('applies hover effects correctly', () => {
    render(<TabBar activeTab="tab1" tabs={customTabs} />);

    const inactiveTab = screen.getByRole('tab', { name: /tab 2/i });
    expect(inactiveTab).toHaveClass('hover:text-gray-700', 'hover:border-gray-300');
  });
});
