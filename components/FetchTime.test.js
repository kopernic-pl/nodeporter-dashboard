import React from 'react';
import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import FetchTime from './FetchTime';

describe('FetchTime', () => {
  it('renders nothing if fetchTime is null', () => {
    const { container } = render(<FetchTime fetchTime={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders fetch time in seconds when fetchTime is a number', () => {
    const ms = faker.number.int({ min: 1000, max: 9999 });
    render(<FetchTime fetchTime={ms} />);
    expect(screen.getByText(/fetch time:/i)).toHaveTextContent(
      `Fetch time: ${(ms / 1000).toFixed(2)}s`
    );
  });

  it('rounds fetch time to two decimals', () => {
    const ms = faker.number.int({ min: 1000, max: 9999 });
    render(<FetchTime fetchTime={ms} />);
    expect(screen.getByText(/fetch time:/i)).toHaveTextContent(
      `Fetch time: ${(ms / 1000).toFixed(2)}s`
    );
  });
});
