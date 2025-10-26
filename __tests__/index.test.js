import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    // Click the "Load" button (initial state)
    await userEvent.click(screen.getByRole('button', { name: /load/i }));
    // Look for the exact error message we set
    expect(await screen.findByText(errorMsg, { exact: false })).toBeInTheDocument();
  });

  it('changes button text from Load to Refresh after first click', async () => {
    render(<Home />);
    // Button should initially say "Load"
    const loadButton = screen.getByRole('button', { name: /load/i });
    expect(loadButton).toBeInTheDocument();
    // Click the button
    await userEvent.click(loadButton);
    // After click, should say "Refresh"
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });
});
