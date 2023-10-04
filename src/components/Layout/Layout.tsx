import { Link, Outlet } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AppModals } from '../../modals';

export function Layout() {
  // TODO: Should maybe not use mainstore hook?
  const { authStore } = useMainStore();
  return (
    <>
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

      <StyledContent>
        <Outlet />
        <AppModals />
      </StyledContent>
    </>
  );
}

const StyledHeader = styled.header`
  background-color: ${(p) => p.theme.colors.primary};
  padding: ${(p) => p.theme.spacing.m} ${(p) => p.theme.spacing.l};
`;

const StyledNav = styled.nav`
  display: flex;
  gap: ${(p) => p.theme.spacing.s};
`;

const Anchor = styled(Link)`
  color: ${(p) => p.theme.colors.highlight};
`;

const StyledContent = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  padding: 16px 24px;
  max-width: 600px;
`;
