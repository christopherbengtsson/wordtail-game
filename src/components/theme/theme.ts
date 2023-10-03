import { MOBILE_SCREEN_WIDTH } from './Constants';

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
    primary: 'w95fa',
    sizes: {
      small: '0.75rem', // Equivalent to 12px for a base of 16px
      medium: '0.875rem', // Equivalent to 14px for a base of 16px
      large: '1rem', // Equivalent to 16px for a base of 16px
    },
  },
  sizes: {
    windowBorder: '2px',
    borderRadius: '4px',
    buttonHeight: '40px',
    borderWidth: '2px',
    buttonPadding: '10px',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  },
  spacing: {
    tiny: '4px',
    xs: '8px',
    s: '16px',
    m: '24px',
    l: '32px',
    xl: '40px',
    xxl: '48px',
    xxxl: '56px',
  },
  screens: {
    small: `@media only screen and (max-width: ${MOBILE_SCREEN_WIDTH}px)`,
    large: `@media only screen and (min-width: ${MOBILE_SCREEN_WIDTH}.001px)`,
  },
};

export type ITheme = typeof theme;

export {};

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ITheme {}
}
