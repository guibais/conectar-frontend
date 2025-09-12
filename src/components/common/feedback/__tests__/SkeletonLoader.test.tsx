import { render, screen } from '@testing-library/react';
import { SkeletonLoader, TableSkeleton, CardSkeleton } from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders with proper accessibility attributes', () => {
    render(<SkeletonLoader />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-live', 'polite');
    expect(skeleton).toHaveAttribute('aria-label', 'Carregando conteúdo');
  });

  it('renders default single row when no rows specified', () => {
    render(<SkeletonLoader />);
    
    const skeleton = screen.getByRole('status');
    const skeletonBars = skeleton.querySelectorAll('[aria-hidden="true"]');
    expect(skeletonBars).toHaveLength(1);
  });

  it('renders specified number of rows', () => {
    const rowCount = 3;
    render(<SkeletonLoader rows={rowCount} />);
    
    const skeleton = screen.getByRole('status');
    const skeletonBars = skeleton.querySelectorAll('[aria-hidden="true"]');
    expect(skeletonBars).toHaveLength(rowCount);
  });

  it('applies default height (h-4) when not specified', () => {
    render(<SkeletonLoader />);
    
    const skeleton = screen.getByRole('status');
    const skeletonBar = skeleton.querySelector('[aria-hidden="true"]');
    expect(skeletonBar).toHaveClass('h-4');
  });

  it('applies custom height when specified', () => {
    const customHeight = 'h-8';
    render(<SkeletonLoader height={customHeight} />);
    
    const skeleton = screen.getByRole('status');
    const skeletonBar = skeleton.querySelector('[aria-hidden="true"]');
    expect(skeletonBar).toHaveClass(customHeight);
  });

  it('applies default styling classes', () => {
    render(<SkeletonLoader />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('animate-pulse');
    
    const skeletonBar = skeleton.querySelector('[aria-hidden="true"]');
    expect(skeletonBar).toHaveClass('bg-gray-200', 'rounded-md');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-skeleton-class';
    render(<SkeletonLoader className={customClass} />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass(customClass);
  });

  it('applies margin top to subsequent rows', () => {
    render(<SkeletonLoader rows={3} />);
    
    const skeleton = screen.getByRole('status');
    const skeletonBars = skeleton.querySelectorAll('[aria-hidden="true"]');
    
    expect(skeletonBars[0]).not.toHaveClass('mt-2');
    expect(skeletonBars[1]).toHaveClass('mt-2');
    expect(skeletonBars[2]).toHaveClass('mt-2');
  });

  it('handles zero rows gracefully', () => {
    render(<SkeletonLoader rows={0} />);
    
    const skeleton = screen.getByRole('status');
    const skeletonBars = skeleton.querySelectorAll('[aria-hidden="true"]');
    expect(skeletonBars).toHaveLength(0);
  });
});

describe('TableSkeleton', () => {
  it('renders with proper accessibility attributes', () => {
    render(<TableSkeleton />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-live', 'polite');
    expect(skeleton).toHaveAttribute('aria-label', 'Carregando tabela');
  });

  it('renders table structure with header and rows', () => {
    render(<TableSkeleton />);
    
    const skeleton = screen.getByRole('status');
    const table = skeleton.querySelector('.bg-white.rounded-lg.border');
    expect(table).toBeInTheDocument();
    
    const header = table?.querySelector('.px-6.py-4.border-b');
    expect(header).toBeInTheDocument();
    
    const rows = table?.querySelectorAll('.px-6.py-4.border-b.border-gray-100');
    expect(rows).toHaveLength(5);
  });

  it('renders skeleton bars in each row', () => {
    render(<TableSkeleton />);
    
    const skeleton = screen.getByRole('status');
    const skeletonBars = skeleton.querySelectorAll('[aria-hidden="true"]');
    expect(skeletonBars.length).toBeGreaterThan(20);
  });

  it('applies proper styling classes', () => {
    render(<TableSkeleton />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('animate-pulse');
    
    const table = skeleton.querySelector('.bg-white');
    expect(table).toHaveClass('rounded-lg', 'border', 'border-gray-200', 'overflow-hidden');
  });
});

describe('CardSkeleton', () => {
  it('renders with proper accessibility attributes', () => {
    render(<CardSkeleton />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-live', 'polite');
    expect(skeleton).toHaveAttribute('aria-label', 'Carregando card');
  });

  it('renders card structure with title and content lines', () => {
    render(<CardSkeleton />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('animate-pulse', 'bg-white', 'rounded-lg', 'border', 'border-gray-200', 'p-6');
    
    const skeletonBars = skeleton.querySelectorAll('[aria-hidden="true"]');
    expect(skeletonBars).toHaveLength(4);
  });

  it('renders title skeleton with proper width', () => {
    render(<CardSkeleton />);
    
    const skeleton = screen.getByRole('status');
    const titleSkeleton = skeleton.querySelector('.h-6.bg-gray-200.rounded.w-1\\/3');
    expect(titleSkeleton).toBeInTheDocument();
  });

  it('renders content skeletons with varying widths', () => {
    render(<CardSkeleton />);
    
    const skeleton = screen.getByRole('status');
    const contentArea = skeleton.querySelector('.space-y-3');
    expect(contentArea).toBeInTheDocument();
    
    const contentBars = contentArea?.querySelectorAll('[aria-hidden="true"]');
    expect(contentBars).toHaveLength(3);
    
    expect(contentBars?.[0]).toHaveClass('w-full');
    expect(contentBars?.[1]).toHaveClass('w-3/4');
    expect(contentBars?.[2]).toHaveClass('w-1/2');
  });

  it('applies proper spacing and styling', () => {
    render(<CardSkeleton />);
    
    const skeleton = screen.getByRole('status');
    const titleSkeleton = skeleton.querySelector('.mb-4');
    expect(titleSkeleton).toBeInTheDocument();
    
    const contentArea = skeleton.querySelector('.space-y-3');
    expect(contentArea).toBeInTheDocument();
  });
});
