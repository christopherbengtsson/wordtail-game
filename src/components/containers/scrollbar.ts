import { css } from 'styled-components';

const nodeBtoa = (string: string) => Buffer.from(string).toString('base64');
const base64encode = typeof btoa !== 'undefined' ? btoa : nodeBtoa;

const createTriangleSVG = (color: string, angle = 0) => {
  const svg = `<svg height="26" width="26" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g transform="rotate(${angle} 13 13)">
      <polygon fill="${color}" points="6,10 20,10 13,17"/>
    </g>
  </svg>`;
  const encoded = base64encode(svg);
  return `url(data:image/svg+xml;base64,${encoded})`;
};

const scrollbarButtons = css`
  &::-webkit-scrollbar-button {
    box-sizing: border-box;
    background: 0px 0px / 100% no-repeat ${(p) => p.theme.material};
    color: ${(p) => p.theme.borderDarkest};
    border-style: solid;
    border-width: 2px;
    border-color: ${(p) => p.theme.borderLight} ${(p) => p.theme.borderDarkest}
      ${(p) => p.theme.borderDarkest} ${(p) => p.theme.borderLight};
    box-shadow: ${(p) => p.theme.borderLightest} 1px 1px 0px 1px inset,
      ${(p) => p.theme.borderDark} -1px -1px 0px 1px inset;
    display: block;
    outline-offset: -2px;
    height: 26px;
    width: 26px;
  }

  &::-webkit-scrollbar-button:active {
    background-position: 0px 1px;
    border-style: solid;
    border-width: 2px;
    border-color: ${(p) => p.theme.borderDarkest} ${(p) => p.theme.borderLight}
      ${(p) => p.theme.borderLight} ${(p) => p.theme.borderDarkest};
    box-shadow: ${(p) => p.theme.borderDark} 1px 1px 0px 1px inset,
      ${(p) => p.theme.borderLightest} -1px -1px 0px 1px inset;
  }

  // To remove double in/decrement buttons
  &::-webkit-scrollbar-button:horizontal:increment:start,
  &::-webkit-scrollbar-button:horizontal:decrement:end,
  &::-webkit-scrollbar-button:vertical:increment:start,
  &::-webkit-scrollbar-button:vertical:decrement:end {
    display: none;
  }

  &::-webkit-scrollbar-button:vertical:decrement {
    background-image: ${({ theme }) =>
      createTriangleSVG(theme.materialText, 180)};
  }
  &::-webkit-scrollbar-button:vertical:increment {
    background-image: ${({ theme }) =>
      createTriangleSVG(theme.materialText, 0)};
  }
`;

const scrollbar = css`
  --scrollbarWidth: 26px;

  &::-webkit-scrollbar {
    width: var(--scrollbarWidth);
    height: var(--scrollbarWidth);
  }

  &::-webkit-scrollbar-corner {
    background-color: ${(p) => p.theme.material};
  }

  &::-webkit-scrollbar-thumb {
    box-sizing: border-box;
    display: inline-block;
    background: ${(p) => p.theme.material};
    color: ${(p) => p.theme.borderDarkest};
    border-style: solid;
    border-width: 2px;
    border-color: ${(p) => p.theme.borderLight} ${(p) => p.theme.borderDarkest}
      ${(p) => p.theme.borderDarkest} ${(p) => p.theme.borderLight};
    box-shadow: ${(p) => p.theme.borderLightest} 1px 1px 0px 1px inset,
      ${(p) => p.theme.borderDark} -1px -1px 0px 1px inset;
    outline-offset: -2px;
  }

  &::-webkit-scrollbar-track {
    background-image: linear-gradient(
        45deg,
        ${(p) => p.theme.material} 25%,
        transparent 25%,
        transparent 75%,
        ${(p) => p.theme.material} 75%
      ),
      linear-gradient(
        45deg,
        ${(p) => p.theme.material} 25%,
        transparent 25%,
        transparent 75%,
        ${(p) => p.theme.material} 75%
      );
    background-color: ${(p) => p.theme.borderLightest};
    background-size: 4px 4px;
    background-position: 0px 0px, 2px 2px;
  }
`;

export const StyledScrollBar = css`
  ${scrollbarButtons}
  ${scrollbar}
`;
