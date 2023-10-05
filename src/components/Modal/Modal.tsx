import ReactModal from 'react-modal';
import {
  ANIMATION_TIME,
  ModalSize,
  StyledModalContent,
  StyledModalInnerContent,
  StyledOverlay,
} from './styles';
import { useStateIfMounted } from '../../hooks';
import { BodyAsTitleWrapper, Button } from '..';
import { Window, WindowContent, WindowHeader } from 'react95';
import { styled } from 'styled-components';

export interface ModalProps {
  title: string;
  open: boolean;
  size?: ModalSize;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonLabel?: string;
  onClose?: () => void;
  onRequestClose: () => void;
  /* String indicating how the content container should be announced to screenreaders. */
  contentLabel?: string;
  aria?: {
    /** Defines a string value that labels the current element. */
    labelledby?: string;
    /** Identifies the element (or elements) that describes the object. */
    describedby?: string;
  };
}
export function Modal({
  title,
  open,
  size = 'large',
  children,
  onRequestClose,
  contentLabel,
  aria,
}: ModalProps) {
  const [isLocalOpen, setIsLocalOpen] = useStateIfMounted(false);

  const handleAfterOpen = () => {
    // setTimeout is to fix safari animation bug
    setTimeout(() => {
      setIsLocalOpen(true);
    }, 0);
  };

  const handleAfterClose = () => {
    setTimeout(() => {
      setIsLocalOpen(false);
    }, 0);
  };

  return (
    <ReactModal
      isOpen={open}
      ariaHideApp={false}
      aria={aria}
      contentLabel={contentLabel}
      onRequestClose={onRequestClose}
      onAfterOpen={handleAfterOpen}
      onAfterClose={handleAfterClose}
      closeTimeoutMS={ANIMATION_TIME}
      overlayClassName={{
        base: `ReactModal__Overlay`,
        afterOpen: isLocalOpen ? 'overlay-after-open' : '',
        beforeClose: 'overlay-before-close',
      }}
      className={{
        base: `react-modal`,
        afterOpen: isLocalOpen ? 'content-after-open' : '',
        beforeClose: 'content-before-close',
      }}
      contentElement={(contentElProps, children) => (
        <StyledModalContent {...contentElProps} size={size}>
          {children}
        </StyledModalContent>
      )}
      overlayElement={(props, contentElement) => (
        <StyledOverlay {...props}>{contentElement}</StyledOverlay>
      )}
    >
      <ModalWrapper>
        <ModalHader>
          <BodyAsTitleWrapper autoFocus>{title}</BodyAsTitleWrapper>
          <Button onClick={onRequestClose}>
            <CloseIcon />
          </Button>
        </ModalHader>
        <WindowContent>
          <StyledModalInnerContent>{children}</StyledModalInnerContent>
        </WindowContent>
      </ModalWrapper>
    </ReactModal>
  );
}

const ModalWrapper = styled(Window)`
  width: 100%;
`;
const ModalHader = styled(WindowHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${(p) => p.theme.spacing.xxl};
`;

const CloseIcon = styled.span`
  display: inline-block;
  width: ${(p) => p.theme.spacing.s};
  height: ${(p) => p.theme.spacing.s};
  margin-left: -1px;
  margin-top: -1px;
  transform: rotateZ(45deg);
  position: relative;
  &:before,
  &:after {
    content: '';
    position: absolute;
    background: ${({ theme }) => theme.materialText};
  }
  &:before {
    height: 100%;
    width: 3px;
    left: 50%;
    transform: translateX(-50%);
  }
  &:after {
    height: 3px;
    width: 100%;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
`;
