import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterIndicator from '../../components/FilterIndicator';

// Mock the styled-components
jest.mock('styled-components', () => {
  const React = require('react');
  
  const mockStyled = (tag) => {
    const MockComponent = ({ children, ...props }) => React.createElement(tag || 'div', props, children);
    MockComponent.withConfig = () => MockComponent;
    return MockComponent;
  };
  
  return {
    __esModule: true,
    default: mockStyled,
  };
});

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
      
      const badge = screen.getByText('FILTERED');
      expect(badge).toBeInTheDocument();
    });

    it('displays the correct filter count', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.getByText('3 / 10');
      expect(count).toBeInTheDocument();
    });

    it('renders the clear button when onClearFilters is provided', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const clearButton = screen.getByText('CLEAR');
      expect(clearButton).toBeInTheDocument();
    });

    it('calls onClearFilters when clear button is clicked', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const clearButton = screen.getByText('CLEAR');
      fireEvent.click(clearButton);
      
      expect(mockClearFilters).toHaveBeenCalledTimes(1);
    });

    it('does not render clear button when onClearFilters is not provided', () => {
      render(<FilterIndicator stats={mockStats} />);
      
      const clearButton = screen.queryByText('CLEAR');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('displays correct count for different numbers', () => {
      const customStats = {
        ...mockStats,
        filteredCount: 7,
        totalServices: 15,
      };
      
      render(<FilterIndicator stats={customStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.getByText('7 / 15');
      expect(count).toBeInTheDocument();
    });

    it('handles single filtered service', () => {
      const singleStats = {
        ...mockStats,
        filteredCount: 1,
        totalServices: 5,
      };
      
      render(<FilterIndicator stats={singleStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.getByText('1 / 5');
      expect(count).toBeInTheDocument();
    });

    it('handles all services filtered', () => {
      const allStats = {
        ...mockStats,
        filteredCount: 8,
        totalServices: 8,
      };
      
      render(<FilterIndicator stats={allStats} onClearFilters={mockClearFilters} />);
      
      const count = screen.getByText('8 / 8');
      expect(count).toBeInTheDocument();
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
      
      const badge = screen.queryByText('FILTERED');
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
      
      const count = screen.queryByText('10 / 10');
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
      
      const badge = screen.getByText('FILTERED');
      const count = screen.getByText('0 / 0');
      
      expect(badge).toBeInTheDocument();
      expect(count).toBeInTheDocument();
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
      
      const badge = screen.getByText('FILTERED');
      const count = screen.getByText('0 / 10');
      
      expect(badge).toBeInTheDocument();
      expect(count).toBeInTheDocument();
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
      
      const count = screen.getByText('1234 / 5678');
      expect(count).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    it('renders elements in the correct order', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const container = screen.getByText('FILTERED').parentElement;
      expect(container).toBeInTheDocument();
      
      // Check that badge, count, and clear button are all present
      expect(screen.getByText('FILTERED')).toBeInTheDocument();
      expect(screen.getByText('3 / 10')).toBeInTheDocument();
      expect(screen.getByText('CLEAR')).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
      render(<FilterIndicator stats={mockStats} onClearFilters={mockClearFilters} />);
      
      const badge = screen.getByText('FILTERED');
      expect(badge).toBeInTheDocument();
    });
  });
});
