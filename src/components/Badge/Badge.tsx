import { styled } from 'styled-components';

export const Badge = styled.div`
  background: ${(p) => p.theme.error};
  color: ${(p) => p.theme.white};
  position: absolute;
  width: 16px;
  height: 24px;
  top: -16px;
  right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  z-index: 1;
`;
