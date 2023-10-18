import { styled } from 'styled-components';

export const CenterContainer = styled.div<{
  skipFlexGrow?: boolean;
  fullWidth?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(p) => p.theme.spacing.m};
  text-align: center;

  ${(p) => !p.skipFlexGrow && 'flex: 1 1 auto;'}
  ${(p) => p.fullWidth && 'width: 100%;'}
`;
