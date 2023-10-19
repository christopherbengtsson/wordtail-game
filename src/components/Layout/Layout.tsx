import { Outlet, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { AppModals } from '../../modals';
import { BodyBold, HEADER_HEIGHT, ScrollView } from '..';
import { MainContentContainer, MainWrapper } from './LayoutStyles';
import { createBorderStyles } from '../shared/common';
import { CommonThemeProps } from 'react95/dist/types';
import { Button } from 'react95';
import { NavBar } from './NavBar';

export function Layout() {
  const navigate = useNavigate();

  return (
    <>
      <RelativeContainer>
        <StyledHeader>
          <div>
            <BodyBold color="materialTextInvert">wordtail.exe</BodyBold>
          </div>
          <div>
            <Button
              size="sm"
              aria-label="Gå bakåt"
              square
              onClick={() => {
                navigate(-1);
              }}
            >
              <span role="img" aria-label="arrow-back">
                ←
              </span>
            </Button>
            <Button
              size="sm"
              aria-label="Gå framåt"
              square
              onClick={() => {
                navigate(1);
              }}
            >
              <span role="img" aria-label="arrow-forward">
                →
              </span>
            </Button>
          </div>
        </StyledHeader>

        <MainWrapper>
          <ScrollView>
            <MainContentContainer>
              <Outlet />
              <AppModals />
            </MainContentContainer>
          </ScrollView>
        </MainWrapper>
        {<NavBar />}
      </RelativeContainer>
    </>
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
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(p) => p.theme.headerBackground};
  padding: ${(p) => p.theme.spacing.m};
  margin: ${(p) => p.theme.spacing.xs};
  height: ${HEADER_HEIGHT}px;
`;
