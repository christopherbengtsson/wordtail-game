import {
  Button as ReactButton,
  ButtonProps as ReactButtonProps,
} from 'react95';
import { css, styled } from 'styled-components';
import { BodyAsTitleWrapper, IColors } from '..';
import { forwardRef } from 'react';

type ExtendedButtonProps = {
  colorVariant?: keyof IColors;
};

export type ButtonProps = ReactButtonProps & ExtendedButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ children, primary, ...props }, ref) {
    return (
      <StyledButton {...props} ref={ref} primary={primary}>
        {primary ? (
          <BodyAsTitleWrapper>{children}</BodyAsTitleWrapper>
        ) : (
          children
        )}
      </StyledButton>
    );
  },
);

export const StyledButton = styled(ReactButton)<ButtonProps>`
  width: auto;
  padding: 0 ${(p) => p.theme.spacing.l};

  &:hover {
    text-decoration: underline;
  }

  ${(p) => p.size === 'lg' && `height: ${p.theme.sizes.buttonHeight}`};

  ${(p) => {
    if (p.colorVariant) {
      return css`
        background-color: ${p.theme[p.colorVariant]};
        color: ${p.theme.materialTextInvert};

        &::before {
          border-top-color: ${p.theme[p.colorVariant]};
          border-left-color: ${p.theme[p.colorVariant]};
        }
      `;
    }
  }}
`;
