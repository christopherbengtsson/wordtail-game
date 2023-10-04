import styled, { css } from 'styled-components';

export const ANIMATION_TIME = 300;
export const AnimationTime = `${ANIMATION_TIME}ms`;
export type ModalSize = 'small' | 'large';
const MODAL_SIZE_MAP: Record<ModalSize, string> = {
  small: '476px',
  large: '648px',
};
export const LayoutIdMap = {
  modalContainer: 'modal-container',
  modalHeaderContainer: 'modal-header-container',
};
export const LayoutClassMap = {
  gradientActive: 'gradient-active',
};
export const StyledModalHeaderContainer = styled.div`
  border: 2px solid rgb(198, 198, 198);
  background-color: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.highlight};
  z-index: ${(p) => p.theme.zIndexes.label + 1};
  position: absolute;
  top: ${(p) => p.theme.spacing.tiny};
  right: ${(p) => p.theme.spacing.tiny};
  left: ${(p) => p.theme.spacing.tiny};
  height: ${(p) => p.theme.spacing.xxl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

export const StyledOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0);
  z-index: ${(props) => props.theme.zIndexes.modal};

  &.overlay-after-open {
    background: rgba(46, 46, 50, 0.5);
    transition: background-color ${AnimationTime};
  }
  &.overlay-before-close {
    background-color: rgba(0, 0, 0, 0);
  }
`;

export const StyledModalContent = styled.div<{ size: ModalSize }>`
  position: absolute;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.background};
  opacity: 0;

  padding: ${(p) => p.theme.spacing.tiny};
  border-style: solid;
  border-width: 2px;
  border-color: rgb(223, 223, 223) rgb(10, 10, 10) rgb(10, 10, 10)
    rgb(223, 223, 223);
  box-shadow: rgba(0, 0, 0, 0.35) 4px 4px 10px 0px,
    rgb(254, 254, 254) 1px 1px 0px 1px inset,
    rgb(132, 133, 132) -1px -1px 0px 1px inset;
  box-sizing: border-box;
  display: inline-block;
  background: rgb(198, 198, 198);

  width: 100%;
  max-height: 90vh;
  max-height: 90dvh;
  overflow: hidden;
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

export const StyledModalInnerContent = styled.div<{ fullWidth?: boolean }>`
  width: 100%;
  ${(p) =>
    !p.fullWidth &&
    css`
      padding: ${(p) => p.theme.spacing.s};
      max-width: 476px;
      margin-top: ${(p) => p.theme.spacing.xxl};
    `};

  ${(p) => p.theme.screens.large} {
    max-height: 576px;
  }
`;
