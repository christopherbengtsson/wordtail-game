import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../..';
import { useMainStore } from '../../../stores';
import { AppBar, Button, Frame, Toolbar } from 'react95';
import { styled, useTheme } from 'styled-components';
import { isDev } from '../../../Constants';
import { AgentIcon, JoystickIcon } from '../../assets/img';
import { Fragment, useEffect, useState } from 'react';

const getTime = () => {
  const date = new Date();
  let h: string | number = date.getHours();
  let min: string | number = date.getMinutes();
  if (h < 10) h = `0${h}`;
  if (min < 10) min = `0${min}`;

  return `${h}:${min}`;
};
export function NavBar() {
  const t = useTranslation();
  const { authStore } = useMainStore();
  const { pathname } = useLocation();
  const theme = useTheme();
  const [time, setTime] = useState(
    `${new Date().getHours()}:${new Date().getMinutes()}`,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

        <Frame
          variant="field"
          style={{
            background: theme.material,
            padding: `${theme.spacing.xs} ${theme.spacing.s}`,
          }}
        >
          {time}
        </Frame>
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
  justify-content: space-between;
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.s};
`;

const Anchor = styled(Link)`
  color: ${(p) => p.theme.materialText};
`;
