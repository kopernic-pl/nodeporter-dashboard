/**
 * Tests for ServiceFilter component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import ServiceFilter from '../../components/ServiceFilter';
import * as filterHooks from '../../hooks/useServiceFilters';

// Mock the useServiceFilters hook
jest.mock('../../hooks/useServiceFilters');

describe('ServiceFilter', () => {
  const mockUpdateFilter = jest.fn();
  const mockResetFilters = jest.fn();
  const mockFilterServices = jest.fn();
  const mockGetVisibleTypesCount = jest.fn();
  const mockHasActiveFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock behavior
    filterHooks.useServiceFilters.mockReturnValue({
      filters: {
        ClusterIP: false,
        NodePort: true,
        LoadBalancer: true,
        ExternalName: true,
      },
      isLoading: false,
      error: null,
      updateFilter: mockUpdateFilter,
      resetFilters: mockResetFilters,
      filterServices: mockFilterServices,
      getVisibleTypesCount: mockGetVisibleTypesCount,
      hasActiveFilters: mockHasActiveFilters,
    });

    mockGetVisibleTypesCount.mockReturnValue(3);
    mockHasActiveFilters.mockReturnValue(false);
  });

  describe('rendering', () => {
    it('renders filter title', () => {
      render(<ServiceFilter />);
      
      expect(screen.getByText('Filter Services')).toBeInTheDocument();
    });

    it('renders all service type checkboxes', () => {
      render(<ServiceFilter />);
      
      expect(screen.getByLabelText('ClusterIP')).toBeInTheDocument();
      expect(screen.getByLabelText('NodePort')).toBeInTheDocument();
      expect(screen.getByLabelText('LoadBalancer')).toBeInTheDocument();
      expect(screen.getByLabelText('ExternalName')).toBeInTheDocument();
    });

    it('shows correct checkbox states', () => {
      render(<ServiceFilter />);
      
      const clusterIPCheckbox = screen.getByLabelText('ClusterIP');
      const nodePortCheckbox = screen.getByLabelText('NodePort');
      
      expect(clusterIPCheckbox).not.toBeChecked();
      expect(nodePortCheckbox).toBeChecked();
    });

    it('shows loading state', () => {
      filterHooks.useServiceFilters.mockReturnValue({
        filters: {},
        isLoading: true,
        error: null,
        updateFilter: mockUpdateFilter,
        resetFilters: mockResetFilters,
        filterServices: mockFilterServices,
        getVisibleTypesCount: mockGetVisibleTypesCount,
        hasActiveFilters: mockHasActiveFilters,
      });

      render(<ServiceFilter />);
      
      expect(screen.getByText('Loading filters...')).toBeInTheDocument();
    });

    it('shows error state', () => {
      filterHooks.useServiceFilters.mockReturnValue({
        filters: {},
        isLoading: false,
        error: new Error('Filter error'),
        updateFilter: mockUpdateFilter,
        resetFilters: mockResetFilters,
        filterServices: mockFilterServices,
        getVisibleTypesCount: mockGetVisibleTypesCount,
        hasActiveFilters: mockHasActiveFilters,
      });

      render(<ServiceFilter />);
      
      expect(screen.getByText('Filter unavailable')).toBeInTheDocument();
    });

    it('shows reset button when filters are active', () => {
      mockHasActiveFilters.mockReturnValue(true);
      
      render(<ServiceFilter />);
      
      expect(screen.getByText('Reset Filters')).toBeInTheDocument();
    });

    it('hides reset button when filters match defaults', () => {
      mockHasActiveFilters.mockReturnValue(false);
      
      render(<ServiceFilter />);
      
      expect(screen.queryByText('Reset Filters')).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls updateFilter when checkbox is changed', () => {
      render(<ServiceFilter />);
      
      const clusterIPCheckbox = screen.getByLabelText('ClusterIP');
      fireEvent.click(clusterIPCheckbox);
      
      expect(mockUpdateFilter).toHaveBeenCalledWith('ClusterIP', true);
    });

    it('calls updateFilter with correct values for different checkboxes', () => {
      render(<ServiceFilter />);
      
      const nodePortCheckbox = screen.getByLabelText('NodePort');
      fireEvent.click(nodePortCheckbox);
      
      expect(mockUpdateFilter).toHaveBeenCalledWith('NodePort', false);
    });

    it('calls resetFilters when reset button is clicked', () => {
      mockHasActiveFilters.mockReturnValue(true);
      
      render(<ServiceFilter />);
      
      const resetButton = screen.getByText('Reset Filters');
      fireEvent.click(resetButton);
      
      expect(mockResetFilters).toHaveBeenCalled();
    });

    it('handles keyboard interactions on checkboxes', () => {
      render(<ServiceFilter />);
      
      const clusterIPCheckbox = screen.getByLabelText('ClusterIP');
      fireEvent.keyDown(clusterIPCheckbox, { key: 'Enter' });
      
      expect(mockUpdateFilter).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('checkboxes have proper labels', () => {
      render(<ServiceFilter />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-checked');
      });
    });

    it('checkboxes are properly associated with labels', () => {
      render(<ServiceFilter />);
      
      const clusterIPLabel = screen.getByLabelText('ClusterIP');
      const clusterIPCheckbox = screen.getByRole('checkbox', { name: 'ClusterIP' });
      
      // Check that both elements exist and have the expected IDs/attributes
      expect(clusterIPCheckbox).toHaveAttribute('id', 'filter-ClusterIP');
      expect(clusterIPLabel).toBeInTheDocument();
    });

    it('reset button is keyboard accessible', () => {
      mockHasActiveFilters.mockReturnValue(true);
      
      render(<ServiceFilter />);
      
      const resetButton = screen.getByText('Reset Filters');
      expect(resetButton).toHaveAttribute('type', 'button');
    });
  });

  describe('hook integration', () => {
    it('uses useServiceFilters hook', () => {
      render(<ServiceFilter />);
      
      expect(filterHooks.useServiceFilters).toHaveBeenCalled();
    });

    it('passes through hook values correctly', () => {
      const customFilters = {
        ClusterIP: true,
        NodePort: false,
        LoadBalancer: true,
        ExternalName: false,
      };

      filterHooks.useServiceFilters.mockReturnValue({
        filters: customFilters,
        isLoading: false,
        error: null,
        updateFilter: mockUpdateFilter,
        resetFilters: mockResetFilters,
        filterServices: mockFilterServices,
        getVisibleTypesCount: mockGetVisibleTypesCount,
        hasActiveFilters: mockHasActiveFilters,
      });

      render(<ServiceFilter />);
      
      const clusterIPCheckbox = screen.getByLabelText('ClusterIP');
      const nodePortCheckbox = screen.getByLabelText('NodePort');
      
      expect(clusterIPCheckbox).toBeChecked();
      expect(nodePortCheckbox).not.toBeChecked();
    });
  });

  describe('component behavior', () => {
    it('renders without crashing', () => {
      expect(() => render(<ServiceFilter />)).not.toThrow();
    });

    it('handles rapid filter changes', () => {
      render(<ServiceFilter />);
      
      const clusterIPCheckbox = screen.getByLabelText('ClusterIP');
      
      // Rapidly toggle checkbox
      fireEvent.click(clusterIPCheckbox);
      fireEvent.click(clusterIPCheckbox);
      fireEvent.click(clusterIPCheckbox);
      
      expect(mockUpdateFilter).toHaveBeenCalledTimes(3);
    });

    it('maintains checkbox state during re-renders', () => {
      const { rerender } = render(<ServiceFilter />);
      
      const clusterIPCheckbox = screen.getByLabelText('ClusterIP');
      expect(clusterIPCheckbox).not.toBeChecked();
      
      // Simulate re-render with same props
      rerender(<ServiceFilter />);
      
      expect(clusterIPCheckbox).not.toBeChecked();
    });
  });
});
