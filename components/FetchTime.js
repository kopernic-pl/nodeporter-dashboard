import React from 'react';
import styled from 'styled-components';

/**
 * FetchTime displays the fetch duration in seconds, styled as a floating widget.
 * @param {Object} props
 * @param {number|null} props.fetchTime - Duration in milliseconds, or null to hide.
 */
const StyledFetchTime = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  background: rgba(34, 34, 34, 0.95);
  color: #00fff7;
  font-family: 'Press Start 2P', 'VT323', monospace;
  font-size: 0.95rem;
  padding: 0.6rem 1.2rem;
  border-top-left-radius: 8px;
  z-index: 1000;
  box-shadow: 0 0 8px #00fff7;
`;


export default function FetchTime({ fetchTime }) {
  if (fetchTime === null) return null;
  return (
    <StyledFetchTime>
      Fetch time: {(fetchTime / 1000).toFixed(2)}s
    </StyledFetchTime>
  );
}
