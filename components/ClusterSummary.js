import styled from 'styled-components';

const ClusterSummary = styled.div`
  margin-bottom: 1rem;
  font-family: monospace;
  font-size: 1rem;
  color: var(--retro-accent2);
  text-shadow: 1px 1px var(--retro-bg1);

  /* Light mode */
  @media (prefers-color-scheme: light) {
    text-shadow: 1px 1px var(--retro-border);
  }
`;

export default ClusterSummary;
