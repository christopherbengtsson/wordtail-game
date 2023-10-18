import { Monitor } from 'react95';
import { styled, useTheme } from 'styled-components';

export function ZoomInZoomOut({
  text,
  iterationCount,
  duration,
}: {
  text: string;
  iterationCount: number;
  duration?: number;
}) {
  const theme = useTheme();
  return (
    <Monitor backgroundStyles={{ background: theme.desktopBackground }}>
      <Absolute>
        <StyledH1
          $iteration={iterationCount}
          $duration={duration}
          className="zoomInZoomOut"
        >
          {text}
        </StyledH1>
      </Absolute>
    </Monitor>
  );
}

const Absolute = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const StyledH1 = styled.h1<{
  $iteration: number;
  $duration?: number;
}>`
  @keyframes zoomInZoomOut {
    0%,
    100% {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3);
    }

    50% {
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
  }

  opacity: 0;
  font-size: 8rem;
  color: ${(p) => p.theme.materialTextInvert};

  animation-name: zoomInZoomOut;
  animation-duration: ${(p) => p.$duration ?? 1000}ms;
  animation-iteration-count: ${(p) => p.$iteration};
`;
