import React from 'react';
import { render, screen } from '@testing-library/react';
import MyApp, { reportWebVitals } from '../../pages/_app';

// Mock the Next.js web vitals hook
jest.mock('next/web-vitals', () => ({
  useReportWebVitals: jest.fn(),
}));

// Mock the CSS imports
jest.mock('../../styles/globals.css', () => ({}));
jest.mock('@fontsource/press-start-2p', () => ({}));
jest.mock('@fontsource/vt323', () => ({}));

describe('MyApp', () => {
  const mockComponent = jest.fn(() => <div data-testid="page-content">Page Content</div>);
  const mockPageProps = { someProp: 'value' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with page props', () => {
    const { useReportWebVitals } = require('next/web-vitals');
    useReportWebVitals.mockImplementation((callback) => {
      // Simulate the hook calling the callback
      callback({ name: 'FCP', value: 1000 });
    });

    render(<MyApp Component={mockComponent} pageProps={mockPageProps} />);

    expect(mockComponent).toHaveBeenCalledWith(mockPageProps, undefined);
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('renders the footer with version from environment variable', () => {
    // Set environment variable
    const originalVersion = process.env.NEXT_PUBLIC_VERSION;
    process.env.NEXT_PUBLIC_VERSION = '1.2.3';

    const { useReportWebVitals } = require('next/web-vitals');
    useReportWebVitals.mockImplementation(() => {});

    render(<MyApp Component={mockComponent} pageProps={mockPageProps} />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('retro-footer');

    const versionText = screen.getByText(/NodePorter/);
    expect(versionText).toBeInTheDocument();
    expect(versionText).toHaveTextContent('NodePorter v1.2.3');

    // Restore original environment variable
    process.env.NEXT_PUBLIC_VERSION = originalVersion;
  });

  it('renders the footer with dev version when environment variable is not set', () => {
    // Ensure environment variable is not set
    const originalVersion = process.env.NEXT_PUBLIC_VERSION;
    delete process.env.NEXT_PUBLIC_VERSION;

    const { useReportWebVitals } = require('next/web-vitals');
    useReportWebVitals.mockImplementation(() => {});

    render(<MyApp Component={mockComponent} pageProps={mockPageProps} />);

    const versionText = screen.getByText(/NodePorter/);
    expect(versionText).toBeInTheDocument();
    expect(versionText).toHaveTextContent('NodePorter dev');

    // Restore original environment variable
    process.env.NEXT_PUBLIC_VERSION = originalVersion;
  });

  it('renders the GitHub link in footer', () => {
    const { useReportWebVitals } = require('next/web-vitals');
    useReportWebVitals.mockImplementation(() => {});

    render(<MyApp Component={mockComponent} pageProps={mockPageProps} />);

    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/kopernic-pl/nodeporter-dashboard');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls useReportWebVitals with callback', () => {
    const { useReportWebVitals } = require('next/web-vitals');
    const mockCallback = jest.fn();
    useReportWebVitals.mockImplementation((callback) => {
      mockCallback(callback);
    });

    render(<MyApp Component={mockComponent} pageProps={mockPageProps} />);

    expect(useReportWebVitals).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('calls reportWebVitals when useReportWebVitals callback is executed', () => {
    const { useReportWebVitals } = require('next/web-vitals');
    const mockMetric = { name: 'LCP', value: 2000 };
    
    useReportWebVitals.mockImplementation((callback) => {
      callback(mockMetric);
    });

    // Mock console.log to capture the output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<MyApp Component={mockComponent} pageProps={mockPageProps} />);

    expect(consoleSpy).toHaveBeenCalledWith('[Web Vitals]', mockMetric);

    consoleSpy.mockRestore();
  });
});

describe('reportWebVitals', () => {
  it('is a function', () => {
    expect(typeof reportWebVitals).toBe('function');
  });

  it('can be called with a metric object', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const metric = { name: 'FCP', value: 1000 };
    
    expect(() => {
      reportWebVitals(metric);
    }).not.toThrow();
    
    consoleSpy.mockRestore();
  });

  it('handles different metric objects', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const metrics = [
      { name: 'FCP', value: 1000 },
      { name: 'LCP', value: 2000 },
      { name: 'CLS', value: 0.1 },
      { name: 'FID', value: 100 }
    ];
    
    metrics.forEach(metric => {
      expect(() => {
        reportWebVitals(metric);
      }).not.toThrow();
    });
    
    consoleSpy.mockRestore();
  });

  });
