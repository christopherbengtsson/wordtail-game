import { Link, Outlet } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AppModals } from '../../modals';
import { HEADER_HEIGHT, ScrollView } from '..';
import { MainContentContainer, MainWrapper } from './LayoutStyles';
import { createBorderStyles } from '../shared/common';
import { CommonThemeProps } from 'react95/dist/types';

export function Layout() {
  const { authStore } = useMainStore();

  return (
    <RelativeContainer>
      <StyledHeader
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <StyledNav>
          <Anchor to="/">Home</Anchor>
          <Anchor to={`/profiles/:${authStore.userId}`}>Profile</Anchor>
        </StyledNav>
      </StyledHeader>

      <MainWrapper>
        <ScrollView>
          <MainContentContainer>
            <Outlet />
            <AppModals />
          </MainContentContainer>
        </ScrollView>
      </MainWrapper>
    </RelativeContainer>
  );
}

const RelativeContainer = styled.div<CommonThemeProps>`
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
  background: ${(p) => p.theme.material};
  display: flex;
  flex-direction: column;

  ${createBorderStyles({ style: 'window' })}
`;

const StyledHeader = styled.header`
  background-color: ${(p) => p.theme.headerBackground};
  padding: ${(p) => p.theme.spacing.m};
  height: ${HEADER_HEIGHT}px;
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
`;

const StyledNav = styled.nav`
  display: flex;
  gap: ${(p) => p.theme.spacing.s};
`;

const Anchor = styled(Link)`
  color: ${(p) => p.theme.materialTextInvert};
`;
