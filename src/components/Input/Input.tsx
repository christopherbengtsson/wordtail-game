import { styled } from 'styled-components';
import { TextInput } from 'react95';

export const Input = styled(TextInput)`
  height: ${(p) => p.theme.sizes.buttonHeight};

  input {
    height: ${(p) => p.theme.sizes.buttonHeight};
  }
`;
