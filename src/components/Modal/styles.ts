import { styled } from 'styled-components';

export const ANIMATION_TIME = 300;
export const AnimationTime = `${ANIMATION_TIME}ms`;
export type ModalSize = 'small' | 'large';
const MODAL_SIZE_MAP: Record<ModalSize, string> = {
  small: '476px',
  large: '648px',
};

export const StyledOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0);
  z-index: ${(props) => props.theme.zIndexes.modal};

  &.overlay-after-open {
    background: rgba(46, 46, 50, 0.5);
    transition: background-color ${AnimationTime};
    backdrop-filter: blur(2px);
  }
  &.overlay-before-close {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: none;
  }
`;

export const StyledModalContent = styled.div<{ size: ModalSize }>`
  position: absolute;
  bottom: 0;
  opacity: 0;

  width: 100%;
  max-height: 90vh;
  max-height: 90dvh;
  // overflow: hidden;
  display: flex;
  flex-direction: column;

  &:focus {
    outline-style: none;
  }

  transition: transform ${AnimationTime};
  will-change: transform;

  transform: translateY(0);

  &.content-after-open {
    opacity: 1;
    animation: slideUp ${AnimationTime} ease-in-out;
  }
  &.content-before-close {
    transform: translateY(100%);
  }

  @keyframes slideUp {
    0% {
      transform: translateY(100%);
    }

    100% {
      transform: translateY(0);
    }
  }

  ${(p) => p.theme.screens.large} {
    height: auto;
    width: ${(p) => MODAL_SIZE_MAP[p.size]};
    max-width: 100%;
    max-height: 100%;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    transform: translate(-50%, -50%);

    &.content-after-open {
      animation: slideUpDesktop ${AnimationTime} ease-in-out;
    }

    &.content-before-close {
      transform: translate(-50%, 100%);
    }

    @keyframes slideUpDesktop {
      0% {
        transform: translate(-50%, 100%);
      }

      100% {
        transform: translate(-50%, -50%);
      }
    }
  }
`;

export const StyledModalInnerContent = styled.div`
  width: 100%;
  padding: ${(p) => p.theme.spacing.s};
  max-width: 476px;

  ${(p) => p.theme.screens.large} {
    max-height: 576px;
  }
`;
