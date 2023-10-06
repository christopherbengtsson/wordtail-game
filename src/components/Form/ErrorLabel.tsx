import { styled } from 'styled-components';
import { SmallBody } from '..';
import { FormikErrors } from 'formik';

export function ErrorLabel({
  value,
}: {
  value:
    | string
    | FormikErrors<unknown>
    | string[]
    | FormikErrors<unknown>[]
    | undefined;
}) {
  return <StyledSmallBody>{`${value}`}</StyledSmallBody>;
}

const StyledSmallBody = styled(SmallBody)`
  color: ${(p) => p.theme.error};
`;
