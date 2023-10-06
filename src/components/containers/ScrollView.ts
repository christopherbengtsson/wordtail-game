import { styled } from 'styled-components';
import { ScrollBar } from './scrollbar';

export const ScrollView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 auto;

  overflow-y: auto;
  overflow-x: hidden;

  ${ScrollBar}
`;
