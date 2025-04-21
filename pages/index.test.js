import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './index';

describe('Home page', () => {
  it('shows "No services loaded" when empty', () => {
    render(<Home />);
    expect(screen.getByText(/No services loaded/i)).toBeInTheDocument();
  });
});
