import styled from 'styled-components';

const EnvironmentBanner = ({ envType }) => {
  if (!envType) {
    return null;
  }

  const BaseBanner = styled.div`
    font-family: 'Press Start 2P', 'VT323', monospace;
    font-size: 1rem;
    letter-spacing: 1px;
    text-align: center;
    padding: 0.7rem 0;
    margin-bottom: 1.5rem;
  `;
  let StyledBanner;
  let message;

  switch (envType) {
    case 'in-cluster':
      StyledBanner = styled(BaseBanner)`
        background: var(--retro-border);
        color: var(--retro-bg1);
        border-bottom: 4px solid var(--retro-touch);
        box-shadow: 0 2px 12px var(--retro-border);
        text-shadow: 1px 1px var(--retro-touch);
      `;
      message = 'Running in-cluster (production/Kubernetes)';
      break;
    case 'local':
      StyledBanner = styled(BaseBanner)`
        background: var(--retro-accent1);
        color: var(--retro-text);
        border-bottom: 4px solid var(--retro-touch);
        box-shadow: 0 2px 12px var(--retro-accent1);
        text-shadow: 1px 1px var(--retro-bg1);
      `;
      message = 'Running in local/dev mode';
      break;
    default: // 'unknown' or any other case
      StyledBanner = styled(BaseBanner)`
        background: #888;
        color: #fff;
        border-bottom: 4px solid #555;
        box-shadow: 0 2px 12px #888;
        text-shadow: 1px 1px #333;
      `;
      message = 'Environment type: unknown';
      break;
  }

  return <StyledBanner>{message}</StyledBanner>;
};

export default EnvironmentBanner;
