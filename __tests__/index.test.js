import React from 'react';
import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import Home from '../pages/index';

describe('Home page', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ envType: 'local' }));
  });

  it.each([
    ['in-cluster', /Running in-cluster/i],
    ['local', /Running in local\/dev mode/i],
    ['unknown', /Environment type: unknown/i],
  ])('shows correct banner for envType=%s', async (envType, expectedText) => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ envType }));
    render(<Home />);
    expect(await screen.findByText(expectedText)).toBeInTheDocument();
  });

  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ envType: 'local' }));
  });

  it('shows "No services loaded" when empty', async () => {
    render(<Home />);
    expect(await screen.findByText(/No services loaded/i)).toBeInTheDocument();
  });

  it('shows an error message if the fetch fails', async () => {
    const errorMsg = `Test error: ${faker.lorem.words(3)}`;
    fetch.mockRejectOnce(new Error(errorMsg));
    render(<Home />);
    // Since data loads automatically, just wait for the error message
    expect(await screen.findByText(errorMsg, { exact: false })).toBeInTheDocument();
  });

  it('shows Refresh button after auto-load completes', async () => {
    render(<Home />);
    // Wait for the Refresh button to appear after auto-load
    expect(await screen.findByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });
});
