import { useEffect } from 'react';
import { styled } from 'styled-components';

export function ZoomInZoomOut({
  text,
  iterationCount,
  duration,
}: {
  text: string;
  iterationCount: number;
  duration?: number;
}) {
  useEffect(() => {
    console.log(text);
  }, [text]);
  return (
    <StyledH1
      $iteration={iterationCount}
      $duration={duration}
      className="zoomInZoomOut"
    >
      {text}
    </StyledH1>
  );
}

const StyledH1 = styled.h1<{ $iteration: number; $duration?: number }>`
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

  animation-name: zoomInZoomOut;
  animation-duration: ${(p) => p.$duration ?? 1}s;
  animation-iteration-count: ${(p) => p.$iteration};
`;
