import { MOBILE_SCREEN_WIDTH, zIndexes } from './Constants';
import { fontFamilies, spacing } from './designTokens';

// import original from 'react95/dist/themes/original';
// import original from 'react95/dist/themes/tokyoDark';
import original from 'react95/dist/themes/vistaesqueMidnight';

export const colors = {
  ...original,
  materialTextPlaceholder: '#757575',
  error: '#B00000',
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

export {};

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ITheme {}
}
