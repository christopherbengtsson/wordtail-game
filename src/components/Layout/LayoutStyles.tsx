import { styled } from 'styled-components';
import { FORM_MAX_WIDTH_DESKTOP } from '..';

/**
 * MainWrapper is a <main> tag that wraps all content except the header and footer.
 * Expects to have a MainContentContainer as a child.
 */
export const MainWrapper = styled.main`
  flex: 1 1 auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
`;

/**
 * MainContentContainer sets a max-width and centers the content.
 */
export const MainContentContainer = styled.div`
  flex: 1 1 auto;
  margin: ${(p) => p.theme.spacing.l} auto;
  width: 100%;
  max-width: ${FORM_MAX_WIDTH_DESKTOP}px;
  display: flex;
  flex-direction: column;

  /* For mobile screens we add a small padding to the content */
  ${(p) => p.theme.screens.small} {
    padding-left: ${(p) => p.theme.spacing.s};
    padding-right: ${(p) => p.theme.spacing.s};
  }
`;
