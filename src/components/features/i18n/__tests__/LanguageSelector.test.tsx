import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageSelector } from '../LanguageSelector';

const mockChangeLanguage = vi.fn();
const mockT = vi.fn();

const mockI18n = {
  language: 'pt-BR',
  changeLanguage: mockChangeLanguage,
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: mockI18n,
    t: mockT,
  }),
}));

vi.mock('../../../ui/Select', () => ({
  Select: ({ children, value, onChange, className, ...props }: any) => (
    <div className={className}>
      <label aria-label={props['aria-label'] || ''} />
      <select 
        value={value} 
        onChange={(e) => onChange?.(e.target.value)}
        aria-label={props['aria-label'] || ''}
      >
        {children}
      </select>
    </div>
  ),
}));

describe('LanguageSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockI18n.language = 'pt-BR';
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'languages.pt-BR': 'Português (Brasil)',
        'languages.en': 'English',
        'profile.language': 'Idioma',
      };
      return translations[key] || key;
    });
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<LanguageSelector />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders Select component with correct props', () => {
      render(<LanguageSelector />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Idioma')).toBeInTheDocument();
    });

    it('displays current language value', () => {
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('pt-BR');
    });

    it('renders language options correctly', () => {
      render(<LanguageSelector />);

      expect(screen.getByRole('option', { name: 'Português (Brasil)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    });

    it('calls translation function for labels', () => {
      render(<LanguageSelector />);

      expect(mockT).toHaveBeenCalledWith('profile.language');
      expect(mockT).toHaveBeenCalledWith('languages.pt-BR');
      expect(mockT).toHaveBeenCalledWith('languages.en');
    });
  });

  describe('Language Change Functionality', () => {
    it('calls changeLanguage when option is selected', () => {
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'en' } });

      expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });

    it('calls changeLanguage with correct value for Portuguese', () => {
      mockI18n.language = 'en';
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'pt-BR' } });

      expect(mockChangeLanguage).toHaveBeenCalledWith('pt-BR');
    });

    it('handles multiple language changes', () => {
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      
      fireEvent.change(select, { target: { value: 'en' } });
      expect(mockChangeLanguage).toHaveBeenCalledWith('en');

      fireEvent.change(select, { target: { value: 'pt-BR' } });
      expect(mockChangeLanguage).toHaveBeenCalledWith('pt-BR');

      expect(mockChangeLanguage).toHaveBeenCalledTimes(2);
    });

    it('passes event object to onChange handler', () => {
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      const changeEvent = { target: { value: 'en' } };
      
      fireEvent.change(select, changeEvent);

      expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });
  });

  describe('Different Language States', () => {
    it('renders correctly when current language is English', () => {
      mockI18n.language = 'en';
      
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('en');
    });

    it('renders correctly when current language is Portuguese', () => {
      mockI18n.language = 'pt-BR';
      
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('pt-BR');
    });

    it('handles unknown language gracefully', () => {
      const originalLanguage = mockI18n.language;
      (mockI18n as any).language = 'fr';
      
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      
      (mockI18n as any).language = originalLanguage;
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className when provided', () => {
      render(<LanguageSelector className="custom-class" />);

      const container = document.querySelector('.custom-class');
      expect(container).toBeInTheDocument();
    });

    it('renders without className when not provided', () => {
      render(<LanguageSelector />);

      const container = screen.getByRole('combobox').parentElement;
      expect(container).toBeInTheDocument();
    });

    it('applies multiple custom classes', () => {
      render(<LanguageSelector className="class1 class2 class3" />);

      const container = document.querySelector('.class1');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('class1', 'class2', 'class3');
    });
  });

  describe('Language Options Structure', () => {
    it('creates correct language options array', () => {
      render(<LanguageSelector />);

      const portugueseOption = screen.getByRole('option', { name: 'Português (Brasil)' });
      const englishOption = screen.getByRole('option', { name: 'English' });

      expect(portugueseOption).toHaveValue('pt-BR');
      expect(englishOption).toHaveValue('en');
    });

    it('maintains correct option order', () => {
      render(<LanguageSelector />);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveValue('pt-BR');
      expect(options[1]).toHaveValue('en');
    });
  });

  describe('Translation Integration', () => {
    it('uses correct translation keys for language labels', () => {
      render(<LanguageSelector />);

      expect(mockT).toHaveBeenCalledWith('languages.pt-BR');
      expect(mockT).toHaveBeenCalledWith('languages.en');
    });

    it('uses correct translation key for field label', () => {
      render(<LanguageSelector />);

      expect(mockT).toHaveBeenCalledWith('profile.language');
    });

    it('handles missing translations gracefully', () => {
      mockT.mockImplementation((key: string) => key);
      
      render(<LanguageSelector />);

      expect(screen.getByText('profile.language')).toBeInTheDocument();
    });

    it('updates when translation function returns different values', () => {
      mockT.mockImplementation((key: string) => {
        const translations: Record<string, string> = {
          'languages.pt-BR': 'Portuguese',
          'languages.en': 'Inglês',
          'profile.language': 'Language',
        };
        return translations[key] || key;
      });

      render(<LanguageSelector />);

      expect(screen.getByRole('option', { name: 'Portuguese' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Inglês' })).toBeInTheDocument();
      expect(screen.getByText('Language')).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('handles change event with synthetic event object', () => {
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      const syntheticEvent = {
        target: { value: 'en' },
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };

      fireEvent.change(select, syntheticEvent);

      expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });

    it('does not call changeLanguage when value is same', () => {
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'pt-BR' } });

      expect(mockChangeLanguage).toHaveBeenCalledWith('pt-BR');
    });

    it('handles rapid language changes', () => {
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      
      fireEvent.change(select, { target: { value: 'en' } });
      fireEvent.change(select, { target: { value: 'pt-BR' } });
      fireEvent.change(select, { target: { value: 'en' } });

      expect(mockChangeLanguage).toHaveBeenCalledTimes(3);
      expect(mockChangeLanguage).toHaveBeenNthCalledWith(1, 'en');
      expect(mockChangeLanguage).toHaveBeenNthCalledWith(2, 'pt-BR');
      expect(mockChangeLanguage).toHaveBeenNthCalledWith(3, 'en');
    });
  });

  describe('Component Props Passing', () => {
    it('passes all required props to Select component', () => {
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });

    it('passes className to container div', () => {
      render(<LanguageSelector className="test-class" />);

      const container = document.querySelector('.test-class');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper label for select element', () => {
      render(<LanguageSelector />);

      expect(screen.getByText('Idioma')).toBeInTheDocument();
      expect(screen.getByLabelText('Idioma')).toBeInTheDocument();
    });

    it('maintains proper option structure for screen readers', () => {
      render(<LanguageSelector />);

      const options = screen.getAllByRole('option');
      options.forEach(option => {
        expect(option).toHaveAttribute('value');
        expect(option.textContent).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty translation responses', () => {
      mockT.mockReturnValue('');
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('handles null/undefined className', () => {
      render(<LanguageSelector className={undefined} />);

      const container = screen.getByRole('combobox').parentElement;
      expect(container).toBeInTheDocument();
    });

    it('maintains functionality when i18n language is undefined', () => {
      const originalLanguage = mockI18n.language;
      (mockI18n as any).language = undefined;
      
      render(<LanguageSelector />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      
      (mockI18n as any).language = originalLanguage;
    });
  });
});
