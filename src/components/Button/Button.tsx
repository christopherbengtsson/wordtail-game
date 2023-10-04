import { styled, css } from 'styled-components';

const baseButtonStyles = css`
  height: ${(p) => p.theme.sizes.buttonHeight};
  width: auto;
  padding: 0 ${(p) => p.theme.spacing.l};
  font: inherit;
  box-sizing: border-box;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.textColor};
  border: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  :disabled {
    cursor: not-allowed;
    color: ${(p) => p.theme.colors.textColorDisabled};
  }

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const pressingEffect = css`
  &:before {
    box-sizing: border-box;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-style: solid;
  }

  &:after {
    content: '';
    position: absolute;
    display: block;
    height: 100%;
    width: 100%;
  }

  &:active,
  &:focus {
    &:after {
      outline: ${(p) => p.theme.colors.lowlight} dotted
        ${(p) => p.theme.sizes.borderWidth};
      outline-offset: -8px;
    }
  }
`;

export const Button = styled.button`
  ${baseButtonStyles}
  ${pressingEffect}

  &:before {
    left: 0;
    top: 0;
    border-width: ${(p) => p.theme.sizes.borderWidth};
    border-color: ${(p) => p.theme.colors.highlight}
      ${(p) => p.theme.colors.lowlight} ${(p) => p.theme.colors.lowlight}
      ${(p) => p.theme.colors.highlight};
    box-shadow: ${(p) => p.theme.colors.shadowLight} 1px 1px 0 1px inset,
      ${(p) => p.theme.colors.shadowDark} -1px -1px 0 1px inset;
  }

  &:active {
    &:before {
      border-color: ${(p) => p.theme.colors.lowlight}
        ${(p) => p.theme.colors.highlight} ${(p) => p.theme.colors.highlight}
        ${(p) => p.theme.colors.lowlight};
      box-shadow: ${(p) => p.theme.colors.shadowDark} 1px 1px 0 1px inset,
        ${(p) => p.theme.colors.shadowLight} -1px -1px 0 1px inset;
    }
  }

  margin-bottom: 20px;
`;

export const PrimaryButton = styled.button`
  ${baseButtonStyles}
  ${pressingEffect}

  &:before {
    left: 2px;
    top: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    outline: rgb(10, 10, 10) solid 2px;
    border-width: 2px;
    border-color: rgb(254, 254, 254) rgb(10, 10, 10) rgb(10, 10, 10)
      rgb(254, 254, 254);
    box-shadow: rgb(223, 223, 223) 1px 1px 0px 1px inset,
      rgb(132, 133, 132) -1px -1px 0px 1px inset;
  }

  &:active {
    padding-top: 2px;
    &:before {
      border-color: rgb(10, 10, 10) rgb(254, 254, 254) rgb(254, 254, 254)
        rgb(10, 10, 10);
      box-shadow: rgb(132, 133, 132) 1px 1px 0px 1px inset,
        rgb(223, 223, 223) -1px -1px 0px 1px inset;
    }
  }
`;
