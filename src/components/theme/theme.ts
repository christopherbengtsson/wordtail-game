import { MOBILE_SCREEN_WIDTH, zIndexes } from './Constants';
import { fontFamilies, spacing } from './designTokens';

export const theme = {
  colors: {
    primary: '#000080', // Primary blue
    lightBlue: 'rgb(16, 52, 166)',
    secondary: '#008080', // Secondary teal
    gray: '#C0C0C0', // Gray
    lightGray: '#F0F0F0', // Light Gray
    darkGray: '#808080', // Dark Gray
    highlight: '#FEFEFE', // White
    lowlight: '#0A0A0A', // Black
    error: '#FF0000', // Error Red
    background: '#C6C6C6',
    textColor: '#0A0A0A',
    textColorDisabled: 'rgb(132, 133, 132)',
    shadowLight: '#DFDFDF',
    shadowDark: '#848586',
  },
  fonts: {
    ...fontFamilies,
  },
  sizes: {
    windowBorder: '2px',
    borderRadius: '4px',
    buttonHeight: '48px',
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
