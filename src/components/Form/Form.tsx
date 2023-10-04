import { styled } from 'styled-components';
import { Form } from 'formik';

export const StyledForm = styled(Form)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 8px;

  .customFormikInput {
    width: 100%;
  }

  button {
    align-self: flex-end;
  }

  p {
    align-self: flex-start;
  }
`;
