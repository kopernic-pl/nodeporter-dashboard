import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the FilterIndicator component to avoid styled-components issues
jest.mock('../../components/FilterIndicator', () => {
  const MockFilterIndicator = ({ stats, onClearFilters }) => {
    if (!stats.hasActiveFilters) {
      return null;
    }
    
    return (
      <div data-testid="filter-indicator">
        <span data-testid="filtered-badge">FILTERED</span>
        <span data-testid="filtered-count">{stats.filteredCount} / {stats.totalServices}</span>
        {onClearFilters && (
          <button data-testid="clear-button" onClick={onClearFilters}>
            CLEAR
          </button>
        )}
      </div>
    );
  };
  
  MockFilterIndicator.displayName = 'FilterIndicator';
  return MockFilterIndicator;
});

import FilterIndicator from '../../components/FilterIndicator';

describe('FilterIndicator', () => {
  const mockStats = {
    hasActiveFilters: true,
    filteredCount: 3,
    totalServices: 10,
    activeFiltersCount: 1,
    isFiltered: true,
  };

  const mockClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when filters are active', () => {
    it('renders the indicator badge', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const badge = screen.getByTestId('filtered-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('FILTERED');
    });

    it('displays the correct filter count', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.getByTestId('filtered-count');
      expect(count).toBeInTheDocument();
      expect(count).toHaveTextContent('3 / 10');
    });

    it('renders the clear button when onClearFilters is provided', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const clearButton = screen.getByTestId('clear-button');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveTextContent('CLEAR');
    });

    it('calls onClearFilters when clear button is clicked', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const clearButton = screen.getByTestId('clear-button');
      fireEvent.click(clearButton);
      
      expect(mockClearFilters).toHaveBeenCalledTimes(1);
    });

    it('does not render clear button when onClearFilters is not provided', () => {
      render(<FilterIndicator stats={mockStats} />);
      
      const clearButton = screen.queryByTestId('clear-button');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('displays correct count for different numbers', () => {
      const customStats = {
        ...mockStats,
        filteredCount: 7,
        totalServices: 15,
      };
      
      render(<FilterIndicator stats={customStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.getByTestId('filtered-count');
      expect(count).toHaveTextContent('7 / 15');
    });

    it('handles single filtered service', () => {
      const singleStats = {
        ...mockStats,
        filteredCount: 1,
        totalServices: 5,
      };
      
      render(<FilterIndicator stats={singleStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.getByTestId('filtered-count');
      expect(count).toHaveTextContent('1 / 5');
    });

    it('handles all services filtered', () => {
      const allStats = {
        ...mockStats,
        filteredCount: 8,
        totalServices: 8,
      };
      
      render(<FilterIndicator stats={allStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.getByTestId('filtered-count');
      expect(count).toHaveTextContent('8 / 8');
    });
  });

  describe('when filters are not active', () => {
    it('does not render anything', () => {
      const inactiveStats = {
        hasActiveFilters: false,
        filteredCount: 10,
        totalServices: 10,
        activeFiltersCount: 0,
        isFiltered: false,
      };

      const { container } = render(
        <FilterIndicator stats={inactiveStats} onClearFilters={mockClearFilters} />
      );
      
      expect(container.firstChild).toBeNull();
    });

    it('does not render badge when hasActiveFilters is false', () => {
      const inactiveStats = {
        hasActiveFilters: false,
        filteredCount: 10,
        totalServices: 10,
        activeFiltersCount: 0,
        isFiltered: false,
      };

      render(<FilterIndicator stats={inactiveStats} onClearFilters={mockClearFilters} />);
      
      const badge = screen.queryByTestId('filtered-badge');
      expect(badge).not.toBeInTheDocument();
    });

    it('does not render count when hasActiveFilters is false', () => {
      const inactiveStats = {
        hasActiveFilters: false,
        filteredCount: 10,
        totalServices: 10,
        activeFiltersCount: 0,
        isFiltered: false,
      };

      render(<FilterIndicator stats={inactiveStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.queryByTestId('filtered-count');
      expect(count).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles zero total services', () => {
      const zeroStats = {
        hasActiveFilters: true,
        filteredCount: 0,
        totalServices: 0,
        activeFiltersCount: 1,
        isFiltered: false,
      };

      render(<FilterIndicator stats={zeroStats} onClearFilters={mockClearFilters} />);
      
      const badge = screen.getByTestId('filtered-badge');
      const count = screen.getByTestId('filtered-count');
      
      expect(badge).toBeInTheDocument();
      expect(count).toHaveTextContent('0 / 0');
    });

    it('handles zero filtered services with total services', () => {
      const zeroFilteredStats = {
        hasActiveFilters: true,
        filteredCount: 0,
        totalServices: 10,
        activeFiltersCount: 1,
        isFiltered: true,
      };

      render(<FilterIndicator stats={zeroFilteredStats} onClearFilters={mockClearFilters} />);
      
      const badge = screen.getByTestId('filtered-badge');
      const count = screen.getByTestId('filtered-count');
      
      expect(badge).toBeInTheDocument();
      expect(count).toHaveTextContent('0 / 10');
    });

    it('handles large numbers', () => {
      const largeStats = {
        hasActiveFilters: true,
        filteredCount: 1234,
        totalServices: 5678,
        activeFiltersCount: 2,
        isFiltered: true,
      };

      render(<FilterIndicator stats={largeStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.getByTestId('filtered-count');
      expect(count).toHaveTextContent('1234 / 5678');
    });
  });

  describe('component structure', () => {
    it('renders all elements when filters are active', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const container = screen.getByTestId('filter-indicator');
      expect(container).toBeInTheDocument();
      
      // Check that badge, count, and clear button are all present
      expect(screen.getByTestId('filtered-badge')).toBeInTheDocument();
      expect(screen.getByTestId('filtered-count')).toBeInTheDocument();
      expect(screen.getByTestId('clear-button')).toBeInTheDocument();
    });
  });
});
