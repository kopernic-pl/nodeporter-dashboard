import React from 'react';
import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import FetchTime from './FetchTime';

describe('FetchTime', () => {
  it('renders nothing if fetchTime is null', () => {
    const { container } = render(<FetchTime fetchTime={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders fetch time in seconds when fetchTime is a number', async () => {
    const ms = faker.number.int({ min: 1000, max: 9999 });
    render(<FetchTime fetchTime={ms} />);
    const expectedValueString = (ms / 1000).toFixed(2);
    const textMatcher = (content) => {
      const normalizedActual = content.replace(/\s+/g, '');
      const baseExpectedPattern = `Fetch time: ${expectedValueString}s`;
      const normalizedExpected = baseExpectedPattern.replace(/\s+/g, '');
      return normalizedActual.toLowerCase() === normalizedExpected.toLowerCase();
    };
    const element = await screen.findByText(textMatcher);
    expect(element).toBeInTheDocument();
  });

  it('rounds fetch time to two decimals', async () => {
    const ms = faker.number.int({ min: 1000, max: 9999 });
    render(<FetchTime fetchTime={ms} />);
    const expectedValueString = (ms / 1000).toFixed(2);
    const textMatcher = (content) => {
      const normalizedActual = content.replace(/\s+/g, '');
      const baseExpectedPattern = `Fetch time: ${expectedValueString}s`;
      const normalizedExpected = baseExpectedPattern.replace(/\s+/g, '');
      return normalizedActual.toLowerCase() === normalizedExpected.toLowerCase();
    };
    const element = await screen.findByText(textMatcher);
    expect(element).toBeInTheDocument();
  });
});
