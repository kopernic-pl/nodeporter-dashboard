import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Home page', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ envType: 'local' }));
  });

  it('shows "No services loaded" when empty', async () => {
    render(<Home />);
    expect(await screen.findByText(/No services loaded/i)).toBeInTheDocument();
  });
});
