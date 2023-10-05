import { StyledButton, ButtonProps } from 'react95';
import { styled } from 'styled-components';

export const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
> = styled(StyledButton)`
  ${(p) => p.size === 'lg' && `height: ${p.theme.sizes.buttonHeight}`};
  width: auto;
  padding: 0 ${(p) => p.theme.spacing.l};

  &:hover {
    text-decoration: underline;
  }
`;
