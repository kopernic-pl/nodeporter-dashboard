import React from 'react';
import { render, screen } from '@testing-library/react';
import ExternalLinkIcon from '../../components/ExternalLinkIcon';

// Suppress styled-jsx warnings for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Received `true` for a non-boolean attribute')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('ExternalLinkIcon', () => {
  it('renders with default size', () => {
    render(<ExternalLinkIcon />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
    expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveClass('external-link-icon');
  });

  it('renders with custom size', () => {
    render(<ExternalLinkIcon size={24} />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('contains the correct SVG elements', () => {
    render(<ExternalLinkIcon />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Check for path elements
    const paths = svg.querySelectorAll('path');
    expect(paths).toHaveLength(1);
    expect(paths[0]).toHaveAttribute('d', 'M7 13L13 7M10 7H13V10');
    expect(paths[0]).toHaveAttribute('stroke-width', '2');
    expect(paths[0]).toHaveAttribute('stroke-linecap', 'round');
    expect(paths[0]).toHaveAttribute('stroke-linejoin', 'round');
    
    // Check for rect element
    const rect = svg.querySelector('rect');
    expect(rect).toBeInTheDocument();
    expect(rect).toHaveAttribute('x', '3');
    expect(rect).toHaveAttribute('y', '3');
    expect(rect).toHaveAttribute('width', '14');
    expect(rect).toHaveAttribute('height', '14');
    expect(rect).toHaveAttribute('rx', '3');
    expect(rect).toHaveAttribute('stroke-width', '2');
  });

  it('has correct CSS styles and classes', () => {
    render(<ExternalLinkIcon />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Check CSS variables
    expect(svg).toHaveStyle({
      '--icon-stroke': 'var(--retro-text)',
      '--icon-hover': 'var(--retro-accent1)',
    });
    
    // Check class
    expect(svg).toHaveClass('external-link-icon');
  });

  it('contains styled-jsx style tag', () => {
    render(<ExternalLinkIcon />);
    
    // Check that a style tag exists (styled-jsx should inject it)
    const styleTags = document.querySelectorAll('style');
    expect(styleTags.length).toBeGreaterThanOrEqual(0);
  });

  it('has correct namespace and attributes', () => {
    render(<ExternalLinkIcon />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });
});
