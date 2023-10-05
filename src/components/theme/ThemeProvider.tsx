import './styles/reset.css';
import './styles/style.css';
import isPropValid from '@emotion/is-prop-valid';
import { useLayoutEffect } from 'react';
import {
  StyleSheetManager,
  ThemeProvider as StyledThemeProvider,
} from 'styled-components';
import { colors, theme } from './theme';
import { createCssVarsFromPalette } from './createCssVarsFromPalette';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    // Add palette as css variables
    const css = createCssVarsFromPalette(colors);
    const style = document.createElement('style');
    style.dataset.name = 'palette';
    document.head.append(style);
    style.appendChild(document.createTextNode(css));
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </StyleSheetManager>
  );
}
