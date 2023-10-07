import { styled } from 'styled-components';
import { StyledScrollBar } from './scrollbar';

export const ScrollView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 auto;

  overflow-y: scroll;
  overflow-x: hidden;

  // ${(p) => p.theme.screens.large} {
    ${StyledScrollBar}
  // }
`;
