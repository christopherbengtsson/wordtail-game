import { styled } from 'styled-components';
import { ScrollBar } from './scrollbar';

export const ScrollView = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 4px;
  overflow: auto;

  ${ScrollBar}
`;
