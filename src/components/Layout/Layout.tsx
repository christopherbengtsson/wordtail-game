import { Link, Outlet, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AppModals } from '../../modals';
import { HEADER_HEIGHT, ScrollView, useTranslation } from '..';
import { MainContentContainer, MainWrapper } from './LayoutStyles';
import { createBorderStyles } from '../shared/common';
import { CommonThemeProps } from 'react95/dist/types';
import { isDev } from '../../Constants';

export function Layout() {
  const t = useTranslation();
  const { authStore } = useMainStore();
  const { pathname } = useLocation();

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
          <Anchor isActive={pathname === '/'} to="/">
            {t('nav.header.games')}
          </Anchor>
          <Anchor
            isActive={pathname.includes('/profiles')}
            to={`/profiles/:${authStore.userId}`}
          >
            {t('nav.header.profil')}
          </Anchor>
          {isDev && (
            <Anchor isActive={pathname === '/dev'} to="/dev">
              Dev
            </Anchor>
          )}
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
  background: ${(p) => p.theme.headerBackground};
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

const Anchor = styled(Link)<{ isActive: boolean }>`
  color: ${(p) => p.theme.headerText};
  text-decoration: ${(p) => (p.isActive ? 'underline' : 'none')};
`;
