export function createCssVarsFromPalette(palette: Record<string, string>) {
  const cssVars = Object.entries(palette).reduce((acc, curr) => {
    acc += `--${curr[0]}: ${curr[1]};\n`;
    return acc;
  }, '');
  const css = `:root {${cssVars}}`;
  return css;
}
