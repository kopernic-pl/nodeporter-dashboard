import styled from 'styled-components';

const Error = styled.div`
  color: var(--retro-text);
  background: #ff003c;
  border: 3px solid var(--retro-touch);
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-family: 'Press Start 2P', 'VT323', monospace;
  font-size: 0.9rem;
  text-shadow: 1px 1px var(--retro-bg1);
  box-shadow:
    2px 2px 0 var(--retro-touch),
    4px 4px 0 var(--retro-bg1);
`;

export default Error;