import ReactModal from 'react-modal';
import {
  ANIMATION_TIME,
  LayoutIdMap,
  ModalSize,
  StyledModalContent,
  StyledModalHeaderContainer,
  StyledModalInnerContent,
  StyledOverlay,
} from './styles';
import { useStateIfMounted } from '../../hooks';
import { SecondaryTitleWrapper } from '..';

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
  showCloseButton,
  closeButtonLabel = 'Close',
  onClose,
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
      {showCloseButton && onClose && (
        <ModalHeaderContainer
          title={title}
          onClose={onClose}
          closeButtonLabel={closeButtonLabel}
        />
      )}
      <StyledModalInnerContent>{children}</StyledModalInnerContent>
    </ReactModal>
  );
}

function ModalHeaderContainer({
  title,
  onClose,
  closeButtonLabel,
}: {
  title: string;
  onClose: () => void;
  closeButtonLabel: string;
}) {
  return (
    <>
      <StyledModalHeaderContainer id={LayoutIdMap.modalHeaderContainer}>
        <SecondaryTitleWrapper>{title}</SecondaryTitleWrapper>
        <button name="close" onClick={onClose}>
          {closeButtonLabel}
        </button>
      </StyledModalHeaderContainer>
    </>
  );
}
