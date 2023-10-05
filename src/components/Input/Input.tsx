import { styled } from 'styled-components';
import { TextInput } from 'react95';

export const Input = styled(TextInput)`
  input {
    height: ${(p) => p.theme.sizes.buttonHeight};
  }
`;
