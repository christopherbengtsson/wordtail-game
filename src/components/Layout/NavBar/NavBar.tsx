import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../..';
import { useMainStore } from '../../../stores';
import { AppBar, Button, Toolbar } from 'react95';
import { styled } from 'styled-components';
import { isDev } from '../../../Constants';
import { AgentIcon, JoystickIcon } from '../../assets/img';
import { Fragment } from 'react';

export function NavBar() {
  const t = useTranslation();
  const { authStore } = useMainStore();
  const { pathname } = useLocation();

  const routes = [
    {
      label: t('nav.header.games'),
      path: '/',
      isActive: pathname === '/',
      icon: JoystickIcon,
    },
    {
      label: t('nav.header.profil'),
      path: `/profiles/:${authStore.userId}`,
      isActive: pathname.includes('/profiles'),
      icon: AgentIcon,
    },
  ];

  return (
    <StyledAppBar>
      <StyledToolbar>
        <StyledNav>
          {routes.map(({ label, path, isActive, icon }) => (
            <Fragment key={path}>
              <Anchor to={path}>
                <Button tabIndex={-1} active={isActive}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <img width={20} src={icon} />
                    {label}
                  </div>
                </Button>
              </Anchor>
            </Fragment>
          ))}

          {isDev && (
            <Anchor to="/dev">
              <Button tabIndex={-1} active={pathname === '/dev'}>
                Dev
              </Button>
            </Anchor>
          )}
        </StyledNav>
      </StyledToolbar>
    </StyledAppBar>
  );
}

const StyledAppBar = styled(AppBar)`
  top: unset;
  bottom: 0;

  ${(p) => p.theme.screens.small} {
    flex-shrink: 0;
    position: relative;
  }
`;

const StyledToolbar = styled(Toolbar)`
  height: ${(p) => p.theme.sizes.buttonHeight};
  padding: 0 ${(p) => p.theme.spacing.m};
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.s};
`;

const Anchor = styled(Link)`
  color: ${(p) => p.theme.materialText};
`;
