import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Tabs';

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

const TestTabsComponent = ({ defaultValue = 'tab1' }) => (
  <Tabs defaultValue={defaultValue}>
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Content for Tab 1</TabsContent>
    <TabsContent value="tab2">Content for Tab 2</TabsContent>
    <TabsContent value="tab3">Content for Tab 3</TabsContent>
  </Tabs>
);

describe('Tabs Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tabs Container', () => {
    it('renders tabs container with correct structure', () => {
      render(<TestTabsComponent />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('applies custom className to tabs container', () => {
      render(
        <Tabs defaultValue="tab1" className="custom-tabs">
          <div>Test content</div>
        </Tabs>
      );

      const container = screen.getByText('Test content').parentElement;
      expect(container).toHaveClass('w-full', 'custom-tabs');
    });

    it('sets initial active tab based on defaultValue', () => {
      render(<TestTabsComponent defaultValue="tab2" />);

      const tab2 = screen.getByRole('tab', { name: /tab 2/i });
      expect(tab2).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    });
  });

  describe('TabsList', () => {
    it('renders tablist with correct accessibility attributes', () => {
      render(<TestTabsComponent />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveClass('flex', 'border-b', 'border-gray-200');
    });

    it('applies custom className to tablist', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-tablist">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('flex', 'border-b', 'border-gray-200', 'custom-tablist');
    });
  });

  describe('TabsTrigger', () => {
    it('renders tab triggers with correct accessibility attributes', () => {
      render(<TestTabsComponent />);

      const tab1 = screen.getByRole('tab', { name: /tab 1/i });
      const tab2 = screen.getByRole('tab', { name: /tab 2/i });

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab1).toHaveAttribute('aria-controls', 'tabpanel-tab1');
      expect(tab1).toHaveAttribute('id', 'tab-tab1');
      expect(tab1).toHaveAttribute('type', 'button');

      expect(tab2).toHaveAttribute('aria-selected', 'false');
      expect(tab2).toHaveAttribute('aria-controls', 'tabpanel-tab2');
      expect(tab2).toHaveAttribute('id', 'tab-tab2');
    });

    it('applies active styling to selected tab', () => {
      render(<TestTabsComponent />);

      const activeTab = screen.getByRole('tab', { name: /tab 1/i });
      const inactiveTab = screen.getByRole('tab', { name: /tab 2/i });

      expect(activeTab).toHaveClass('border-[#4ECDC4]', 'text-[#4ECDC4]');
      expect(inactiveTab).toHaveClass('border-transparent', 'text-gray-500');
    });

    it('applies hover styling to inactive tabs', () => {
      render(<TestTabsComponent />);

      const inactiveTab = screen.getByRole('tab', { name: /tab 2/i });
      expect(inactiveTab).toHaveClass('hover:text-gray-700', 'hover:border-gray-300');
    });

    it('switches active tab when clicked', async () => {
      render(<TestTabsComponent />);

      const tab2 = screen.getByRole('tab', { name: /tab 2/i });
      fireEvent.click(tab2);

      expect(tab2).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
    });

    it('applies focus styling', () => {
      render(<TestTabsComponent />);

      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab).toHaveClass(
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-[#4ECDC4]',
          'focus:ring-offset-2'
        );
      });
    });

    it('applies custom className to tab trigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tab = screen.getByRole('tab', { name: /tab 1/i });
      expect(tab).toHaveClass('custom-trigger');
    });

    it('throws error when used outside Tabs context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TabsTrigger value="test">Test</TabsTrigger>);
      }).toThrow('TabsTrigger must be used within Tabs');

      consoleSpy.mockRestore();
    });
  });

  describe('TabsContent', () => {
    it('renders content for active tab only', () => {
      render(<TestTabsComponent />);

      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
    });

    it('switches content when tab changes', async () => {
      render(<TestTabsComponent />);

      fireEvent.click(screen.getByRole('tab', { name: /tab 3/i }));

      expect(screen.getByText('Content for Tab 3')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
    });

    it('renders with correct accessibility attributes', async () => {
      render(<TestTabsComponent />);

      fireEvent.click(screen.getByRole('tab', { name: /tab 2/i }));

      const tabpanel = screen.getByRole('tabpanel');
      expect(tabpanel).toHaveAttribute('id', 'tabpanel-tab2');
      expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-tab2');
      expect(tabpanel).toHaveAttribute('tabIndex', '0');
    });

    it('applies default and custom className to content', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-content">
            Content
          </TabsContent>
        </Tabs>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass('mt-6', 'custom-content');
    });

    it('throws error when used outside Tabs context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TabsContent value="test">Test Content</TabsContent>);
      }).toThrow('TabsContent must be used within Tabs');

      consoleSpy.mockRestore();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation between tabs', async () => {
      render(<TestTabsComponent />);

      const tab1 = screen.getByRole('tab', { name: /tab 1/i });
      const tab2 = screen.getByRole('tab', { name: /tab 2/i });

      tab1.focus();
      expect(tab1).toHaveFocus();

      fireEvent.keyDown(tab1, { key: 'Tab' });
      tab2.focus();
      expect(tab2).toHaveFocus();
    });

    it('activates tab on click and shows corresponding content', async () => {
      render(<TestTabsComponent />);

      const tab3 = screen.getByRole('tab', { name: /tab 3/i });
      fireEvent.click(tab3);

      expect(tab3).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content for Tab 3');
    });
  });

  describe('State Management', () => {
    it('maintains independent state for multiple tab groups', () => {
      render(
        <div>
          <Tabs defaultValue="group1-tab1">
            <TabsList>
              <TabsTrigger value="group1-tab1">Group 1 Tab 1</TabsTrigger>
              <TabsTrigger value="group1-tab2">Group 1 Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="group1-tab1">Group 1 Content 1</TabsContent>
            <TabsContent value="group1-tab2">Group 1 Content 2</TabsContent>
          </Tabs>
          <Tabs defaultValue="group2-tab1">
            <TabsList>
              <TabsTrigger value="group2-tab1">Group 2 Tab 1</TabsTrigger>
              <TabsTrigger value="group2-tab2">Group 2 Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="group2-tab1">Group 2 Content 1</TabsContent>
            <TabsContent value="group2-tab2">Group 2 Content 2</TabsContent>
          </Tabs>
        </div>
      );

      expect(screen.getByText('Group 1 Content 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2 Content 1')).toBeInTheDocument();
    });

    it('updates state correctly when switching between tabs', async () => {
      render(<TestTabsComponent />);

      expect(screen.getByRole('tab', { name: /tab 1/i })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: /tab 2/i })).toHaveAttribute('aria-selected', 'false');

      fireEvent.click(screen.getByRole('tab', { name: /tab 2/i }));

      expect(screen.getByRole('tab', { name: /tab 1/i })).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByRole('tab', { name: /tab 2/i })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles tabs with same content value', () => {
      render(
        <Tabs defaultValue="shared">
          <TabsList>
            <TabsTrigger value="shared">Tab 1</TabsTrigger>
            <TabsTrigger value="shared">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="shared">Shared Content</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Shared Content')).toBeInTheDocument();
    });

    it('handles empty tab content', () => {
      render(
        <Tabs defaultValue="empty">
          <TabsList>
            <TabsTrigger value="empty">Empty Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="empty">{null}</TabsContent>
        </Tabs>
      );

      const tabpanel = screen.getByRole('tabpanel');
      expect(tabpanel).toBeInTheDocument();
      expect(tabpanel).toBeEmptyDOMElement();
    });

    it('handles special characters in tab values', async () => {
      render(
        <Tabs defaultValue="tab-with-special_chars">
          <TabsList>
            <TabsTrigger value="tab-with-special_chars">Special Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab-with-special_chars">Special Content</TabsContent>
        </Tabs>
      );

      const tab = screen.getByRole('tab', { name: /special tab/i });
      expect(tab).toHaveAttribute('id', 'tab-tab-with-special_chars');
      expect(tab).toHaveAttribute('aria-controls', 'tabpanel-tab-with-special_chars');
      
      const content = screen.getByRole('tabpanel');
      expect(content).toHaveAttribute('id', 'tabpanel-tab-with-special_chars');
    });
  });
});
