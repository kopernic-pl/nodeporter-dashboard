import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { palette } from '../styles/palette';

/**
 * FetchTime displays the fetch duration in seconds, styled as a floating widget.
 * @param {Object} props
 * @param {number|null} props.fetchTime - Duration in milliseconds, or null to hide.
 */
const StyledFetchTime = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  background: rgba(34, 34, 34, 0.95); /* fallback for old browsers */
  background: rgba(34, 34, 34, 0.95);
  color: ${palette.cyan};
  font-family: 'Press Start 2P', 'VT323', monospace;
  font-size: 0.95rem;
  padding: 0.6rem 1.2rem;
  border-top-left-radius: 8px;
  z-index: 1000;
  box-shadow: 0 0 8px ${palette.cyan};
`;

export default function FetchTime({ fetchTime }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (fetchTime !== null) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [fetchTime]);

  if (!visible) return null;

  return <StyledFetchTime>Fetch time: {(fetchTime / 1000).toFixed(2)}s</StyledFetchTime>;
}
