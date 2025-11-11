import styled from 'styled-components';

const Button = styled.button`
  font-family: 'Press Start 2P', 'VT323', monospace;
  background: var(--retro-accent2);
  color: var(--retro-bg1);
  border: 4px solid var(--retro-accent1);
  border-radius: 0;
  padding: 0.7rem 2rem;
  font-size: 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
  box-shadow:
    4px 4px 0 var(--retro-accent1),
    8px 8px 0 var(--retro-bg1);
  transition:
    background 0.1s,
    color 0.1s;

  &:active {
    background: var(--retro-accent1);
    color: var(--retro-accent2);
    box-shadow:
      2px 2px 0 var(--retro-accent2),
      4px 4px 0 var(--retro-bg1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Light mode */
  @media (prefers-color-scheme: light) {
    background: var(--retro-accent1);
    color: var(--retro-surface);
    border: 4px solid var(--retro-accent2);
    box-shadow:
      4px 4px 0 var(--retro-accent2),
      8px 8px 0 var(--retro-border);

    &:active {
      background: var(--retro-accent2);
      color: var(--retro-touch);
      box-shadow:
        2px 2px 0 var(--retro-accent1),
        4px 4px 0 var(--retro-border);
    }
  }
`;

export default Button;
