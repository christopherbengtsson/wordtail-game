import { MOBILE_SCREEN_WIDTH, zIndexes } from './Constants';
import { fontFamilies, spacing } from './designTokens';

import original from 'react95/dist/themes/millenium';

/**
 * 'react95/dist/themes/original';
 * 'react95/dist/themes/tokyoDark';
 */
export const colors = {
  ...original,
  materialTextPlaceholder: '#757575',
  error: '#B00000',
  white: '#fff',
  black: '#000',
};
export type IColors = typeof colors;

export const theme = {
  ...colors,
  fonts: {
    ...fontFamilies,
  },
  sizes: {
    windowBorder: '2px',
    borderRadius: '4px',
    buttonHeight: '48px',
    inputOuterHeight: '56px',
    borderWidth: '2px',
    buttonPadding: '10px',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  },
  spacing,
  screens: {
    small: `@media only screen and (max-width: ${MOBILE_SCREEN_WIDTH}px)`,
    large: `@media only screen and (min-width: ${MOBILE_SCREEN_WIDTH}.001px)`,
  },
  zIndexes,
};

export type ITheme = typeof theme;
