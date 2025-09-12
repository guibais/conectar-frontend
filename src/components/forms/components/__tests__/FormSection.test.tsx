import { render, screen } from '@testing-library/react';
import { FormSection } from '../FormSection';

describe('FormSection', () => {
  const mockChildren = <div data-testid="section-content">Section Content</div>;

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(
        <FormSection title="Test Section">
          {mockChildren}
        </FormSection>
      );

      expect(screen.getByTestId('section-content')).toBeInTheDocument();
    });

    it('renders as a section element', () => {
      render(
        <FormSection title="Test Section">
          {mockChildren}
        </FormSection>
      );

      const section = screen.getByRole('region');
      expect(section.tagName).toBe('SECTION');
    });

    it('renders children content correctly', () => {
      render(
        <FormSection title="Test Section">
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </FormSection>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('Title and Accessibility', () => {
    it('creates screen reader accessible heading from title', () => {
      render(
        <FormSection title="User Information">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('User Information');
      expect(heading).toHaveClass('sr-only');
    });

    it('generates correct ID from title', () => {
      render(
        <FormSection title="User Information">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'user-information-section');
    });

    it('handles title with multiple words and spaces', () => {
      render(
        <FormSection title="Personal Contact Information Details">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'personal-contact-information-details-section');
    });

    it('handles title with special characters', () => {
      render(
        <FormSection title="User's Profile & Settings">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'user\'s-profile-&-settings-section');
    });

    it('associates section with heading via aria-labelledby', () => {
      render(
        <FormSection title="Account Settings">
          {mockChildren}
        </FormSection>
      );

      const section = screen.getByRole('region');
      const heading = screen.getByRole('heading', { level: 2 });
      
      expect(section).toHaveAttribute('aria-labelledby', 'account-settings-section');
      expect(heading).toHaveAttribute('id', 'account-settings-section');
    });
  });

  describe('Styling and Layout', () => {
    it('applies default styling classes', () => {
      render(
        <FormSection title="Test Section">
          {mockChildren}
        </FormSection>
      );

      const section = screen.getByRole('region');
      expect(section).toHaveClass(
        'bg-white',
        'rounded-lg',
        'shadow',
        'p-6'
      );
    });

    it('applies custom className when provided', () => {
      render(
        <FormSection title="Test Section" className="custom-section-class">
          {mockChildren}
        </FormSection>
      );

      const section = screen.getByRole('region');
      expect(section).toHaveClass('custom-section-class');
      expect(section).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'p-6');
    });

    it('applies multiple custom classes', () => {
      render(
        <FormSection title="Test Section" className="class1 class2 class3">
          {mockChildren}
        </FormSection>
      );

      const section = screen.getByRole('region');
      expect(section).toHaveClass('class1', 'class2', 'class3');
    });

    it('handles empty className', () => {
      render(
        <FormSection title="Test Section" className="">
          {mockChildren}
        </FormSection>
      );

      const section = screen.getByRole('region');
      expect(section).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'p-6');
    });

    it('handles undefined className', () => {
      render(
        <FormSection title="Test Section" className={undefined}>
          {mockChildren}
        </FormSection>
      );

      const section = screen.getByRole('region');
      expect(section).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'p-6');
    });
  });

  describe('Complex Children', () => {
    it('renders nested components correctly', () => {
      const NestedComponent = () => (
        <div data-testid="nested">
          <h3>Nested Title</h3>
          <p>Nested paragraph</p>
        </div>
      );

      render(
        <FormSection title="Complex Section">
          <NestedComponent />
        </FormSection>
      );

      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByText('Nested Title')).toBeInTheDocument();
      expect(screen.getByText('Nested paragraph')).toBeInTheDocument();
    });

    it('renders form elements as children', () => {
      render(
        <FormSection title="Form Section">
          <label htmlFor="test-input">Test Input</label>
          <input id="test-input" data-testid="form-input" />
          <button data-testid="form-button">Submit</button>
        </FormSection>
      );

      expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
      expect(screen.getByTestId('form-input')).toBeInTheDocument();
      expect(screen.getByTestId('form-button')).toBeInTheDocument();
    });

    it('renders multiple section levels', () => {
      render(
        <FormSection title="Parent Section">
          <div data-testid="parent-content">Parent Content</div>
          <FormSection title="Child Section">
            <div data-testid="child-content">Child Content</div>
          </FormSection>
        </FormSection>
      );

      expect(screen.getByTestId('parent-content')).toBeInTheDocument();
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      
      const sections = screen.getAllByRole('region');
      expect(sections).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty title string', () => {
      render(
        <FormSection title="">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('');
      expect(heading).toHaveAttribute('id', '-section');
    });

    it('handles title with only spaces', () => {
      render(
        <FormSection title="   ">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveAttribute('id', '--section');
    });

    it('handles single word title', () => {
      render(
        <FormSection title="Profile">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'profile-section');
    });

    it('handles title with numbers', () => {
      render(
        <FormSection title="Section 123 Test">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'section-123-test-section');
    });

    it('handles null children gracefully', () => {
      render(
        <FormSection title="Empty Section">
          {null}
        </FormSection>
      );

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('handles undefined children gracefully', () => {
      render(
        <FormSection title="Empty Section">
          {undefined}
        </FormSection>
      );

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('handles mixed content types as children', () => {
      render(
        <FormSection title="Mixed Section">
          <span>Text content</span>
          <div data-testid="div-child">Div child</div>
          <span>42</span>
          <span data-testid="span-child">Span child</span>
        </FormSection>
      );

      expect(screen.getByText('Text content')).toBeInTheDocument();
      expect(screen.getByTestId('div-child')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByTestId('span-child')).toBeInTheDocument();
    });
  });

  describe('Title Processing', () => {
    it('converts uppercase title to lowercase for ID', () => {
      render(
        <FormSection title="UPPERCASE TITLE">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'uppercase-title-section');
      expect(heading).toHaveTextContent('UPPERCASE TITLE');
    });

    it('handles mixed case title', () => {
      render(
        <FormSection title="MiXeD CaSe TiTlE">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'mixed-case-title-section');
      expect(heading).toHaveTextContent('MiXeD CaSe TiTlE');
    });

    it('handles title with consecutive spaces', () => {
      render(
        <FormSection title="Title    With    Spaces">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'title-with-spaces-section');
    });

    it('handles title with leading and trailing spaces', () => {
      render(
        <FormSection title="  Trimmed Title  ">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', '-trimmed-title--section');
      expect(heading).toHaveTextContent('Trimmed Title');
    });
  });

  describe('Accessibility Compliance', () => {
    it('provides proper semantic structure', () => {
      render(
        <FormSection title="Accessible Section">
          {mockChildren}
        </FormSection>
      );

      const section = screen.getByRole('region');
      const heading = screen.getByRole('heading', { level: 2 });
      
      expect(section.tagName).toBe('SECTION');
      expect(heading.tagName).toBe('H2');
    });

    it('ensures heading is hidden from visual users but available to screen readers', () => {
      render(
        <FormSection title="Screen Reader Title">
          {mockChildren}
        </FormSection>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('sr-only');
    });

    it('maintains proper heading hierarchy', () => {
      render(
        <div>
          <h1>Main Title</h1>
          <FormSection title="Section Title">
            {mockChildren}
          </FormSection>
        </div>
      );

      const mainHeading = screen.getByRole('heading', { level: 1 });
      const sectionHeading = screen.getByRole('heading', { level: 2 });
      
      expect(mainHeading).toBeInTheDocument();
      expect(sectionHeading).toBeInTheDocument();
    });
  });
});
