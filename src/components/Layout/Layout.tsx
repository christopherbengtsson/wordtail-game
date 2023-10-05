import { Link, Outlet } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AppModals } from '../../modals';
import { ScrollView } from '..';

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
        <ScrollView>
          <Outlet />
        </ScrollView>

        <AppModals />
      </StyledContent>
    </>
  );
}

const StyledHeader = styled.header`
  background-color: ${(p) => p.theme.headerBackground};
  padding: ${(p) => p.theme.spacing.m} ${(p) => p.theme.spacing.l};
`;

const StyledNav = styled.nav`
  display: flex;
  gap: ${(p) => p.theme.spacing.s};
`;

const Anchor = styled(Link)`
  color: ${(p) => p.theme.materialTextInvert};
`;

const StyledContent = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  overflow: hidden;
  max-width: 600px;

  ${(p) => p.theme.screens.large} {
    padding: ${(p) => p.theme.spacing.m};
  }
`;
