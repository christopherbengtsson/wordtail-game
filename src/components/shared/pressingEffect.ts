import { css } from 'styled-components';

export const secondaryPress = css`
  &:before {
    box-sizing: border-box;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-style: solid;
    border-width: ${(props) => props.theme.sizes.borderWidth};
    border-color: ${(props) => props.theme.colors.highlight}
      ${(props) => props.theme.colors.lowlight}
      ${(props) => props.theme.colors.lowlight}
      ${(props) => props.theme.colors.highlight};
    box-shadow: ${(props) => props.theme.colors.shadowLight} 1px 1px 0 1px inset,
      ${(props) => props.theme.colors.shadowDark} -1px -1px 0 1px inset;
  }

  &:after {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  &:active {
    &:before {
      border-color: ${(props) => props.theme.colors.lowlight}
        ${(props) => props.theme.colors.highlight}
        ${(props) => props.theme.colors.highlight}
        ${(props) => props.theme.colors.lowlight};
      box-shadow: ${(props) => props.theme.colors.shadowDark} 1px 1px 0 1px
          inset,
        ${(props) => props.theme.colors.shadowLight} -1px -1px 0 1px inset;
    }

    &:after {
      outline: ${(props) => props.theme.colors.lowlight} dotted
        ${(props) => props.theme.sizes.borderWidth};
      outline-offset: -8px;
    }
  }

  &:focus {
    &:after {
      outline: ${(props) => props.theme.colors.lowlight} dotted
        ${(props) => props.theme.sizes.borderWidth};
      outline-offset: -8px;
    }
  }
`;
