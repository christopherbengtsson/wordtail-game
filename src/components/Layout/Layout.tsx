import { Link, Outlet } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AppModals } from '../../modals';
import { HEADER_HEIGHT, ScrollView } from '..';
import { MainContentContainer, MainWrapper } from './LayoutStyles';

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

const RelativeContainer = styled.div`
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
  background: ${(p) => p.theme.material};
  display: flex;
  flex-direction: column;

  border-style: solid;
  border-width: 2px;
  border-color: rgb(223, 223, 223) rgb(10, 10, 10) rgb(10, 10, 10)
    rgb(223, 223, 223);
  box-shadow: rgba(0, 0, 0, 0.35) 4px 4px 10px 0px,
    rgb(254, 254, 254) 1px 1px 0px 1px inset,
    rgb(132, 133, 132) -1px -1px 0px 1px inset;
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
